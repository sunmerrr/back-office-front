import { FC, useState } from 'react'
import { useTicketHistory, useDeleteTicketHistory } from '../hooks/useTickets'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { EditHistoryDialog } from './EditHistoryDialog'
import { TicketHistoryDetailDialog } from './TicketHistoryDetailDialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import type { TicketHistory } from '../types'

export const TicketHistoryTab: FC = () => {
  const [page, setPage] = useState(1)
  const limit = 20
  const { data, isLoading, isError, error } = useTicketHistory({ page, limit })
  const { mutate: deleteHistory } = useDeleteTicketHistory()
  
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState<TicketHistory | null>(null)

  const handleEdit = (item: TicketHistory) => {
    setSelectedHistory(item)
    setEditOpen(true)
  }

  const handleDetail = (item: TicketHistory) => {
    setSelectedHistory(item)
    setDetailOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteHistory(id)
    }
  }

  if (isLoading) return <div className="p-6">Loading history...</div>
  if (isError) return <div className="p-6 text-red-500">Error: {error?.message}</div>

  const history = data?.data || []
  const total = data?.meta?.total || 0
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">발송 내역</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>로그 ID</TableHead>
                <TableHead>티켓 이름</TableHead>
                <TableHead>발송 대상</TableHead>
                <TableHead>예약 시간</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-center w-[100px]">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    발송 내역이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((log) => (
                  <TableRow 
                    key={log.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleDetail(log)}
                  >
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{log.ticket?.title}</TableCell>
                    <TableCell>
                      {log.all ? (
                        <Badge variant="secondary">전체 발송</Badge>
                      ) : (
                        <span className="text-muted-foreground">그룹/개별</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.scheduledTimestamp 
                        ? new Date(log.scheduledTimestamp).toLocaleString() 
                        : '즉시'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.sent ? "default" : "outline"} className={log.sent ? "bg-green-600" : ""}>
                        {log.sent ? "발송 완료" : "대기 중"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {!log.sent ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(log)
                              }}
                              title="예약 수정"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(log.id)
                              }}
                              title="발송 취소"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} 
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {/* Simple pagination logic: show all if pages < 10, otherwise show range (simplified for now) */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
               // Logic to show pages around current page could be added here
               // For simplicity, just showing first 5 or needs more complex logic
               let p = i + 1;
               if (totalPages > 5 && page > 3) {
                 p = page - 2 + i;
                 if (p > totalPages) p = totalPages - (4 - i);
               }
               
               return (
                <PaginationItem key={p}>
                  <PaginationLink 
                    href="#" 
                    isActive={page === p}
                    onClick={(e) => { e.preventDefault(); setPage(p); }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
               )
            })}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <EditHistoryDialog 
        open={editOpen} 
        onOpenChange={setEditOpen} 
        historyId={selectedHistory?.id || null} 
      />

      <TicketHistoryDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        historyId={selectedHistory?.id || null}
      />
    </div>
  )
}
