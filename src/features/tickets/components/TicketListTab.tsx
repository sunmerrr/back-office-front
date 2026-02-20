import { FC, useState } from 'react'
import { useTickets, useDeleteTicket } from '../hooks/useTickets'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { CreateTicketDialog } from './CreateTicketDialog'
import { EditTicketDialog } from './EditTicketDialog'
import { GrantTicketDialog } from './GrantTicketDialog'
import { Send, Trash2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export const TicketListTab: FC = () => {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, isError, error } = useTickets({ page, limit })
  const { mutate: deleteTicket } = useDeleteTicket()
  
  const [editOpen, setEditOpen] = useState(false)
  const [grantOpen, setGrantOpen] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const tickets = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const handleEdit = (id: string) => {
    setSelectedTicketId(id)
    setEditOpen(true)
  }

  const handleGrant = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedTicketId(id)
    setGrantOpen(true)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('정말 이 티켓을 삭제하시겠습니까?')) {
      deleteTicket(id, {
        onSuccess: () => {
          setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
        }
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select tickets that haven't been sent
      const deletableIds = tickets.filter(t => (t.sentAmount ?? 0) === 0).map(t => t.id)
      setSelectedIds(deletableIds)
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    
    if (window.confirm(`선택한 ${selectedIds.length}개의 티켓을 삭제하시겠습니까?`)) {
      // Process deletions in parallel
      await Promise.all(selectedIds.map(id => deleteTicket(id)))
      setSelectedIds([])
    }
  }

  if (isLoading) return <div className="p-6 text-center">불러오는 중...</div>
  if (isError) return <div className="p-6 text-red-500 text-center">에러가 발생했습니다: {error?.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">티켓 목록</h2>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected} className="gap-2">
              <Trash2 className="h-4 w-4" />
              선택 삭제 ({selectedIds.length})
            </Button>
          )}
          <CreateTicketDialog />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">
                  <Checkbox 
                    checked={
                      tickets.filter(t => (t.sentAmount ?? 0) === 0).length > 0 && 
                      selectedIds.length === tickets.filter(t => (t.sentAmount ?? 0) === 0).length
                    }
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    disabled={tickets.filter(t => (t.sentAmount ?? 0) === 0).length === 0}
                  />
                </TableHead>
                <TableHead className="text-center w-[80px]">ID</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="text-center">카테고리</TableHead>
                <TableHead className="text-center">가치</TableHead>
                <TableHead className="text-center">사용 가능 기간</TableHead>
                <TableHead className="w-[100px] text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    티켓이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEdit(ticket.id)}
                  >
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIds.includes(ticket.id)}
                        onCheckedChange={(checked) => handleSelectOne(ticket.id, !!checked)}
                        disabled={(ticket.sentAmount ?? 0) > 0}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-center">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell className="capitalize text-center">{ticket.category}</TableCell>
                    <TableCell className="text-center">{Number(ticket.value).toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm leading-tight">
                        <span className="whitespace-nowrap">
                          {ticket.startTimestamp ? new Date(ticket.startTimestamp).toLocaleDateString() : '즉시'}
                        </span>
                        {" ~ "}
                        <span className="whitespace-nowrap text-muted-foreground">
                          {ticket.expiredTimestamp && ticket.expiredTimestamp < 4102358400000 ? new Date(ticket.expiredTimestamp).toLocaleDateString() : '무제한'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={(e) => handleGrant(e, ticket.id)}
                          title="티켓 발송"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleDelete(e, ticket.id)}
                          className={cn(
                            "hover:bg-red-50 hover:text-red-600",
                            (ticket.sentAmount ?? 0) > 0 && "opacity-30 cursor-not-allowed"
                          )}
                          disabled={(ticket.sentAmount ?? 0) > 0}
                          title={(ticket.sentAmount ?? 0) > 0 ? "발송 이력이 있는 티켓은 삭제할 수 없습니다" : "티켓 삭제"}
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
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={page === i + 1}
                    className="cursor-pointer"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <EditTicketDialog open={editOpen} onOpenChange={setEditOpen} ticketId={selectedTicketId} />
      <GrantTicketDialog open={grantOpen} onOpenChange={setGrantOpen} ticketId={selectedTicketId} />
    </div>
  )
}