import { FC, useState } from 'react'
import {
  useTournaments,
  useCreateTournament,
  useUpdateTournament,
  useDeleteTournament,
  useCancelTournament,
} from '../hooks/useTournaments'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { TournamentStatusBadge } from '../components/TournamentStatusBadge'
import { CreateTournamentDialog } from '../components/CreateTournamentDialog'
import { EditTournamentDialog } from '../components/EditTournamentDialog'
import { TournamentDetailDialog } from '../components/TournamentDetailDialog'
import { CancelTournamentDialog } from '../components/CancelTournamentDialog'
import type { Tournament, CreateTournamentData } from '../types'
import { Pencil, Trash2, XCircle, Eye, Plus } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'upcoming', label: '예정' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
] as const

export const TournamentsPage: FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const debouncedSearch = useDebounce(search, 500)

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)

  const { data, isLoading, error } = useTournaments({
    page,
    limit,
    query: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? (statusFilter as Tournament['status']) : undefined,
  })

  const { mutate: createTournament, isPending: isCreating } = useCreateTournament()
  const { mutate: updateTournament, isPending: isUpdating } = useUpdateTournament()
  const { mutate: deleteTournament, isPending: isDeleting } = useDeleteTournament()
  const { mutate: cancelTournament, isPending: isCancelling } = useCancelTournament()

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  const handleCreate = (createData: CreateTournamentData) => {
    createTournament(createData, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  const handleEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setEditOpen(true)
  }

  const handleUpdate = (updateData: Partial<CreateTournamentData>) => {
    if (!selectedTournament) return
    updateTournament(
      { id: selectedTournament.id, data: updateData },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  const handleDetail = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setDetailOpen(true)
  }

  const handleDelete = (tournament: Tournament) => {
    if (!window.confirm(`"${tournament.name}" 토너먼트를 삭제하시겠습니까?`)) return
    deleteTournament(tournament.id)
  }

  const handleCancelOpen = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setCancelOpen(true)
  }

  const handleCancel = (reason: string) => {
    if (!selectedTournament) return
    cancelTournament(
      { id: selectedTournament.id, reason },
      { onSuccess: () => setCancelOpen(false) },
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ko-KR')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">토너먼트 관리</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          토너먼트 생성
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="토너먼트 이름 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">ID</TableHead>
              <TableHead>이름</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-right">상금</TableHead>
              <TableHead className="text-center">참가자</TableHead>
              <TableHead className="text-center">시작일</TableHead>
              <TableHead className="text-center">종료일</TableHead>
              <TableHead className="text-center w-[160px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">로딩 중...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  토너먼트가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-center font-medium">{t.id}</TableCell>
                  <TableCell>
                    <button
                      className="text-left font-medium text-blue-600 hover:underline"
                      onClick={() => handleDetail(t)}
                    >
                      {t.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <TournamentStatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {t.prizePool ? t.prizePool.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {t.participants}{t.maxParticipants ? `/${t.maxParticipants}` : ''}
                  </TableCell>
                  <TableCell className="text-center text-sm">{formatDate(t.startDate)}</TableCell>
                  <TableCell className="text-center text-sm">{formatDate(t.endDate)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDetail(t)}
                        title="상세"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(t.status === 'upcoming' || t.status === 'ongoing') && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(t)}
                            title="수정"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelOpen(t)}
                            title="취소"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {t.status === 'upcoming' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(t)}
                          disabled={isDeleting}
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(page - 1) }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2)
              ) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNum) }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (pageNum === page - 3 || pageNum === page + 3) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(page + 1) }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Dialogs */}
      <CreateTournamentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onConfirm={handleCreate}
        isPending={isCreating}
      />
      <EditTournamentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        tournament={selectedTournament}
        onConfirm={handleUpdate}
        isPending={isUpdating}
      />
      <TournamentDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        tournament={selectedTournament}
      />
      <CancelTournamentDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        tournament={selectedTournament}
        onConfirm={handleCancel}
        isPending={isCancelling}
      />
    </div>
  )
}
