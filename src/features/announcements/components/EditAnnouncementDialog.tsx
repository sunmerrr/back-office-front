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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import type { Announcement, AnnouncementType, CreateAnnouncementData } from '../types'

interface EditAnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcement: Announcement | null
  onConfirm: (data: Partial<CreateAnnouncementData & { status: Announcement['status'] }>) => void
  isPending?: boolean
}

function tsToDatetimeLocal(ts: number | null): string {
  if (!ts) return ''
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const EditAnnouncementDialog: FC<EditAnnouncementDialogProps> = ({
  open,
  onOpenChange,
  announcement,
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
  const [status, setStatus] = useState<Announcement['status']>('SCHEDULED')

  useEffect(() => {
    if (announcement && open) {
      setType(announcement.type)
      setTitle(announcement.title)
      setContent(announcement.content || '')
      setImagePath(announcement.imagePath || '')
      setStartAt(tsToDatetimeLocal(announcement.startAt))
      setEndAt(tsToDatetimeLocal(announcement.endAt))
      setSortOrder(String(announcement.sortOrder))
      setStatus(announcement.status)
    }
  }, [announcement, open])

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  const isValid = title.trim().length > 0 && startAt

  const handleConfirm = () => {
    if (!isValid) return

    const data: Partial<CreateAnnouncementData & { status: Announcement['status'] }> = {
      type,
      title: title.trim(),
      startAt: new Date(startAt).getTime(),
      sortOrder: Number(sortOrder) || 0,
      status,
    }

    if (content.trim()) data.content = content.trim()
    else data.content = undefined
    if (imagePath.trim()) data.imagePath = imagePath.trim()
    else data.imagePath = undefined
    if (endAt) data.endAt = new Date(endAt).getTime()

    onConfirm(data)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>공지 수정</DialogTitle>
          <DialogDescription>공지 내용을 수정합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label>상태</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Announcement['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">노출중</SelectItem>
                  <SelectItem value="SCHEDULED">예약</SelectItem>
                  <SelectItem value="INACTIVE">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
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
