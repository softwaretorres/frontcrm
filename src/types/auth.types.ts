export interface Permission {
  id: number
  name: string
  displayName: string
  description: string
  module: string
  action: string
  fullPermission: string
  level: 'read' | 'write' | 'admin'
  isActive: boolean
  isSystemPermission: boolean
  displayOrder: number
  rolesCount: number
  canBeDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  displayName: string
  description: string
  isSystemRole: boolean
  isActive: boolean
  displayOrder: number
  usersCount: number
  permissionsCount: number
  canBeDeleted: boolean
  canBeModified: boolean
  createdAt: string
  updatedAt: string
  permissions: Permission[]
}

export interface User {
  id: number
  name: string
  email: string
  emailVerifiedAt: string | null
  firstName: string
  lastName: string
  phone: string
  avatar: string | null
  active: boolean
  lastLoginAt: string
  organizationId: number | null
  invitedBy: number | null
  invitationAcceptedAt: string | null
  createdAt: string
  updatedAt: string
  fullName: string
  invitationPending: boolean
  activeRoles: string[]
  isActive: boolean
  roles: Role[]
  permissions: Permission[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    tokens: AuthTokens
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}
