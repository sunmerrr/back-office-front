export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestConfig {
  method: HttpMethod
  url: string
  data?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}
