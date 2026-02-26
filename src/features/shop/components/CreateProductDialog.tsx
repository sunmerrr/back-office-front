import { FC, useState } from 'react'
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
import { ImageUploader } from '@/shared/components/ui/image-uploader'
import { useUploadShopImage } from '../hooks/useShop'
import { ProductContentsEditor } from './ProductContentsEditor'
import type { CreateShopProductData, ShopContentItem } from '../types'

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: CreateShopProductData) => void
  isPending?: boolean
}

export const CreateProductDialog: FC<CreateProductDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}) => {
  const { mutateAsync: uploadImage } = useUploadShopImage()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('KRW')
  const [contents, setContents] = useState<ShopContentItem[]>([{ type: 'gold', amount: 0 }])
  const [sortOrder, setSortOrder] = useState('0')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetState = () => {
    setName('')
    setDescription('')
    setImageFile(null)
    setImagePreview('')
    setPrice('')
    setCurrency('KRW')
    setContents([{ type: 'gold', amount: 0 }])
    setSortOrder('0')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const isValid = name.trim().length > 0 && price && contents.length > 0

  const handleConfirm = async () => {
    if (!isValid) return

    setIsSubmitting(true)
    try {
      let imagePath = ''
      if (imageFile) {
        const res = await uploadImage(imageFile)
        imagePath = res.url
      }

      const data: CreateShopProductData = {
        name: name.trim(),
        price,
        currency,
        contents,
        sortOrder: Number(sortOrder) || 0,
      }

      if (description.trim()) data.description = description.trim()
      if (imagePath) data.imagePath = imagePath

      onConfirm(data)
      resetState()
    } catch {
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
          <DialogDescription>새로운 상품을 등록합니다.</DialogDescription>
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
            <Label>이미지</Label>
            <ImageUploader
              value={imagePreview}
              onChange={(file) => {
                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
              }}
              onRemove={() => {
                setImageFile(null)
                setImagePreview('')
              }}
              maxSizeInMB={5}
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
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isPending || isSubmitting}>
            {isPending || isSubmitting ? '등록 중...' : '등록'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
