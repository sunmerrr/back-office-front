export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

export type SortOrder = 'asc' | 'desc'

export interface SortParams {
  sortBy?: string
  sortOrder?: SortOrder
}
