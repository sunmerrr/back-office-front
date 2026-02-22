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
import type { CreateTournamentData } from '../types'

interface CreateTournamentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: CreateTournamentData) => void
  isPending?: boolean
}

export const CreateTournamentDialog: FC<CreateTournamentDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [prizePool, setPrizePool] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')

  const resetState = () => {
    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setPrizePool('')
    setMaxParticipants('')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const isValid = name.trim().length > 0 && startDate && endDate

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      prizePool: prizePool ? Number(prizePool) : undefined,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
    })
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>토너먼트 생성</DialogTitle>
          <DialogDescription>새로운 토너먼트를 생성합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              토너먼트 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="토너먼트 이름을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="토너먼트 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                시작일시 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                종료일시 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>상금</Label>
              <Input
                type="number"
                min={0}
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>최대 참가 인원</Label>
              <Input
                type="number"
                min={1}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="제한 없음"
              />
            </div>
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
