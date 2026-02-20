import { FC, useState } from 'react'
import { useNotices, useDeleteNotice } from '../hooks/useMessages'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
// import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/shared/components/ui/pagination'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { MessageFormDialog } from '../components/MessageFormDialog'
import type { Notice } from '../types'
import { Trash2 } from 'lucide-react'

export const MessagesPage: FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const debouncedSearch = useDebounce('', 500)

  const { data, isLoading, error } = useNotices({
    page,
    limit,
    query: debouncedSearch,
  })

  const { mutate: deleteNotice } = useDeleteNotice()

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0
  const notices = data?.data || []

  const handleCreate = () => {
    setSelectedNoticeId(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (notice: Notice) => {
    setSelectedNoticeId(notice.id)
    setIsDialogOpen(true)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const unsentNoticeIds = notices.filter(n => !n.sent).map(n => n.id)
      setSelectedIds(unsentNoticeIds)
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

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 메시지를 삭제하시겠습니까?')) {
      deleteNotice(id, {
        onSuccess: () => {
          setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
        }
      })
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    
    if (window.confirm(`선택한 ${selectedIds.length}개의 메시지를 삭제하시겠습니까?`)) {
      selectedIds.forEach(id => {
        deleteNotice(id)
      })
      setSelectedIds([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">메시지 관리</h1>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected} className="gap-2">
              <Trash2 className="h-4 w-4" />
              선택 삭제 ({selectedIds.length})
            </Button>
          )}
          <Button onClick={handleCreate}>메시지 등록</Button>
        </div>
      </div>

      {/* <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="메시지 제목 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div> */}

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox 
                  checked={
                    notices.filter(n => !n.sent).length > 0 && 
                    selectedIds.length === notices.filter(n => !n.sent).length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  disabled={notices.filter(n => !n.sent).length === 0}
                />
              </TableHead>
              <TableHead className="w-[100px] text-center">상태</TableHead>
              <TableHead>제목 (KO)</TableHead>
              <TableHead className="text-center w-[150px]">전체 발송</TableHead>
              <TableHead className="text-center w-[200px]">예약 일시</TableHead>
              <TableHead className="text-center w-[80px]">삭제</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : !notices.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  등록된 메시지가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow 
                  key={notice.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEdit(notice)}
                >
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedIds.includes(notice.id)}
                      onCheckedChange={(checked) => handleSelectOne(notice.id, !!checked)}
                      disabled={notice.sent}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {notice.sent ? (
                      <Badge className="bg-green-100 text-green-800 border-none">발송됨</Badge>
                    ) : (
                      <Badge variant="secondary">대기중</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {notice.titleKo}
                  </TableCell>
                  <TableCell className="text-center">
                    {notice.all ? (
                      <Badge variant="outline">전체</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">지정</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {new Date(notice.scheduledTimestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(notice.id)}
                      disabled={notice.sent}
                    >
                      <Trash2 className={`h-4 w-4 ${notice.sent ? 'opacity-30' : ''}`} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

                  
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (page > 1) setPage(p => p - 1) 
                  }}
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
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(pageNum)
                        }}
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
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (page < totalPages) setPage(p => p + 1) 
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <MessageFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        noticeId={selectedNoticeId} 
      />
    </div>
  )
}
