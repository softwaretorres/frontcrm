import httpClient from '@/api/http-client'
import { API_CONFIG } from '@/config/api.config'
import type { LoginCredentials, LoginResponse, ApiResponse, User } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  },

  async logout(): Promise<ApiResponse> {
    const response = await httpClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGOUT
    )
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    )
    return response.data
  },

  async me(): Promise<ApiResponse<User>> {
    const response = await httpClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.AUTH.ME
    )
    return response.data
  }
}
