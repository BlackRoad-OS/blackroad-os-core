# Trinity Template Orchestration System

The Trinity system provides unified orchestration for BlackRoad OS's three core template systems:

- 🔴 **RedLight**: Visual templates (3D worlds, websites, animations)
- 💚 **GreenLight**: Project management templates (tasks, workflows)
- 💛 **YellowLight**: Infrastructure templates (services, deployments)

## Features

### Cross-Light Coordination
Execute complex workflows that span multiple lights:
```typescript
import { TrinityOrchestrator } from './trinity';

const trinity = new TrinityOrchestrator();
await trinity.initialize('.trinity');

// Deploy a complete feature with UI, API, and tracking
const coordination = trinity.createCoordinationFromTemplate(
  'deploy-full-stack-feature',
  'User Dashboard Feature'
);

const tasks = await trinity.executeCoordination(coordination);
```

### RedLight Orchestrator
Manage visual templates:
```typescript
const redLight = trinity.getOrchestrator(TrinityLight.RED);

// Create a new template
const template = await redLight.createTemplate(
  'Mars Globe',
  RedLightCategory.WORLD,
  'Interactive 3D Mars visualization',
  '.trinity/redlight/templates/mars.html'
);

// Deploy to Cloudflare Pages
const result = await redLight.deployTemplate({
  template_id: template.id,
  light: TrinityLight.RED,
  target_environment: 'production',
});

console.log(`Deployed to: ${result.url}`);
```

### GreenLight Orchestrator
Manage project tasks:
```typescript
const greenLight = trinity.getOrchestrator(TrinityLight.GREEN);

// Create a task
const task = await greenLight.createTask(
  'Implement Mars Template',
  'Build interactive Mars 3D visualization',
  '🌸', // scale: medium
  '🎨', // domain: creative
  '⭐', // priority: high
  '🏗️'  // effort: large
);

// Transition through states
await greenLight.transitionState(task.id, GreenLightState.WIP);
await greenLight.assignTask(task.id, 'cece');
await greenLight.transitionState(task.id, GreenLightState.REVIEW);
await greenLight.transitionState(task.id, GreenLightState.DONE);
```

### YellowLight Orchestrator
Manage infrastructure:
```typescript
const yellowLight = trinity.getOrchestrator(TrinityLight.YELLOW);

// Create infrastructure
const infra = await yellowLight.createInfrastructure(
  'BlackRoad API',
  'Main API service for BlackRoad OS',
  YellowLightPlatform.RAILWAY,
  'service',
  'blackroad-api',
  'production',
  {
    runtime: 'node',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
  }
);

// Deploy to platform
const result = await yellowLight.deployInfrastructure({
  template_id: infra.id,
  light: TrinityLight.YELLOW,
  target_environment: 'production',
});

// Monitor health
const health = await yellowLight.performHealthCheck(infra.id);
console.log(`Status: ${health.status}`);
```

## Built-in Workflow Templates

### 1. Deploy Earth Template
Complete workflow to create and deploy a 3D Earth template:
1. Create GreenLight deployment task
2. Create RedLight Earth template
3. Deploy to Cloudflare Pages
4. Configure DNS
5. Mark deployment complete

### 2. Deploy API Service
Deploy a backend API with monitoring:
1. Create deployment task
2. Provision Railway service
3. Configure database
4. Deploy service
5. Run health checks
6. Update task status

### 3. Deploy Full Stack Feature
Complete feature deployment:
1. Create feature epic in GreenLight
2. Create UI template (RedLight) and provision API (YellowLight) in parallel
3. Deploy UI and API
4. Run integration tests
5. Mark feature complete

## System Health Monitoring

Check the health of the entire Trinity system:
```typescript
const health = await trinity.getSystemHealth();

console.log(`Trinity Status: ${health.status}`);
console.log('RedLight:', health.lights.redlight);
console.log('GreenLight:', health.lights.greenlight);
console.log('YellowLight:', health.lights.yellowlight);
```

## Event System

All orchestrators emit events that can be monitored:
```typescript
trinity.on('coordination:started', (coord) => {
  console.log(`Starting coordination: ${coord.name}`);
});

trinity.on('redlight:template:created', (template) => {
  console.log(`Template created: ${template.name}`);
});

trinity.on('greenlight:state:transitioned', ({ template, oldState, newState }) => {
  console.log(`Task ${template.name}: ${oldState} → ${newState}`);
});

trinity.on('yellowlight:deployment:completed', (result) => {
  console.log(`Deployed to: ${result.url}`);
});
```

## Integration with Existing Systems

### Agent Orchestration
Trinity orchestrators can be integrated with the existing agent orchestration:
```typescript
import { AgentOrchestrator } from '../agent-orchestration';
import { TrinityOrchestrator } from '../trinity';

const agentOrch = new AgentOrchestrator();
const trinity = new TrinityOrchestrator();

// Coordinate agents with Trinity workflows
agentOrch.on('task:completed', async (task) => {
  if (task.type === 'deployment') {
    // Trigger Trinity deployment workflow
    const coordination = trinity.createCoordinationFromTemplate(
      'deploy-full-stack-feature',
      task.description
    );
    await trinity.executeCoordination(coordination);
  }
});
```

### API Integration
Expose Trinity through API endpoints (see src/api/trinity/ for implementation).

## Template Storage

Templates are loaded from the `.trinity/` directory:
```
.trinity/
├── redlight/
│   ├── templates/           # HTML template files
│   └── scripts/             # Template management scripts
├── greenlight/
│   ├── docs/                # GreenLight documentation
│   └── scripts/             # GreenLight templates
└── yellowlight/
    ├── docs/                # YellowLight documentation
    └── scripts/             # YellowLight templates
```

## Type Safety

All orchestrators are fully typed with TypeScript:
- `TrinityTemplate` - Base template interface
- `RedLightTemplate` - Visual template
- `GreenLightTemplate` - Task/project template
- `YellowLightTemplate` - Infrastructure template
- `TrinityCoordination` - Cross-light workflow
- `TemplateDeploymentResult` - Deployment outcome

## Future Enhancements

- [ ] Persist templates to database
- [ ] Real platform integrations (Cloudflare API, Railway API)
- [ ] Template versioning and rollback
- [ ] Advanced analytics and metrics
- [ ] Template marketplace
- [ ] AI-powered template suggestions
- [ ] Real-time collaboration on templates
- [ ] Template dependency management

## Contributing

See `.trinity/README.md` for more information about the Trinity system.

## License

MIT
