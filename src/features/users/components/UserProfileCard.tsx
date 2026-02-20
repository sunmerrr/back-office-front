import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { User as UserIcon, Mail, Phone, Shield, Users, Calendar } from 'lucide-react'
import type { User } from '../types'

interface UserProfileCardProps {
  user: User
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">기본 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
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
  )
}
