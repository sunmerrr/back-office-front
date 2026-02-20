import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { useTicketHistoryDetail } from '../hooks/useTickets'

interface TicketHistoryDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  historyId: string | null
}

export const TicketHistoryDetailDialog = ({ open, onOpenChange, historyId }: TicketHistoryDetailDialogProps) => {
  const { data: historyItem, isLoading } = useTicketHistoryDetail(historyId)

  if (!historyId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>발송 내역 상세</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-10 text-center">불러오는 중...</div>
        ) : historyItem ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">로그 ID</Label>
              <div className="col-span-3 font-mono text-sm">{historyItem.id}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">티켓 명</Label>
              <div className="col-span-3 font-medium">{historyItem.ticket.title}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">발송 상태</Label>
              <div className="col-span-3">
                <Badge variant={historyItem.sent ? "default" : "outline"} className={historyItem.sent ? "bg-green-600" : ""}>
                  {historyItem.sent ? "발송 완료" : "발송 대기"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">예약 일시</Label>
              <div className="col-span-3">
                {historyItem.scheduledTimestamp 
                  ? new Date(historyItem.scheduledTimestamp).toLocaleString() 
                  : '즉시 발송'}
              </div>
            </div>

            <div className="border-t my-2"></div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right text-muted-foreground pt-1">발송 범위</Label>
              <div className="col-span-3">
                {historyItem.all ? (
                  <Badge variant="secondary">전체 사용자</Badge>
                ) : (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">특정 그룹 발송</span>
                    <div className="flex flex-wrap gap-1">
                      {historyItem.groups?.map((group) => (
                        <Badge key={group.id} variant="outline" className="bg-slate-50">
                          {group.title}
                        </Badge>
                      ))}
                      {(!historyItem.groups || historyItem.groups.length === 0) && (
                        <p className="text-xs text-muted-foreground italic">(그룹 정보 없음)</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-destructive">데이터를 불러오지 못했습니다.</div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
