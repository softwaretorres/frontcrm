export interface NDriveFile {
  id: string
  name: string
  mimeType: string
  size: number
  createdTime: string
  modifiedTime: string
  webViewLink?: string
  thumbnailLink?: string
  iconLink?: string
  isFolder: boolean
  parentId?: string
}

export interface NDriveFolder extends NDriveFile {
  isFolder: true
  children?: NDriveFile[]
}

export interface NDriveConnection {
  connected: boolean
  email?: string
  name?: string
}

export interface NDriveListResponse {
  files: NDriveFile[]
  nextPageToken?: string
}
