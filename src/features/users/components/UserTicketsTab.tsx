import { FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Ticket } from 'lucide-react'
import { useUserTickets } from '../hooks/useUsers'
import { GrantTicketToUserDialog } from './GrantTicketToUserDialog'

interface UserTicketsTabProps {
  userId: string
  userName?: string
}

export const UserTicketsTab: FC<UserTicketsTabProps> = ({ userId, userName }) => {
  const [ticketPage, setTicketPage] = useState(1)
  const [isGrantTicketOpen, setIsGrantTicketOpen] = useState(false)
  const { data: ticketData, isLoading: isTicketsLoading } = useUserTickets(ticketPage)

  return (
    <>
      <Card>
        <CardHeader className="py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md flex items-center gap-2">
              티켓 보유 내역
              <span className="text-sm font-normal text-gray-400">전체 {ticketData?.meta.total ?? 0}건</span>
            </CardTitle>
            <Button 
              size="sm" 
              className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsGrantTicketOpen(true)}
            >
              <Ticket className="h-3.5 w-3.5" />
              티켓 발송
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[150px]">티켓 ID</TableHead>
                <TableHead>티켓 명칭</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-center">만료 일시</TableHead>
                <TableHead className="text-center">대상 게임</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTicketsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-400">로딩 중...</TableCell>
                </TableRow>
              ) : !ticketData?.data.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-400">보유 중인 티켓이 없습니다.</TableCell>
                </TableRow>
              ) : (
                ticketData.data.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="text-center text-xs text-gray-500 font-mono">
                      {ticket.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {ticket.title}
                    </TableCell>
                    <TableCell className="text-center">
                      {ticket.isUsed ? (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-500">사용됨</Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">미사용</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {ticket.expiredTimestamp > 0 
                        ? new Date(ticket.expiredTimestamp).toLocaleString() 
                        : '무제한'}
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="cursor-help">
                              {ticket.games.length}개 게임
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {ticket.games.map(gameId => (
                                <p key={gameId} className="text-xs font-mono">{gameId}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {ticketData && ticketData.meta.total > ticketData.meta.limit && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        if (ticketPage > 1) setTicketPage(p => p - 1) 
                      }}
                    />
                  </PaginationItem>

                  {[...Array(Math.ceil(ticketData.meta.total / ticketData.meta.limit))].map((_, i) => {
                    const pageNum = i + 1
                    const totalPages = Math.ceil(ticketData.meta.total / ticketData.meta.limit)
                    
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= ticketPage - 2 && pageNum <= ticketPage + 2)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={ticketPage === pageNum}
                            onClick={(e) => {
                              e.preventDefault()
                              setTicketPage(pageNum)
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (pageNum === ticketPage - 3 || pageNum === ticketPage + 3) {
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
                        const totalPages = Math.ceil(ticketData.meta.total / ticketData.meta.limit)
                        if (ticketPage < totalPages) setTicketPage(p => p + 1) 
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <GrantTicketToUserDialog 
        open={isGrantTicketOpen} 
        onOpenChange={setIsGrantTicketOpen} 
        userId={userId}
        userName={userName}
      />
    </>
  )
}
