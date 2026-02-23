import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shopApi } from '../api/shopApi'
import type { ShopProductListParams, CreateShopProductData } from '../types'

export const useShopProducts = (params?: ShopProductListParams) => {
  return useQuery({
    queryKey: ['shopProducts', params],
    queryFn: () => shopApi.getProducts(params),
  })
}

export const useCreateShopProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateShopProductData) => shopApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] })
    },
  })
}

export const useUpdateShopProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateShopProductData> }) =>
      shopApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] })
    },
  })
}

export const useDeleteShopProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => shopApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] })
    },
  })
}

export const useToggleShopProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => shopApi.toggleProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] })
    },
  })
}

export const useUpdateShopOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orders: { id: string; sortOrder: number }[]) => shopApi.updateOrder(orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] })
    },
  })
}
