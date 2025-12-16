# K3s Deployment Guide - BlackRoad OS

**Created**: 2025-12-13
**Status**: K3s master node RUNNING on raspberrypi (192.168.4.49)

---

## Current Status

### ✅ Deployed Services

**Headscale Mesh VPN**
- Host: alice-pi (192.168.4.49)
- Public URL: https://headscale.blackroad.io.blackroad.systems
- Status: Running via Cloudflare Tunnel
- Pre-auth key: `237ea39d43b4a69a3c98de277a9494e89567b5a11d60e8f7`

**K3s Kubernetes Cluster**
- Master node: raspberrypi (192.168.4.49)
- Version: v1.33.6+k3s1
- Status: Ready
- Node token: `K1048cb45cf1bd04b9f1eaee6d3a02c4f576c23d1c5c51f51fc524ca220f69a5091::server:0f4fb93c49704e59ae883da2f326bcda`

---

## How to Add Worker Nodes

When you set up additional Raspberry Pi devices, join them to the cluster:

```bash
# On each worker Pi:
curl -sfL https://get.k3s.io | K3S_URL=https://192.168.4.49:6443 \
  K3S_TOKEN=K1048cb45cf1bd04b9f1eaee6d3a02c4f576c23d1c5c51f51fc524ca220f69a5091::server:0f4fb93c49704e59ae883da2f326bcda \
  sh -
```

Verify the node joined:
```bash
# On master node:
ssh alice-pi "sudo k3s kubectl get nodes"
```

---

## Deploying FastAPI Backend to K3s

### Step 1: Create Docker Image

Create `Dockerfile` in blackroad-os-operator:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and push to registry:

```bash
cd ~/blackroad-os-operator
docker build -t blackroad/operator:latest .

# Push to Docker Hub or use local registry
docker push blackroad/operator:latest
```

### Step 2: Create Kubernetes Deployment

Create `k8s/operator-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blackroad-operator
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: blackroad-operator
  template:
    metadata:
      labels:
        app: blackroad-operator
    spec:
      containers:
      - name: operator
        image: blackroad/operator:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          value: "postgresql://user:pass@postgres-service:5432/blackroad"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: anthropic
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: openai
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: blackroad-operator
spec:
  selector:
    app: blackroad-operator
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
```

### Step 3: Create Secrets

```bash
ssh alice-pi << 'ENDSSH'
sudo k3s kubectl create secret generic api-keys \
  --from-literal=anthropic=YOUR_ANTHROPIC_KEY \
  --from-literal=openai=YOUR_OPENAI_KEY
ENDSSH
```

### Step 4: Deploy PostgreSQL and Redis

Create `k8s/postgres-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: blackroad
        - name: POSTGRES_USER
          value: blackroad
        - name: POSTGRES_PASSWORD
          value: CHANGE_ME
        volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: postgres-storage
      volumes:
      - name: postgres-storage
        hostPath:
          path: /data/postgres
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
```

Create `k8s/redis-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
```

### Step 5: Deploy Everything

```bash
# Copy manifests to Pi
scp -r k8s/ alice-pi:~/

# Deploy
ssh alice-pi << 'ENDSSH'
sudo k3s kubectl apply -f ~/k8s/postgres-deployment.yaml
sudo k3s kubectl apply -f ~/k8s/redis-deployment.yaml
sudo k3s kubectl apply -f ~/k8s/operator-deployment.yaml

# Wait for pods to start
sleep 30

# Check status
sudo k3s kubectl get pods
sudo k3s kubectl get services
ENDSSH
```

### Step 6: Expose via Cloudflare Tunnel

Add to `~/.blackroad/tunnels/cloudflared-config.yml`:

```yaml
  # Operator API (K3s)
  - hostname: api.blackroad.io
    service: http://192.168.4.49:8000
```

Restart cloudflared:
```bash
ssh alice-pi "sudo systemctl restart cloudflared"
```

---

## Monitoring

### View Logs

```bash
# Get pod name
ssh alice-pi "sudo k3s kubectl get pods"

# View logs
ssh alice-pi "sudo k3s kubectl logs blackroad-operator-xxxxx-xxxxx"

# Follow logs
ssh alice-pi "sudo k3s kubectl logs -f blackroad-operator-xxxxx-xxxxx"
```

### Check Resources

