export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size: number
  createdTime: string
  modifiedTime: string
  webViewLink: string
  webContentLink?: string
  thumbnailLink?: string
  parents?: string[]
  starred?: boolean
  trashed?: boolean
  shared?: boolean
  owners?: Array<{
    displayName: string
    emailAddress: string
    photoLink?: string
  }>
  permissions?: DrivePermission[]
}

export interface DrivePermission {
  id: string
  type: 'user' | 'group' | 'domain' | 'anyone'
  role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader'
  emailAddress?: string
  displayName?: string
  photoLink?: string
}

export interface DriveFolder extends DriveFile {
  mimeType: 'application/vnd.google-apps.folder'
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export interface SearchFilters {
  query?: string
  mimeType?: string
  folderId?: string
  starred?: boolean
  trashed?: boolean
  sharedWithMe?: boolean
  modifiedAfter?: string
  modifiedBefore?: string
}

export interface PaginatedResponse<T> {
  files: T[]
  nextPageToken?: string
  totalCount?: number
}

export interface CreateFolderDto {
  name: string
  parentId?: string
}

export interface ShareFileDto {
  fileId: string
  email: string
  role: 'reader' | 'writer' | 'commenter'
  sendNotification?: boolean
}

export interface MoveFileDto {
  fileId: string
  newParentId: string
  removeParents?: string[]
}
