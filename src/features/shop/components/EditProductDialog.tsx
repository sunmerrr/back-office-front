import { FC, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { ProductContentsEditor } from './ProductContentsEditor'
import type { ShopProduct, CreateShopProductData, ShopContentItem } from '../types'

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ShopProduct | null
  onConfirm: (data: Partial<CreateShopProductData>) => void
  isPending?: boolean
}

export const EditProductDialog: FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  onConfirm,
  isPending,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('KRW')
  const [contents, setContents] = useState<ShopContentItem[]>([])
  const [sortOrder, setSortOrder] = useState('0')

  useEffect(() => {
    if (product && open) {
      setName(product.name)
      setDescription(product.description || '')
      setImagePath(product.imagePath || '')
      setPrice(product.price)
      setCurrency(product.currency)
      setContents(product.contents || [])
      setSortOrder(String(product.sortOrder))
    }
  }, [product, open])

  const isValid = name.trim().length > 0 && price && contents.length > 0

  const handleConfirm = () => {
    if (!isValid) return

    const data: Partial<CreateShopProductData> = {
      name: name.trim(),
      price,
      currency,
      contents,
      sortOrder: Number(sortOrder) || 0,
    }

    if (description.trim()) data.description = description.trim()
    if (imagePath.trim()) data.imagePath = imagePath.trim()

    onConfirm(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>상품 수정</DialogTitle>
          <DialogDescription>상품 정보를 수정합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>상품명 <span className="text-red-500">*</span></Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="상품 이름을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품 설명"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>이미지 경로</Label>
            <Input
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="/images/shop/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>가격 <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>통화</Label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="KRW"
              />
            </div>
          </div>

          <ProductContentsEditor value={contents} onChange={setContents} />

          <div className="space-y-2">
            <Label>정렬 순서</Label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0"
              className="w-32"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isPending}>
            {isPending ? '수정 중...' : '수정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
