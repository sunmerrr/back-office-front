import { FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useCreateAdmin } from '../hooks/useAdmins'
import { extractApiError } from '@/shared/utils/error'

interface CreateAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateAdminDialog: FC<CreateAdminDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'OPERATOR' | 'SUPERADMIN'>('OPERATOR')
  const [error, setError] = useState('')

  const { mutate: createAdmin, isPending } = useCreateAdmin()

  const resetForm = () => {
    setEmail('')
    setNickname('')
    setPassword('')
    setRole('OPERATOR')
    setError('')
  }

  const handleSubmit = () => {
    if (!email || !nickname || !password) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (role === 'SUPERADMIN') {
      const confirmed = window.confirm(
        '슈퍼 어드민 권한을 부여하시겠습니까?\n모든 기능에 접근할 수 있습니다.'
      )
      if (!confirmed) return
    }

    createAdmin(
      { email, nickname, password, role },
      {
        onSuccess: () => {
          resetForm()
          onOpenChange(false)
        },
        onError: async (err: unknown) => {
          setError(await extractApiError(err, '계정 생성에 실패했습니다.'))
        },
      }
    )
  }

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
          <DialogTitle>관리자 계정 생성</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">이메일 *</label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">닉네임 *</label>
            <Input
              placeholder="관리자 이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">비밀번호 *</label>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">역할 *</label>
            <Select value={role} onValueChange={(v) => setRole(v as 'OPERATOR' | 'SUPERADMIN')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPERATOR">Operator</SelectItem>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
              {isPending ? '생성 중...' : '생성'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
