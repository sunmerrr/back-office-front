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

interface NicknameChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentNickname: string
  onConfirm: (nickname: string, reason: string) => void
  isPending?: boolean
}

export const NicknameChangeDialog: FC<NicknameChangeDialogProps> = ({
  open,
  onOpenChange,
  currentNickname,
  onConfirm,
  isPending,
}) => {
  const [nickname, setNickname] = useState('')
  const [reason, setReason] = useState('')

  const resetState = () => {
    setNickname('')
    setReason('')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const isValid = nickname.trim().length > 0 && reason.trim().length > 0

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm(nickname.trim(), reason.trim())
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>닉네임 강제 변경</DialogTitle>
          <DialogDescription>
            현재 닉네임: <strong>{currentNickname || '-'}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              새 닉네임 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="변경할 닉네임을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>
              변경 사유 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="변경 사유를 입력하세요 (예: 부적절한 닉네임)"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isPending}>
            {isPending ? '변경 중...' : '변경'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
