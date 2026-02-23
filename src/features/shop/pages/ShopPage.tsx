import { FC, useState } from 'react'
import {
  useShopProducts,
  useCreateShopProduct,
  useUpdateShopProduct,
  useDeleteShopProduct,
  useToggleShopProduct,
} from '../hooks/useShop'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { CreateProductDialog } from '../components/CreateProductDialog'
import { EditProductDialog } from '../components/EditProductDialog'
import type { ShopProduct, CreateShopProductData } from '../types'
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react'

const ACTIVE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'true', label: '활성' },
  { value: 'false', label: '비활성' },
] as const

const CONTENT_TYPE_LABELS: Record<string, string> = {
  gold: '골드',
  diamond: '다이아',
  ticket: '티켓',
}

export const ShopPage: FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)

  const { data, isLoading, error } = useShopProducts({
    page,
    limit,
    active: activeFilter !== 'all' ? activeFilter === 'true' : undefined,
  })

  const { mutate: createProduct, isPending: isCreating } = useCreateShopProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateShopProduct()
  const { mutate: deleteProduct } = useDeleteShopProduct()
  const { mutate: toggleProduct } = useToggleShopProduct()

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  const handleCreate = (createData: CreateShopProductData) => {
    createProduct(createData, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  const handleEdit = (product: ShopProduct) => {
    setSelectedProduct(product)
    setEditOpen(true)
  }

  const handleUpdate = (updateData: Partial<CreateShopProductData>) => {
    if (!selectedProduct) return
    updateProduct(
      { id: selectedProduct.id, data: updateData },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  const handleDelete = (product: ShopProduct) => {
    if (!window.confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) return
    deleteProduct(product.id)
  }

  const formatContents = (contents: ShopProduct['contents']) => {
    return contents
      .map((c) => `${CONTENT_TYPE_LABELS[c.type] || c.type} ${c.amount.toLocaleString()}`)
      .join(', ')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">상점 관리</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          상품 등록
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <Select value={activeFilter} onValueChange={(v) => { setActiveFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTIVE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">ID</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead className="text-right">가격</TableHead>
              <TableHead>구성품</TableHead>
              <TableHead className="text-center">순서</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center w-[120px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">로딩 중...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  등록된 상품이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-center font-medium">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-right">
                    {Number(p.price).toLocaleString()} {p.currency}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatContents(p.contents)}
                  </TableCell>
                  <TableCell className="text-center text-sm">{p.sortOrder}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleProduct(p.id)}
                      className="inline-flex items-center"
                      title={p.active ? '비활성화' : '활성화'}
                    >
                      {p.active ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(p)}
                        title="수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(p)}
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(page - 1) }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2)
              ) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNum) }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (pageNum === page - 3 || pageNum === page + 3) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(page + 1) }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Dialogs */}
      <CreateProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onConfirm={handleCreate}
        isPending={isCreating}
      />
      <EditProductDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        product={selectedProduct}
        onConfirm={handleUpdate}
        isPending={isUpdating}
      />
    </div>
  )
}
