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
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { AlertTriangle } from 'lucide-react'
import type { Tournament } from '../types'

interface CancelTournamentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament: Tournament | null
  onConfirm: (reason: string) => void
  isPending?: boolean
}

export const CancelTournamentDialog: FC<CancelTournamentDialogProps> = ({
  open,
  onOpenChange,
  tournament,
  onConfirm,
  isPending,
}) => {
  const [reason, setReason] = useState('')

  const handleOpenChange = (value: boolean) => {
    if (!value) setReason('')
    onOpenChange(value)
  }

  const isValid = reason.trim().length > 0

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm(reason.trim())
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            토너먼트 취소
          </DialogTitle>
          <DialogDescription>
            <span className="font-bold text-blue-600">{tournament?.name}</span> 토너먼트를 취소합니다.
            이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              취소 사유 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="취소 사유를 입력하세요..."
              rows={3}
            />
          </div>

          {isValid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-red-800">확인</p>
              <p className="text-sm text-red-700">
                <span className="font-bold">{tournament?.name}</span> 토너먼트를 취소합니다.
              </p>
              <p className="text-xs text-red-600">사유: {reason}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            돌아가기
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid || isPending}
          >
            {isPending ? '처리 중...' : '취소 확정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
