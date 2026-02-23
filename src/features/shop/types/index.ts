export interface ShopContentItem {
  type: 'gold' | 'diamond' | 'ticket'
  amount: number
  ticketId?: string
}

export interface ShopProduct {
  id: string
  name: string
  description: string | null
  imagePath: string | null
  price: string
  currency: string
  contents: ShopContentItem[]
  sortOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ShopProductListParams {
  page?: number
  limit?: number
  active?: boolean
}

export interface CreateShopProductData {
  name: string
  description?: string
  imagePath?: string
  price: string
  currency?: string
  contents: ShopContentItem[]
  sortOrder?: number
  active?: boolean
}
