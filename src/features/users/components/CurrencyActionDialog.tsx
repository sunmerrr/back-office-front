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
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

type CurrencyType = 'gold' | 'diamond'
type ActionType = 'add' | 'sub'

interface CurrencyActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: CurrencyType
  action: ActionType
  userId: string
  userName?: string
  onConfirm: (amount: number, message: string) => void
  isPending?: boolean
}

const CURRENCY_LABELS: Record<CurrencyType, string> = {
  gold: '골드',
  diamond: '다이아',
}

const ACTION_LABELS: Record<ActionType, string> = {
  add: '지급',
  sub: '차감',
}

export const CurrencyActionDialog: FC<CurrencyActionDialogProps> = ({
  open,
  onOpenChange,
  type,
  action,
  userId,
  userName,
  onConfirm,
  isPending,
}) => {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const currencyLabel = CURRENCY_LABELS[type]
  const actionLabel = ACTION_LABELS[action]
  const isAdd = action === 'add'

  const resetState = () => {
    setAmount('')
    setMessage('')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const parsedAmount = parseInt(amount, 10)
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0 && message.trim().length > 0

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm(parsedAmount, message.trim())
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAdd ? (
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
            )}
            {currencyLabel} {actionLabel}
          </DialogTitle>
          <DialogDescription>
            <span className="font-bold text-blue-600">{userName || userId}</span> 님에게{' '}
            {currencyLabel}을(를) {actionLabel}합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              {actionLabel} 수량 <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`${actionLabel}할 ${currencyLabel} 수량`}
            />
          </div>

          <div className="space-y-2">
            <Label>
              사유 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`${actionLabel} 사유를 입력하세요...`}
              rows={3}
            />
          </div>

          {isValid && (
            <div
              className={`${
                isAdd ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              } border rounded-lg p-3 space-y-1`}
            >
              <p className={`text-sm font-medium ${isAdd ? 'text-green-800' : 'text-red-800'}`}>
                확인
              </p>
              <p className={`text-sm ${isAdd ? 'text-green-700' : 'text-red-700'}`}>
                <span className="font-bold">{userName || userId}</span> 님에게{' '}
                {currencyLabel}{' '}
                <span className="font-bold">{parsedAmount.toLocaleString()}</span>{' '}
                {actionLabel}.
              </p>
              <p className={`text-xs ${isAdd ? 'text-green-600' : 'text-red-600'}`}>
                사유: {message}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid || isPending}
            className={
              isAdd
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }
          >
            {isPending ? '처리 중...' : `${actionLabel} 확정`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
