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
import { DatePicker } from '@/shared/components/ui/date-picker'
import { Badge } from '@/shared/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { addDays } from 'date-fns'

interface BanUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName?: string
  onConfirm: (bannedUntil: number | undefined, reason: string) => void
  isPending?: boolean
}

const DURATION_PRESETS = [
  { label: '1일', days: 1 },
  { label: '3일', days: 3 },
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '영구', days: null },
] as const

export const BanUserDialog: FC<BanUserDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userName,
  onConfirm,
  isPending,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null | undefined>(undefined)
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined)
  const [reason, setReason] = useState('')

  const resetState = () => {
    setSelectedPreset(undefined)
    setCustomDate(undefined)
    setReason('')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const handlePresetClick = (days: number | null) => {
    setSelectedPreset(days)
    setCustomDate(undefined)
  }

  const handleCustomDate = (date?: Date) => {
    setCustomDate(date)
    setSelectedPreset(undefined)
  }

  const getBannedUntil = (): number | undefined => {
    if (selectedPreset === null) return undefined // 영구
    if (selectedPreset !== undefined) return addDays(new Date(), selectedPreset).getTime()
    if (customDate) return customDate.getTime()
    return undefined
  }

  const getDurationLabel = (): string => {
    if (selectedPreset === null) return '영구 차단'
    if (selectedPreset !== undefined) {
      const until = addDays(new Date(), selectedPreset)
      return `${selectedPreset}일 (${until.toLocaleDateString('ko-KR')}까지)`
    }
    if (customDate) return `${customDate.toLocaleDateString('ko-KR')}까지`
    return ''
  }

  const isValid = (selectedPreset !== undefined || customDate !== undefined) && reason.trim().length > 0

  const handleConfirm = () => {
    if (!isValid) return
    const bannedUntil = getBannedUntil()
    onConfirm(bannedUntil, reason.trim())
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            회원 차단
          </DialogTitle>
          <DialogDescription>
            <span className="font-bold text-blue-600">{userName || userId}</span> 님을 차단합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>차단 기간</Label>
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant={selectedPreset === preset.days ? 'default' : 'outline'}
                  size="sm"
                  className={
                    selectedPreset === preset.days
                      ? preset.days === null
                        ? 'bg-red-600 hover:bg-red-700'
                        : ''
                      : ''
                  }
                  onClick={() => handlePresetClick(preset.days)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>직접 선택</Label>
            <DatePicker
              date={customDate}
              setDate={handleCustomDate}
              placeholder="만료일 직접 선택..."
            />
          </div>

          <div className="space-y-2">
            <Label>
              사유 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="차단 사유를 입력하세요..."
              rows={3}
            />
          </div>

          {isValid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-red-800">확인</p>
              <p className="text-sm text-red-700">
                <span className="font-bold">{userName || userId}</span> 님을{' '}
                <Badge variant="destructive" className="mx-1">{getDurationLabel()}</Badge>
                차단합니다.
              </p>
              <p className="text-xs text-red-600">사유: {reason}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid || isPending}
          >
            {isPending ? '처리 중...' : '차단 확정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