```bash
ssh alice-pi << 'ENDSSH'
echo "=== Nodes ==="
sudo k3s kubectl get nodes

echo ""
echo "=== Pods ==="
sudo k3s kubectl get pods --all-namespaces

echo ""
echo "=== Services ==="
sudo k3s kubectl get services

echo ""
echo "=== Resource Usage ==="
sudo k3s kubectl top nodes
sudo k3s kubectl top pods
ENDSSH
```

---

## Scaling

### Scale Deployment

```bash
# Scale to 5 replicas
ssh alice-pi "sudo k3s kubectl scale deployment/blackroad-operator --replicas=5"

# Verify
ssh alice-pi "sudo k3s kubectl get pods"
```

### Auto-scaling (HPA)

Create `k8s/operator-hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: blackroad-operator-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: blackroad-operator
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

Deploy:
```bash
ssh alice-pi "sudo k3s kubectl apply -f ~/k8s/operator-hpa.yaml"
```

---

## Migration from Railway

### Before Migration

1. Export Railway environment variables
2. Backup Railway database
3. Test K3s deployment in parallel

### During Migration

1. Deploy to K3s with same config as Railway
2. Update DNS to point to Cloudflare Tunnel
3. Test all endpoints
4. Monitor for 24 hours
5. Once stable, shut down Railway

### DNS Changes

Update Cloudflare DNS:
```
api.blackroad.io → CNAME → <cloudflare-tunnel-id>.cfargotunnel.com
```

Or use Cloudflare Tunnel routing (already configured).

---

## Backup Strategy

### Database Backups

Create cronjob for PostgreSQL backups:

```bash
ssh alice-pi << 'ENDSSH'
sudo k3s kubectl create -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - /bin/sh
            - -c
            - pg_dump -h postgres-service -U blackroad blackroad > /backup/backup-\$(date +%Y%m%d).sql
            volumeMounts:
            - name: backup-volume
              mountPath: /backup
          volumes:
          - name: backup-volume
            hostPath:
              path: /data/backups
          restartPolicy: OnFailure
EOF
ENDSSH
```

---

## Troubleshooting

### Pod not starting

```bash
ssh alice-pi "sudo k3s kubectl describe pod <pod-name>"
ssh alice-pi "sudo k3s kubectl logs <pod-name>"
```

### Out of resources

```bash
ssh alice-pi "sudo k3s kubectl top nodes"
```

### Network issues

```bash
# Test pod-to-pod communication
ssh alice-pi "sudo k3s kubectl run test --image=busybox --rm -it -- ping postgres-service"
```

### Reset cluster (DANGER)

```bash
ssh alice-pi << 'ENDSSH'
sudo /usr/local/bin/k3s-killall.sh
sudo /usr/local/bin/k3s-uninstall.sh
ENDSSH
```

---

## Next Steps

1. **Add worker nodes** - Join more Raspberry Pi devices to increase capacity
2. **Deploy FastAPI backend** - Follow Step 1-6 above
3. **Set up monitoring** - Deploy Prometheus + Grafana
4. **Configure backups** - Implement automated PostgreSQL backups
5. **Test migration** - Run K3s in parallel with Railway before switching
6. **Update DNS** - Point api.blackroad.io to K3s via Cloudflare Tunnel
7. **Shut down Railway** - Once K3s is proven stable

---

## Sovereignty Milestone

**You now own**:
- ✅ Mesh VPN (Headscale)
- ✅ Kubernetes cluster (K3s)
- 🚧 Backend API (ready to deploy)
- 🚧 Database (ready to deploy)
- 🚧 Cache (ready to deploy)

**Railway cost**: $240/year
**K3s cost**: $0/year (just electricity)

**Annual savings**: $240 + complete infrastructure sovereignty

---

## Useful Commands

```bash
# Access K3s cluster
ssh alice-pi "sudo k3s kubectl get all"

# Copy kubeconfig (to use kubectl locally)
scp alice-pi:/etc/rancher/k3s/k3s.yaml ~/.kube/blackroad-config
# Edit the file to change server: https://127.0.0.1:6443 → https://192.168.4.49:6443
export KUBECONFIG=~/.kube/blackroad-config
kubectl get nodes

# Port forward for local access
ssh -L 6443:localhost:6443 alice-pi
```

---

**Maintained by**: Alexa Amundson
**Last updated**: 2025-12-13
**Philosophy**: Own your infrastructure. Run your own cluster. Build sovereignty.
