import { FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { User as UserIcon, Mail, Phone, Shield, Users, Calendar, Ban, Pencil, History } from 'lucide-react'
import type { User } from '../types'
import { useChangeNickname, useNicknameHistory } from '../hooks/useUsers'
import { NicknameChangeDialog } from './NicknameChangeDialog'

interface UserProfileCardProps {
  user: User
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ user }) => {
  const [nicknameDialogOpen, setNicknameDialogOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const { mutate: changeNickname, isPending: isChanging } = useChangeNickname()
  const { data: nicknameHistory } = useNicknameHistory(user.id)

  const handleNicknameChange = (nickname: string, reason: string) => {
    changeNickname(
      { id: user.id, nickname, reason },
      { onSuccess: () => setNicknameDialogOpen(false) },
    )
  }

  const getBanStatus = () => {
    if (!user.banned) return null

    if (user.bannedUntil && user.bannedUntil > 0) {
      const until = new Date(user.bannedUntil)
      const isExpired = until < new Date()
      if (isExpired) return null

      return (
        <div className="flex items-center gap-3 text-red-600">
          <Ban className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs text-red-400">계정 상태</span>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">
                차단 (~{until.toLocaleDateString('ko-KR')})
              </Badge>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3 text-red-600">
        <Ban className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-xs text-red-400">계정 상태</span>
          <Badge variant="destructive" className="text-xs">영구 차단</Badge>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {getBanStatus()}
          <div className="flex items-center gap-3 text-gray-600">
            <UserIcon className="h-4 w-4" />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-400">닉네임</span>
              <div className="flex items-center gap-2">
                <span>{user.userName || '-'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setNicknameDialogOpen(true)}
                  title="닉네임 변경"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                {nicknameHistory && nicknameHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 text-xs text-gray-400"
                    onClick={() => setShowHistory(!showHistory)}
                    title="변경 내역"
                  >
                    <History className="h-3 w-3 mr-1" />
                    {nicknameHistory.length}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 닉네임 변경 내역 */}
          {showHistory && nicknameHistory && nicknameHistory.length > 0 && (
            <div className="ml-7 bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-gray-500">닉네임 변경 내역</p>
              {nicknameHistory.map((h) => (
                <div key={h.id} className="text-xs text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">{new Date(h.createdAt).toLocaleDateString('ko-KR')}</span>
                  <span className="line-through text-gray-400">{h.oldName}</span>
                  <span>→</span>
                  <span className="font-medium">{h.newName}</span>
                  {h.reason && <span className="text-gray-400">({h.reason})</span>}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-600">
            <UserIcon className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">실명</span>
              <span>{user.name || '-'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Email / Identifier</span>
              <span>{user.email || user.identifier}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">전화번호</span>
              <span>{user.phoneNumber || '-'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Shield className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Game ID</span>
              <span>{user.userGameId}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Users className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">클랜</span>
              <span>{user.clan ? `${user.clan.name} (ID: ${user.clan.id})` : '없음'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">가입일</span>
              <span>{new Date(user.createdAt).toLocaleString()}</span>
            </div>
          </div>
          {user.adultConfirmed > 0 && (
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">성인인증 완료일</span>
                <span className="text-green-600">{new Date(user.adultConfirmed).toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <NicknameChangeDialog
        open={nicknameDialogOpen}
        onOpenChange={setNicknameDialogOpen}
        currentNickname={user.userName || ''}
        onConfirm={handleNicknameChange}
        isPending={isChanging}
      />
    </>
  )
}
