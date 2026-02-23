export interface Admin {
  id: string
  email: string
  nickname: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateAdminData {
  email: string
  nickname: string
  password: string
  role: 'OPERATOR' | 'SUPERADMIN'
}

export interface ResetPasswordData {
  newPassword: string
  currentPassword: string
}

export interface AdminListParams {
  page?: number
  limit?: number
  search?: string
}
