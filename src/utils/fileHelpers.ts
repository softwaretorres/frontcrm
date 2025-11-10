export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 1 ? 'Hace un momento' : `Hace ${minutes} minutos`
    }
    return hours === 1 ? 'Hace 1 hora' : `Hace ${hours} horas`
  }

  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`
  }

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getFileIcon(mimeType: string): string {
  const iconMap: Record<string, string> = {
    'application/vnd.google-apps.folder': '📁',
    'application/vnd.google-apps.document': '📄',
    'application/vnd.google-apps.spreadsheet': '📊',
    'application/vnd.google-apps.presentation': '📽️',
    'application/vnd.google-apps.form': '📋',
    'application/pdf': '📕',
    'image/jpeg': '🖼️',
    'image/png': '🖼️',
    'image/gif': '🖼️',
    'image/svg+xml': '🖼️',
    'video/mp4': '🎬',
    'video/quicktime': '🎬',
    'audio/mpeg': '🎵',
    'audio/wav': '🎵',
    'text/plain': '📝',
    'application/zip': '📦',
    'application/x-rar-compressed': '📦',
  }

  // Búsqueda exacta
  if (iconMap[mimeType]) return iconMap[mimeType]

  // Búsqueda por categoría
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎬'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.startsWith('text/')) return '📝'

  return '📄'
}

export function getFileColor(mimeType: string): string {
  if (mimeType.includes('folder')) return 'text-blue-500'
  if (mimeType.includes('document')) return 'text-blue-600'
  if (mimeType.includes('spreadsheet')) return 'text-green-600'
  if (mimeType.includes('presentation')) return 'text-orange-600'
  if (mimeType.includes('pdf')) return 'text-red-600'
  if (mimeType.startsWith('image/')) return 'text-purple-600'
  if (mimeType.startsWith('video/')) return 'text-pink-600'
  if (mimeType.startsWith('audio/')) return 'text-indigo-600'

  return 'text-gray-600'
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export function isFolder(mimeType: string): boolean {
  return mimeType === 'application/vnd.google-apps.folder'
}

export function isGoogleDoc(mimeType: string): boolean {
  return mimeType.startsWith('application/vnd.google-apps.')
}

export function canPreview(mimeType: string): boolean {
  const previewable = [
    'application/pdf',
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.google-apps.presentation',
    'text/plain',
    'text/html',
    'text/csv',
  ]

  return (
    previewable.includes(mimeType) ||
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/')
  )
}

export function truncateFileName(name: string, maxLength = 30): string {
  if (name.length <= maxLength) return name

  const extension = name.split('.').pop()
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'))

  if (!extension || extension === name) {
    return name.substring(0, maxLength - 3) + '...'
  }

  const availableLength = maxLength - extension.length - 4 // 4 = "..." + "."
  return nameWithoutExt.substring(0, availableLength) + '...' + '.' + extension
}

export function downloadFile(url: string, fileName: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function shareUrl(url: string): void {
  if (navigator.share) {
    navigator.share({ url })
  } else {
    copyToClipboard(url)
  }
}
