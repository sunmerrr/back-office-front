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
import type { Tournament, CreateTournamentData } from '../types'

interface EditTournamentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament: Tournament | null
  onConfirm: (data: Partial<CreateTournamentData>) => void
  isPending?: boolean
}

function toDatetimeLocal(isoString?: string): string {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16)
}

export const EditTournamentDialog: FC<EditTournamentDialogProps> = ({
  open,
  onOpenChange,
  tournament,
  onConfirm,
  isPending,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [prizePool, setPrizePool] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')

  useEffect(() => {
    if (tournament && open) {
      setName(tournament.name)
      setDescription(tournament.description || '')
      setStartDate(toDatetimeLocal(tournament.startDate))
      setEndDate(toDatetimeLocal(tournament.endDate))
      setPrizePool(tournament.prizePool ? String(tournament.prizePool) : '')
      setMaxParticipants(tournament.maxParticipants ? String(tournament.maxParticipants) : '')
    }
  }, [tournament, open])

  const isDisabled = tournament?.status === 'completed' || tournament?.status === 'cancelled'

  const isValid = name.trim().length > 0 && startDate && endDate

  const handleConfirm = () => {
    if (!isValid || isDisabled) return
    onConfirm({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      prizePool: prizePool ? Number(prizePool) : undefined,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>토너먼트 수정</DialogTitle>
          <DialogDescription>
            {isDisabled
              ? '완료되거나 취소된 토너먼트는 수정할 수 없습니다.'
              : '토너먼트 정보를 수정합니다.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              토너먼트 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isDisabled}
            />
          </div>

          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
              />
            </div>
            <div className="space-y-2">
              <Label>최대 참가 인원</Label>
              <Input
                type="number"
                min={1}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isDisabled ? '닫기' : '취소'}
          </Button>
          {!isDisabled && (
            <Button onClick={handleConfirm} disabled={!isValid || isPending}>
              {isPending ? '수정 중...' : '수정'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
