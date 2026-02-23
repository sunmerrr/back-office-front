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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import type { CreateAnnouncementData, AnnouncementType } from '../types'

interface CreateAnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: CreateAnnouncementData) => void
  isPending?: boolean
}

export const CreateAnnouncementDialog: FC<CreateAnnouncementDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}) => {
  const [type, setType] = useState<AnnouncementType>('BANNER')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  const resetState = () => {
    setType('BANNER')
    setTitle('')
    setContent('')
    setImagePath('')
    setStartAt('')
    setEndAt('')
    setSortOrder('0')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const isValid = title.trim().length > 0 && startAt

  const handleConfirm = () => {
    if (!isValid) return

    const data: CreateAnnouncementData = {
      type,
      title: title.trim(),
      startAt: new Date(startAt).getTime(),
      sortOrder: Number(sortOrder) || 0,
    }

    if (content.trim()) data.content = content.trim()
    if (imagePath.trim()) data.imagePath = imagePath.trim()
    if (endAt) data.endAt = new Date(endAt).getTime()

    onConfirm(data)
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>공지 생성</DialogTitle>
          <DialogDescription>새로운 공지를 생성합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>유형 <span className="text-red-500">*</span></Label>
            <Select value={type} onValueChange={(v) => setType(v as AnnouncementType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANNER">배너</SelectItem>
                <SelectItem value="POPUP">팝업</SelectItem>
                <SelectItem value="WEB">웹</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>제목 <span className="text-red-500">*</span></Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>내용</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지 내용을 입력하세요"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>이미지 경로</Label>
            <Input
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="/images/announcements/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>시작일시 <span className="text-red-500">*</span></Label>
              <Input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>종료일시</Label>
              <Input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
              <p className="text-xs text-gray-500">비워두면 수동으로 내릴 때까지 노출</p>
            </div>
          </div>

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
            <p className="text-xs text-gray-500">숫자가 클수록 상위에 노출</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isPending}>
            {isPending ? '생성 중...' : '생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
