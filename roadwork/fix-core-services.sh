#!/bin/bash
# Fix BlackRoad Core - Deploy all 8 services

echo "🚀 Deploying BlackRoad Core Services"
echo "======================================"

# Service IDs from the health check report
declare -a services=(
    "blackroad-os-core:1b7120fb-ef36-4b31-834f-05801c4f68f9"
    "infra:52ba1f63-b2bc-4bdd-8989-49ff4c2220bc"
    "backend:639c44d0-6055-409b-974a-b03b939bb4b4"
    "web:d4b5545f-f69c-4d81-bf36-fc60256f27a6"
    "frontend:ecebf8bf-9253-4580-820a-5684ffd33199"
    "src-tauri:f2221194-ee4f-4665-ae01-571040696fdf"
)

for service in "${services[@]}"; do
    name="${service%%:*}"
    id="${service##*:}"
    
    echo ""
    echo "📦 Deploying $name (ID: $id)..."
    railway service "$id" && railway up --detach
    
    if [ $? -eq 0 ]; then
        echo "✅ $name deployment triggered"
    else
        echo "❌ $name deployment failed"
    fi
    
    sleep 3
done

echo ""
echo "✅ All deployments triggered!"
