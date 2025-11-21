export type ServiceDescriptor = {
  id: string;
  name: string;
  baseUrl: string;
  healthEndpoint: string;
  infoEndpoint: string;
};

export const coreService: ServiceDescriptor = {
  id: 'core',
  name: 'BlackRoad OS – Core',
  baseUrl: process.env.SERVICE_BASE_URL || 'https://core.blackroad.systems',
  healthEndpoint: '/health',
  infoEndpoint: '/info',
};

export const servicesRegistry: Record<string, ServiceDescriptor> = {
  core: coreService,
};

export default servicesRegistry;
