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
import { useCreateUser } from '../hooks/useUsers'
import { ROLES } from '../types/UserRole'
import { extractApiError } from '@/shared/utils/error'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateUserDialog: FC<CreateUserDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [error, setError] = useState('')

  const { mutate: createUser, isPending } = useCreateUser()

  const resetForm = () => {
    setEmail('')
    setNickname('')
    setPassword('')
    setRole('USER')
    setError('')
  }

  const handleSubmit = () => {
    if (!email || !nickname || !password) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    createUser(
      { email, nickname, password, role },
      {
        onSuccess: () => {
          resetForm()
          onOpenChange(false)
        },
        onError: async (err: unknown) => {
          setError(await extractApiError(err, '회원 등록에 실패했습니다.'))
        },
      },
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
          <DialogTitle>회원 등록</DialogTitle>
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
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">비밀번호 *</label>
            <Input
              type="password"
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">역할</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
              {isPending ? '등록 중...' : '등록'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
