import { FC, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useUser, useUpdateUserRole, useBanUser, useUnbanUser } from '../hooks/useUsers'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Card, CardContent } from '@/shared/components/ui/card'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ChevronLeft, User as UserIcon } from 'lucide-react'
import { ROLES } from '../types/UserRole'
import { PermissionGate } from '@/shared/components/PermissionGate'

// Sub-components
import { UserProfileCard } from '../components/UserProfileCard'
import { UserAssetsCard } from '../components/UserAssetsCard'
import { UserMemoCard } from '../components/UserMemoCard'
import { UserGoldTab } from '../components/UserGoldTab'
import { UserTicketsTab } from '../components/UserTicketsTab'
import { UserSendTab } from '../components/UserSendTab'
import { UserPaymentsTab } from '../components/UserPaymentsTab'

export const UserDetailPage: FC = () => {
  const { userId } = useParams({ from: '/_auth/users/$userId' })
  const navigate = useNavigate()
  
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  
  const { data: user, isLoading: isUserLoading, error: userError } = useUser(userId)
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole()
  const { mutate: banUser, isPending: isBanning } = useBanUser()
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser()

  if (isUserLoading) return <div className="p-8 text-center text-gray-500">로딩 중...</div>
  if (userError || !user) return <div className="p-8 text-center text-red-500">사용자를 찾을 수 없습니다.</div>

  const handleEditOpen = () => {
    setSelectedRole(user.role)
    setIsEditOpen(true)
  }

  const handleUpdateInfo = () => {
    if (selectedRole !== user.role) {
      updateRole({ id: userId, role: selectedRole })
    }
    setIsEditOpen(false)
  }

  const handleBan = () => {
    const daysStr = window.prompt('차단할 기간(일)을 입력하세요:', '30')
    if (!daysStr) return

    const days = parseInt(daysStr, 10)
    if (isNaN(days) || days <= 0) {
      alert('유효한 숫자를 입력해주세요.')
      return
    }

    const bannedUntil = new Date().getTime() + days * 24 * 60 * 60 * 1000
    if (window.confirm(`${days}일 동안 사용자를 차단하시겠습니까?`)) {
      banUser({ id: userId, bannedUntil })
    }
  }

  const handleUnban = () => {
    if (window.confirm('차단을 해제하시겠습니까?')) {
      unbanUser(userId)
    }
  }

  const isActionPending = isUpdatingRole || isBanning || isUnbanning

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/users' })}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.userName}</h1>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{user.role}</Badge>
                {user.banned ? (
                  <Badge variant="destructive">차단됨</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 border-none">정상</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionGate permission="user:role">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleEditOpen}>정보 수정</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>회원 정보 수정</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">사용자 역할</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="역할 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>취소</Button>
                  <Button onClick={handleUpdateInfo} disabled={isActionPending}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>

          {user.banned ? (
            <Button 
              variant="outline" 
              className="text-green-600 border-green-600"
              onClick={handleUnban}
              disabled={isActionPending}
            >
              차단 해제
            </Button>
          ) : (
            <Button 
              variant="destructive"
              onClick={handleBan}
              disabled={isActionPending}
            >
              회원 차단
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <UserProfileCard user={user} />
          <UserAssetsCard userId={userId} />
          <UserMemoCard />
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="gold" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="gold">골드 내역</TabsTrigger>
              <TabsTrigger value="tickets">티켓 내역</TabsTrigger>
              <TabsTrigger value="send">발송 관리</TabsTrigger>
              <TabsTrigger value="games">게임 기록</TabsTrigger>
              <TabsTrigger value="payments">결제 내역</TabsTrigger>
              <TabsTrigger value="logs">로그</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-gray-500">총 게임 횟수</p>
                    <p className="text-2xl font-bold mt-1">0</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-gray-500">총 충전 금액</p>
                    <p className="text-2xl font-bold mt-1">0 ₩</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gold" className="pt-4">
              <UserGoldTab userId={userId} />
            </TabsContent>

            <TabsContent value="tickets" className="pt-4">
              <UserTicketsTab userId={userId} userName={user.userName} />
            </TabsContent>

            <TabsContent value="send" className="pt-4">
              <UserSendTab userId={userId} userName={user.userName} />
            </TabsContent>

            <TabsContent value="games" className="pt-4">
              <div className="p-10 bg-white border rounded-lg text-center text-gray-400 text-sm">
                최근 게임 기록이 없습니다.
              </div>
            </TabsContent>
            
            <TabsContent value="payments" className="pt-4">
              <UserPaymentsTab userId={userId} />
            </TabsContent>
            
            <TabsContent value="logs" className="pt-4">
              <div className="p-10 bg-white border rounded-lg text-center text-gray-400 text-sm">
                접속 및 활동 로그가 없습니다.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}