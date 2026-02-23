import { FC, useState } from 'react'
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useDeactivateAnnouncement,
} from '../hooks/useAnnouncements'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
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
import { CreateAnnouncementDialog } from '../components/CreateAnnouncementDialog'
import { EditAnnouncementDialog } from '../components/EditAnnouncementDialog'
import type { Announcement, AnnouncementType, AnnouncementStatus, CreateAnnouncementData } from '../types'
import { Pencil, Trash2, EyeOff, Plus } from 'lucide-react'

const TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'BANNER', label: '배너' },
  { value: 'POPUP', label: '팝업' },
  { value: 'WEB', label: '웹' },
] as const

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'ACTIVE', label: '노출중' },
  { value: 'SCHEDULED', label: '예약' },
  { value: 'EXPIRED', label: '만료' },
  { value: 'INACTIVE', label: '비활성' },
] as const

const TYPE_LABELS: Record<AnnouncementType, string> = {
  BANNER: '배너',
  POPUP: '팝업',
  WEB: '웹',
}

const STATUS_COLORS: Record<AnnouncementStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-gray-100 text-gray-600',
  INACTIVE: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<AnnouncementStatus, string> = {
  ACTIVE: '노출중',
  SCHEDULED: '예약',
  EXPIRED: '만료',
  INACTIVE: '비활성',
}

export const AnnouncementsPage: FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const { data, isLoading, error } = useAnnouncements({
    page,
    limit,
    type: typeFilter !== 'all' ? (typeFilter as AnnouncementType) : undefined,
    status: statusFilter !== 'all' ? (statusFilter as AnnouncementStatus) : undefined,
  })

  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement()
  const { mutate: updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement()
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement()
  const { mutate: deactivateAnnouncement } = useDeactivateAnnouncement()

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  const handleCreate = (createData: CreateAnnouncementData) => {
    createAnnouncement(createData, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setEditOpen(true)
  }

  const handleUpdate = (updateData: Partial<CreateAnnouncementData & { status: Announcement['status'] }>) => {
    if (!selectedAnnouncement) return
    updateAnnouncement(
      { id: selectedAnnouncement.id, data: updateData },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  const handleDelete = (announcement: Announcement) => {
    if (!window.confirm(`"${announcement.title}" 공지를 삭제하시겠습니까?`)) return
    deleteAnnouncement(announcement.id)
  }

  const handleDeactivate = (announcement: Announcement) => {
    if (!window.confirm(`"${announcement.title}" 공지를 비활성화하시겠습니까?`)) return
    deactivateAnnouncement(announcement.id)
  }

  const formatDate = (ts: number | null) => {
    if (!ts) return '-'
    const d = new Date(ts)
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">공지 관리</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          공지 생성
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              <TableHead className="text-center w-[80px]">유형</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">정렬</TableHead>
              <TableHead className="text-center">시작일시</TableHead>
              <TableHead className="text-center">종료일시</TableHead>
              <TableHead className="text-center w-[120px]">관리</TableHead>
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
                  공지가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-center font-medium">{a.id}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {TYPE_LABELS[a.type]}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm">{a.sortOrder}</TableCell>
                  <TableCell className="text-center text-sm">{formatDate(a.startAt)}</TableCell>
                  <TableCell className="text-center text-sm">{formatDate(a.endAt)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(a)}
                        title="수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {(a.status === 'ACTIVE' || a.status === 'SCHEDULED') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => handleDeactivate(a)}
                          title="비활성화"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(a)}
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      <CreateAnnouncementDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onConfirm={handleCreate}
        isPending={isCreating}
      />
      <EditAnnouncementDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        announcement={selectedAnnouncement}
        onConfirm={handleUpdate}
        isPending={isUpdating}
      />
    </div>
  )
}
