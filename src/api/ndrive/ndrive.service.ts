import httpClient from '@/api/http-client'
import { API_CONFIG } from '@/config/api.config'
import type { ApiResponse, NDriveConnection, NDriveListResponse } from '@/types'

export const ndriveService = {
  async connect(): Promise<ApiResponse<{ authUrl: string }>> {
    const response = await httpClient.post<ApiResponse<{ authUrl: string }>>(
      API_CONFIG.ENDPOINTS.NDRIVE.CONNECT
    )
    return response.data
  },

  async disconnect(): Promise<ApiResponse> {
    const response = await httpClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.NDRIVE.DISCONNECT
    )
    return response.data
  },

  async getConnectionStatus(): Promise<ApiResponse<NDriveConnection>> {
    const response = await httpClient.get<ApiResponse<NDriveConnection>>(
      API_CONFIG.ENDPOINTS.NDRIVE.CONNECT
    )
    return response.data
  },

  async listFiles(folderId?: string, pageToken?: string): Promise<ApiResponse<NDriveListResponse>> {
    const params = new URLSearchParams()
    if (folderId) params.append('folderId', folderId)
    if (pageToken) params.append('pageToken', pageToken)

    const response = await httpClient.get<ApiResponse<NDriveListResponse>>(
      `${API_CONFIG.ENDPOINTS.NDRIVE.FILES}?${params.toString()}`
    )
    return response.data
  },

  async downloadFile(fileId: string): Promise<Blob> {
    const response = await httpClient.get(
      `${API_CONFIG.ENDPOINTS.NDRIVE.FILES}/${fileId}/download`,
      { responseType: 'blob' }
    )
    return response.data
  }
}
