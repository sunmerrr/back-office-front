import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { ShopProduct, ShopProductListParams, CreateShopProductData } from '../types'

function mapProduct(raw: any): ShopProduct {
  return {
    id: String(raw.id),
    name: raw.name,
    description: raw.description ?? null,
    imagePath: raw.imagePath ?? null,
    price: String(raw.price),
    currency: raw.currency || 'KRW',
    contents: raw.contents || [],
    sortOrder: raw.sortOrder ?? 0,
    active: raw.active ?? true,
    createdAt: raw.createdAt || '',
    updatedAt: raw.updatedAt || '',
  }
}

export const shopApi = {
  getProducts: async (params?: ShopProductListParams): Promise<{ items: ShopProduct[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.active !== undefined) searchParams.set('active', params.active.toString())

    const response: any = await authenticatedApiClient.get('shop/products', { searchParams }).json()
    return {
      items: (response.data || []).map(mapProduct),
      total: response.meta?.total || 0,
    }
  },

  getProduct: async (id: string): Promise<ShopProduct> => {
    const raw: any = await authenticatedApiClient.get(`shop/products/${id}`).json()
    return mapProduct(raw)
  },

  createProduct: async (data: CreateShopProductData): Promise<ShopProduct> => {
    const raw: any = await authenticatedApiClient.post('shop/products', { json: data }).json()
    return mapProduct(raw)
  },

  updateProduct: async (id: string, data: Partial<CreateShopProductData>): Promise<ShopProduct> => {
    const raw: any = await authenticatedApiClient.patch(`shop/products/${id}`, { json: data }).json()
    return mapProduct(raw)
  },

  deleteProduct: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`shop/products/${id}`).json()
  },

  updateOrder: async (orders: { id: string; sortOrder: number }[]): Promise<void> => {
    return authenticatedApiClient.patch('shop/products/order', { json: { orders } }).json()
  },

  toggleProduct: async (id: string): Promise<ShopProduct> => {
    const raw: any = await authenticatedApiClient.patch(`shop/products/${id}/toggle`).json()
    return mapProduct(raw)
  },
}
