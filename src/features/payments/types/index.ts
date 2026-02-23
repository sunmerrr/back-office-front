export interface Payment {
  id: string
  userId: string
  userName?: string
  email?: string
  product: string
  amount: string
  currency: string
  method?: string
  status: string
  paidAt: number
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
  totalAmount: string
  totalCount: number
  daily: { date: string; amount: string; count: number }[]
}
