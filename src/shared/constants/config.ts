export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://pokerlulu.io/api',
  serviceUrl: import.meta.env.VITE_SERVICE_URL || 'http://localhost:4400',
  appMode: import.meta.env.VITE_APP_MODE || 'development',
  isDevelopment: import.meta.env.VITE_APP_MODE === 'development' || import.meta.env.DEV,
  isProduction: import.meta.env.VITE_APP_MODE === 'production' || import.meta.env.PROD,
} as const

export type AppMode = 'development' | 'production' | 'test'
export type Config = typeof config
