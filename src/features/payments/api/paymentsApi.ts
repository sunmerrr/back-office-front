import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { Payment, PaymentListParams, PaymentStats } from '../types'

function mapPayment(raw: any): Payment {
  return {
    id: String(raw.id),
    userId: String(raw.userId),
    userName: raw.user?.nickname || raw.user?.email || '',
    email: raw.user?.email || '',
    product: raw.product || '',
    amount: String(raw.amount ?? '0'),
    currency: raw.currency || 'KRW',
    method: raw.method || undefined,
    status: raw.status || 'COMPLETED',
    paidAt: Number(raw.paidAt),
    createdAt: raw.createdAt || '',
  }
}

export const paymentsApi = {
  getPayments: async (params?: PaymentListParams): Promise<{ items: Payment[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.userId) searchParams.set('userId', params.userId)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)

    const response: any = await authenticatedApiClient.get('payment/list', { searchParams }).json()
    return {
      items: (response.data || []).map(mapPayment),
      total: response.meta?.total || 0,
    }
  },

  refundPayment: async (id: string, reason: string): Promise<Payment> => {
    const raw: any = await authenticatedApiClient.post(`payment/${id}/refund`, { json: { reason } }).json()
    return mapPayment(raw)
  },

  getStats: async (params?: { startDate?: string; endDate?: string }): Promise<PaymentStats> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)

    return authenticatedApiClient.get('payment/stats', { searchParams }).json()
  },
}
