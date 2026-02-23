import { FC } from 'react'
import { useDashboardSummary } from '../hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Users, DollarSign, Trophy, Shield, UserPlus, Ban, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export const DashboardPage: FC = () => {
  const { data, isLoading } = useDashboardSummary()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      {/* 유저 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              전체 유저
            </div>
            <p className="text-2xl font-bold">{data.users.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <UserPlus className="h-4 w-4" />
              오늘 가입
            </div>
            <p className="text-2xl font-bold text-green-600">{data.users.today}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Ban className="h-4 w-4" />
              차단 유저
            </div>
            <p className="text-2xl font-bold text-red-600">{data.users.banned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Trophy className="h-4 w-4" />
              진행중 토너먼트
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {data.tournaments.ongoing}
              <span className="text-sm font-normal text-gray-400 ml-1">
                / 예정 {data.tournaments.upcoming}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 결제 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <DollarSign className="h-4 w-4" />
              오늘 결제
            </div>
            <p className="text-xl font-bold">{data.payments.todayCount}건</p>
            <p className="text-sm text-gray-500">{Number(data.payments.todayAmount).toLocaleString()}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <DollarSign className="h-4 w-4" />
              이번 달 결제
            </div>
            <p className="text-xl font-bold">{data.payments.monthCount}건</p>
            <p className="text-sm text-gray-500">{Number(data.payments.monthAmount).toLocaleString()}원</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 관리자 활동 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            최근 관리자 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAuditLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">최근 활동이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {data.recentAuditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.adminName}</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-gray-600">{log.action}</span>
                    {log.targetName && (
                      <>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-500">{log.targetName}</span>
                      </>
                    )}
                  </div>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: ko })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
