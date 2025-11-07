import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '@/config/api.config'
import router from '@/router'

class HttpClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Si el error es 401 y no estamos en retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

            if (refreshToken) {
              const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
                { refreshToken }
              )

              const { accessToken } = response.data.data.tokens
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)

              originalRequest.headers.Authorization = `Bearer ${accessToken}`
              return this.instance(originalRequest)
            }
          } catch (refreshError) {
            // Si falla el refresh, limpiar todo y redirigir al login
            this.clearAuth()
            router.push('/login')
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.PERMISSIONS)
  }

  public get<T = any>(url: string, config = {}) {
    return this.instance.get<T>(url, config)
  }

  public post<T = any>(url: string, data = {}, config = {}) {
    return this.instance.post<T>(url, data, config)
  }

  public put<T = any>(url: string, data = {}, config = {}) {
    return this.instance.put<T>(url, data, config)
  }

  public patch<T = any>(url: string, data = {}, config = {}) {
    return this.instance.patch<T>(url, data, config)
  }

  public delete<T = any>(url: string, config = {}) {
    return this.instance.delete<T>(url, config)
  }

  public getInstance(): AxiosInstance {
    return this.instance
  }
}

export const httpClient = new HttpClient()
export default httpClient
