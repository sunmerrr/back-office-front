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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { TournamentStatusBadge } from './TournamentStatusBadge'
import { useTournamentParticipants, useAddParticipant, useRemoveParticipant } from '../hooks/useTournaments'
import type { Tournament } from '../types'
import { UserPlus, UserMinus } from 'lucide-react'

interface TournamentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament: Tournament | null
}

export const TournamentDetailDialog: FC<TournamentDetailDialogProps> = ({
  open,
  onOpenChange,
  tournament,
}) => {
  const [newUserId, setNewUserId] = useState('')

  const { data: participants, isLoading } = useTournamentParticipants(
    tournament?.id || '',
  )
  const { mutate: addParticipant, isPending: isAdding } = useAddParticipant()
  const { mutate: removeParticipant, isPending: isRemoving } = useRemoveParticipant()

  const canManageParticipants =
    tournament?.status === 'upcoming' || tournament?.status === 'ongoing'

  const handleAddParticipant = () => {
    if (!tournament || !newUserId.trim()) return

    addParticipant(
      { tournamentId: tournament.id, userId: newUserId.trim() },
      { onSuccess: () => setNewUserId('') },
    )
  }

  const handleRemoveParticipant = (userId: string) => {
    if (!tournament) return
    if (!window.confirm('참가자를 해제하시겠습니까?')) return
    removeParticipant({ tournamentId: tournament.id, userId })
  }

  const formatDate = (ts?: number | null) => {
    if (!ts) return '-'
    const d = new Date(ts)
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('ko-KR')
  }

  if (!tournament) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {tournament.name}
            <TournamentStatusBadge status={tournament.status} />
          </DialogTitle>
          <DialogDescription>{tournament.description || '설명 없음'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">시작일시:</span>{' '}
              <span className="font-medium">{formatDate(tournament.startDate)}</span>
            </div>
            <div>
              <span className="text-gray-500">종료일시:</span>{' '}
              <span className="font-medium">{formatDate(tournament.endDate)}</span>
            </div>
            <div>
              <span className="text-gray-500">상금:</span>{' '}
              <span className="font-medium">
                {tournament.prizePool ? Number(tournament.prizePool).toLocaleString() : '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">참가자:</span>{' '}
              <span className="font-medium">
                {tournament.participants}
                {tournament.maxParticipants ? `/${tournament.maxParticipants}` : ''}명
              </span>
            </div>
          </div>

          {/* 확장 설정 */}
          {(tournament.buyinGold || tournament.buyinTicketId || tournament.ticketOnly) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-blue-800">바이인 설정</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                {tournament.buyinGold && (
                  <div>골드: {Number(tournament.buyinGold).toLocaleString()}</div>
                )}
                {tournament.buyinTicketId && (
                  <div>티켓 ID: {tournament.buyinTicketId}</div>
                )}
                {tournament.ticketOnly && <div>티켓 전용</div>}
              </div>
            </div>
          )}

          {(tournament.prizeStructure?.length || tournament.prizeTicketId) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-green-800">상금 설정</p>
              {tournament.prizeTicketId && (
                <p className="text-sm text-green-700">상금 티켓 ID: {tournament.prizeTicketId}</p>
              )}
              {tournament.prizeStructure && tournament.prizeStructure.length > 0 && (
                <div className="text-sm text-green-700">
                  {tournament.prizeStructure.map((e) => (
                    <span key={e.rank} className="mr-3">{e.rank}위: {e.percent}%</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {(!tournament.visibility || tournament.pauseConfig || tournament.hitRunConfig?.enabled) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-gray-800">부가 설정</p>
              <div className="text-sm text-gray-700 space-y-1">
                {!tournament.visibility && <div>목록 비노출</div>}
                {tournament.pauseConfig && (
                  <div>Pause: {tournament.pauseConfig.type} = {tournament.pauseConfig.value}</div>
                )}
                {tournament.hitRunConfig?.enabled && (
                  <div>Hit & Run 방지: 최소 {tournament.hitRunConfig.minHands}핸드</div>
                )}
              </div>
            </div>
          )}

          {tournament.cancelledReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800">취소 사유</p>
              <p className="text-sm text-red-700">{tournament.cancelledReason}</p>
            </div>
          )}

          {/* 참가자 관리 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">참가자 목록</Label>
              {canManageParticipants && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder="유저 ID"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="w-28 h-8"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddParticipant}
                    disabled={!newUserId || isAdding}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {isAdding ? '등록 중...' : '강제 등록'}
                  </Button>
                </div>
              )}
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">유저 ID</TableHead>
                    <TableHead>닉네임</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead className="text-center">등록일</TableHead>
                    {canManageParticipants && (
                      <TableHead className="w-[80px] text-center">관리</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={canManageParticipants ? 5 : 4} className="text-center py-6">
                        로딩 중...
                      </TableCell>
                    </TableRow>
                  ) : !participants?.length ? (
                    <TableRow>
                      <TableCell colSpan={canManageParticipants ? 5 : 4} className="text-center py-6 text-gray-500">
                        참가자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    participants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-center font-medium">{p.userId}</TableCell>
                        <TableCell>{p.nickname || '-'}</TableCell>
                        <TableCell className="text-sm">{p.email}</TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDate(p.registeredAt)}
                        </TableCell>
                        {canManageParticipants && (
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveParticipant(p.userId)}
                              disabled={isRemoving}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
