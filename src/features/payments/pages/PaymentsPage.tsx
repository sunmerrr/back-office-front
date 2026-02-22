import { FC, useState } from 'react'
import { usePayments, usePaymentStats } from '../hooks/usePayments'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/shared/components/ui/table'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/ui/select'
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { Card, CardContent } from '@/shared/components/ui/card'
import { DollarSign, TrendingUp } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'REFUNDED', label: '환불' },
  { value: 'FAILED', label: '실패' },
] as const

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
  COMPLETED: { label: '완료', variant: 'default' },
  REFUNDED: { label: '환불', variant: 'secondary' },
  FAILED: { label: '실패', variant: 'destructive' },
}

export const PaymentsPage: FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data, isLoading, error } = usePayments({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const { data: stats } = usePaymentStats()

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ko-KR')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">결제 내역</h1>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign className="h-4 w-4" />
                오늘 결제
              </div>
              <p className="text-lg font-bold">{stats.totalCount}건</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <TrendingUp className="h-4 w-4" />
                총 결제 금액
              </div>
              <p className="text-lg font-bold">{stats.totalAmount.toLocaleString()}원</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 필터 */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-[160px]"
        />
        <span className="text-gray-400">~</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-[160px]"
        />
        {(startDate || endDate) && (
          <Button variant="ghost" size="sm" onClick={() => { setStartDate(''); setEndDate('') }}>
            초기화
          </Button>
        )}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">ID</TableHead>
              <TableHead>유저</TableHead>
              <TableHead>상품</TableHead>
              <TableHead className="text-right">금액</TableHead>
              <TableHead className="text-center">수단</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">결제일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">로딩 중...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  결제 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((p) => {
                const badge = STATUS_BADGE[p.status] || { label: p.status, variant: 'outline' as const }
                return (
                  <TableRow key={p.id}>
                    <TableCell className="text-center font-medium">{p.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{p.userName || '-'}</span>
                        <span className="text-xs text-gray-500">{p.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{p.product}</TableCell>
                    <TableCell className="text-right font-medium">{formatAmount(p.amount, p.currency)}</TableCell>
                    <TableCell className="text-center text-sm">{p.method || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">{formatDate(p.paidAt)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page - 1) }} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 2 && pageNum <= page + 2)) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink href="#" isActive={page === pageNum} onClick={(e) => { e.preventDefault(); handlePageChange(pageNum) }}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (pageNum === page - 3 || pageNum === page + 3) {
                return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page + 1) }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
