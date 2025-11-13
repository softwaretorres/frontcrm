import axios, { type AxiosInstance } from 'axios'
import QRCode from 'qrcode'

import type {
  DriveFile,
  DriveFolder,
  PaginatedResponse,

} from '@/types/drive'
import { API_CONFIG } from '@/config/api.config'
import httpClient from '../http-client'
import type { ApiResponse } from '@/types'

class DriveApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log("desde conet")
    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => {
        console.log("response")
        return response
      },
      (error) => {
        console.log("desde conet", error)
        if (error.response?.status === 401) {
          // Token expirado o no autenticado - redirigir a conectar
          window.location.href = '/connect'
        }
        return Promise.reject(error)
      }
    )
  }


  // Autenticación
  async getAuthStatus(): Promise<{ authenticated: boolean; connected: boolean }> {
    const { data } = await httpClient.get(API_CONFIG.ENDPOINTS.NDRIVE.STATUS)
    return data
  }

  async connect(accessToken?: string): Promise<void> {
    if (accessToken) {
      await httpClient.post(API_CONFIG.ENDPOINTS.NDRIVE.CONNECT, { code: accessToken })
    } else {
      // OAuth flow - obtiene URL de autorización
      const data = httpClient.get<ApiResponse>(API_CONFIG.ENDPOINTS.NDRIVE.CONNECT)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = (await data).data
      if (response.authUrl) {
        window.location.href = response.authUrl
      }
    }
  }

  async disconnect(): Promise<void> {
    await httpClient.post(API_CONFIG.ENDPOINTS.NDRIVE.DISCONNECT)
  }

  // Archivos
  async listFiles(
    folderId?: string,
    pageToken?: string,
    pageSize = 50
  ): Promise<PaginatedResponse<DriveFile>> {
    const params = new URLSearchParams()
    if (folderId) params.append('folderId', folderId)
    if (pageToken) params.append('pageToken', pageToken)
    params.append('pageSize', pageSize.toString())

    const { data } = await httpClient.get(`${API_CONFIG.ENDPOINTS.NDRIVE.FILES}?${params}`)
    return data.data
  }

  async getFile(fileId: string): Promise<DriveFile> {
    const { data } = await httpClient.get(`${API_CONFIG.ENDPOINTS.NDRIVE}/${fileId}`)
    return data
  }

  // Carpetas
  async listFolders(
    parentId?: string,
    pageToken?: string,
    pageSize = 50
  ): Promise<PaginatedResponse<DriveFolder>> {
    const params = new URLSearchParams()
    if (parentId) params.append('parentId', parentId)
    if (pageToken) params.append('pageToken', pageToken)
    params.append('pageSize', pageSize.toString())

    const { data } = await this.api.get(`/api/drive/folders?${params}`)
    return data
  }

  async getFolder(folderId: string): Promise<DriveFolder> {
    const { data } = await this.api.get(`/api/drive/folders/${folderId}`)
    return data
  }

  async downloadFile(fileId: string, fileName: string): Promise<void> {
    try {
      const response = await httpClient.getInstance().get(
        `${API_CONFIG.ENDPOINTS.NDRIVE.FILES}/${fileId}/download`,
        {
          responseType: 'blob'
        }
      )

      // Crear link de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('✅ Archivo descargado:', fileName)
    } catch (error) {
      console.error('❌ Error al descargar:', error)
      throw error
    }
  }

  // En driveApi.service.ts

  async getShareLink(fileId: string): Promise<string> {
    const { data } = await httpClient.post(
      `${API_CONFIG.ENDPOINTS.NDRIVE.FILES}/${fileId}/share`
    )
    return data.data.shareLink
  }

  async createShareLink(fileId: string): Promise<string> {
  const response = await httpClient.getInstance().post(
    `${API_CONFIG.ENDPOINTS.NDRIVE.FILES}/${fileId}/share`
  )
  return response.data.data.shareLink
}

    async generateQRCode(link: string): Promise<string> {
    try {
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return qrDataUrl
    } catch (error) {
      console.error('Error generando QR:', error)
      throw error
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      console.log('✅ Link copiado al clipboard')
    } catch (error) {
      console.error('❌ Error al copiar:', error)
      throw error
    }
  }

  // ❌ MÉTODOS COMENTADOS (para cuando los implementes en tu backend)

  /*
  async searchFiles(filters: SearchFilters): Promise<PaginatedResponse<DriveFile>> {
    const { data } = await this.api.post('/api/drive/files/search', filters)
    return data
  }



  async uploadFile(
    file: File,
    parentId?: string,
    onProgress?: (progress: number) => void
  ): Promise<DriveFile> {
    const formData = new FormData()
    formData.append('file', file)
    if (parentId) {
      formData.append('parentId', parentId)
    }

    const { data } = await this.api.post('/api/drive/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return data
  }

  async createFolder(dto: CreateFolderDto): Promise<DriveFolder> {
    const { data } = await this.api.post('/api/drive/folders', dto)
    return data
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.api.delete(`/api/drive/files/${fileId}`)
  }

  async moveFile(dto: MoveFileDto): Promise<DriveFile> {
    const { data } = await this.api.post('/api/drive/files/move', dto)
    return data
  }

  async renameFile(fileId: string, newName: string): Promise<DriveFile> {
    const { data } = await this.api.patch(`/api/drive/files/${fileId}/rename`, {
      name: newName,
    })
    return data
  }

  async starFile(fileId: string): Promise<DriveFile> {
    const { data } = await this.api.post(`/api/drive/files/${fileId}/star`)
    return data
  }

  async unstarFile(fileId: string): Promise<DriveFile> {
    const { data } = await this.api.delete(`/api/drive/files/${fileId}/star`)
    return data
  }

  async shareFile(dto: ShareFileDto): Promise<void> {
    await this.api.post('/api/drive/files/share', dto)
  }

  async getFilePermissions(fileId: string): Promise<any> {
    const { data } = await this.api.get(`/api/drive/files/${fileId}/permissions`)
    return data
  }

  async removePermission(fileId: string, permissionId: string): Promise<void> {
    await this.api.delete(`/api/drive/files/${fileId}/permissions/${permissionId}`)
  }

  async listTrashedFiles(): Promise<PaginatedResponse<DriveFile>> {
    const { data } = await this.api.get('/api/drive/trash')
    return data
  }

  async restoreFile(fileId: string): Promise<DriveFile> {
    const { data } = await this.api.post(`/api/drive/trash/${fileId}/restore`)
    return data
  }

  async emptyTrash(): Promise<void> {
    await this.api.delete('/api/drive/trash')
  }

  async listStarredFiles(): Promise<PaginatedResponse<DriveFile>> {
    const { data } = await this.api.get('/api/drive/starred')
    return data
  }

  async listSharedFiles(): Promise<PaginatedResponse<DriveFile>> {
    const { data } = await this.api.get('/api/drive/shared')
    return data
  }

  async listRecentFiles(limit = 20): Promise<DriveFile[]> {
    const { data } = await this.api.get(`/api/drive/recent?limit=${limit}`)
    return data
  }

  async getStorageInfo(): Promise<{
    limit: string
    usage: string
    usageInDrive: string
  }> {
    const { data } = await this.api.get('/api/drive/storage')
    return data
  }
  */
}

export const driveApi = new DriveApiService()
