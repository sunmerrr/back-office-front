export interface Payment {
  id: string
  userId: string
  userName?: string
  email?: string
  product: string
  amount: number
  currency: string
  method?: string
  status: string
  paidAt: string
  createdAt: string
}

export interface PaymentListParams {
  page?: number
  limit?: number
  userId?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface PaymentStats {
  totalAmount: number
  totalCount: number
  daily: { date: string; amount: number; count: number }[]
}
