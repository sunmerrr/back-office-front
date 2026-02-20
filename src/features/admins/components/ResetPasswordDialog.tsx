import { FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { useResetPassword } from '../hooks/useAdmins'
import type { Admin } from '../types'

interface ResetPasswordDialogProps {
  admin: Admin | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({
  admin,
  open,
  onOpenChange,
}) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { mutate: resetPassword, isPending } = useResetPassword()

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setError('')
    setSuccess(false)
  }

  const handleSubmit = () => {
    if (!currentPassword || !newPassword) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (!admin) return

    resetPassword(
      { id: admin.id, data: { currentPassword, newPassword } },
      {
        onSuccess: () => {
          setSuccess(true)
          setError('')
        },
        onError: (err: any) => {
          setError(err?.message || '비밀번호 초기화에 실패했습니다.')
          setSuccess(false)
        },
      }
    )
  }

  if (!admin) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>비밀번호 초기화</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            대상: <span className="font-medium text-gray-900">{admin.email}</span>
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">비밀번호가 초기화되었습니다.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">본인 비밀번호 *</label>
                <Input
                  type="password"
                  placeholder="현재 로그인한 계정의 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">새 비밀번호 *</label>
                <Input
                  type="password"
                  placeholder="대상 관리자의 새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {success ? (
              <Button
                onClick={() => {
                  resetForm()
                  onOpenChange(false)
                }}
              >
                닫기
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    onOpenChange(false)
                  }}
                >
                  취소
                </Button>
                <Button onClick={handleSubmit} disabled={isPending}>
                  {isPending ? '처리 중...' : '초기화'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
