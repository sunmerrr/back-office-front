import { FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink
} from '@/shared/components/ui/pagination'
import { useDiamondHistory } from '../hooks/useUsers'
import { formatFullNumber } from '@/shared/utils/format'
import type { UserGoldLogData } from '../types'

interface UserDiamondTabProps {
  userId: string
}

export const UserDiamondTab: FC<UserDiamondTabProps> = ({ userId }) => {
  const [page, setPage] = useState(1)
  const { data: diamondData, isLoading } = useDiamondHistory(userId, page)

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-md flex justify-between items-center">
          다이아 변동 내역
          <span className="text-sm font-normal text-gray-400">전체 {diamondData?.total ?? 0}건</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[120px]">날짜</TableHead>
              <TableHead className="text-center w-[100px]">유형</TableHead>
              <TableHead>내용</TableHead>
              <TableHead className="text-right">변동 금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">로딩 중...</TableCell>
              </TableRow>
            ) : !diamondData?.data.log.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">내역이 없습니다.</TableCell>
              </TableRow>
            ) : (
              diamondData.data.log.map((log: UserGoldLogData, index: number) => {
                const isPositive = !log.amount.startsWith('-')
                const amountDisplay = formatFullNumber(log.amount)

                return (
                  <TableRow key={`${log.createdAt}-${index}`}>
                    <TableCell className="text-center text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px] font-normal uppercase">
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="font-medium">{log.title}</div>
                      {log.message && <div className="text-xs text-gray-400">{log.message}</div>}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${isPositive ? 'text-purple-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{amountDisplay}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {diamondData && diamondData.total > 20 && (
          <div className="p-4 border-t">
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

                {[...Array(Math.ceil(diamondData.total / 20))].map((_, i) => {
                  const pageNum = i + 1
                  const totalPages = Math.ceil(diamondData.total / 20)

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
                      const totalPages = Math.ceil(diamondData.total / 20)
                      if (page < totalPages) setPage(p => p + 1)
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
