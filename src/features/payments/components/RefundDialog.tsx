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
import type { Payment } from '../types'

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  onConfirm: (reason: string) => void
  isPending?: boolean
}

export const RefundDialog: FC<RefundDialogProps> = ({
  open,
  onOpenChange,
  payment,
  onConfirm,
  isPending,
}) => {
  const [reason, setReason] = useState('')

  const handleOpenChange = (value: boolean) => {
    if (!value) setReason('')
    onOpenChange(value)
  }

  const handleConfirm = () => {
    if (!reason.trim()) return
    onConfirm(reason.trim())
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>결제 환불</DialogTitle>
          <DialogDescription>
            이 결제를 환불 처리합니다. 실제 PG 환불은 별도로 진행해야 합니다.
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="py-4 space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">결제 ID</span>
                <span className="font-medium">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">유저</span>
                <span className="font-medium">{payment.userName || payment.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">상품</span>
                <span className="font-medium">{payment.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">금액</span>
                <span className="font-medium text-red-600">
                  {Number(payment.amount).toLocaleString()} {payment.currency}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>환불 사유 <span className="text-red-500">*</span></Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="환불 사유를 입력하세요"
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
          >
            {isPending ? '처리 중...' : '환불 처리'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
