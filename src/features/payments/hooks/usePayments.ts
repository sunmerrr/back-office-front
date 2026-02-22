import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from '../api/paymentsApi'
import type { PaymentListParams } from '../types'

export const usePayments = (params?: PaymentListParams) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsApi.getPayments(params),
  })
}

export const usePaymentStats = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['paymentStats', params],
    queryFn: () => paymentsApi.getStats(params),
  })
}
