// Usar variable de entorno o fallback al proxy de Vite
const getBaseURL = () => {
  // En producción, usa la variable de entorno
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // En desarrollo, usa el proxy de Vite (ruta relativa)
  return '/api/v1'
}

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me'
    },
    NDRIVE: {
      CONNECT: '/ndrive/connect',
      DISCONNECT: '/ndrive/disconnect',
      FILES: '/ndrive/files',
      FOLDERS: '/ndrive/folders'
    }
  }
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  PERMISSIONS: 'permissions'
}
