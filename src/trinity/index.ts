/**
 * Trinity Module - Main Export
 * 
 * The Light Trinity system for BlackRoad OS:
 * - 🔴 RedLight: Visual templates (worlds, websites, animations)
 * - 💚 GreenLight: Project management (tasks, workflows, coordination)
 * - 💛 YellowLight: Infrastructure (services, deployments, monitoring)
 */

export * from './types';
export * from './RedLightOrchestrator';
export * from './GreenLightOrchestrator';
export * from './YellowLightOrchestrator';
export * from './TrinityOrchestrator';

// Re-export main orchestrator as default
export { TrinityOrchestrator as default } from './TrinityOrchestrator';
