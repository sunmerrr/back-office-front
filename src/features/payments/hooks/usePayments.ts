import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export const useRefundPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      paymentsApi.refundPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] })
    },
  })
}
