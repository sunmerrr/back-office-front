import { useState } from 'react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTickets, useSendTicket } from '@/features/tickets/hooks/useTickets'
import { extractApiError } from '@/shared/utils/error'
import { useDebounce } from '@/shared/hooks/useDebounce'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { DateTimePicker } from '@/shared/components/ui/date-time-picker'
import { DATE_PRESETS } from '@/shared/constants/date-presets'

interface GrantTicketToUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName?: string
}

export const GrantTicketToUserDialog = ({ open, onOpenChange, userId, userName }: GrantTicketToUserDialogProps) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const queryClient = useQueryClient()

  // 티켓 목록 조회 (검색 지원)
  const { data: ticketsData, isLoading: isLoadingTickets } = useTickets({
    page: 1,
    limit: 50,
    title: debouncedSearchTerm
  })

  const { mutate: sendTicket, isPending } = useSendTicket()

  const tickets = ticketsData?.items || []
  const selectedTicket = tickets.find(t => t.id === selectedTicketId)

  const handleSend = () => {
    if (!selectedTicketId) {
      alert('발송할 티켓을 선택해주세요.')
      return
    }

    sendTicket({
      ticket: selectedTicketId,
      groups: [],
      specificUser: userId, 
      all: false,
      scheduledTimestamp: scheduledDate ? scheduledDate.getTime() : Date.now(),
    }, {
      onSuccess: () => {
        alert('티켓이 성공적으로 발송되었습니다.')
        queryClient.invalidateQueries({ queryKey: ['userTickets'] })
        onOpenChange(false)
        setSelectedTicketId(null)
        setScheduledDate(new Date())
      },
      onError: async (err: unknown) => {
        alert(`발송 실패: ${await extractApiError(err, '알 수 없는 오류')}`)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>개인 티켓 발송</DialogTitle>
          <DialogDescription>
            <span className="font-bold text-blue-600">{userName || userId}</span> 님에게 티켓을 발급합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-3">티켓 선택</Label>
            <div className="col-span-3">
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    {selectedTicket ? selectedTicket.title : "티켓 검색 및 선택..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="티켓 이름 검색..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <CommandList>
                      {isLoadingTickets ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          불러오는 중...
                        </div>
                      ) : !tickets || tickets.length === 0 ? (
                        <CommandEmpty>결과가 없습니다.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {tickets.map((ticket) => (
                            <CommandItem
                              key={ticket.id}
                              onSelect={() => {
                                setSelectedTicketId(ticket.id)
                                setOpenCombobox(false)
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                  <span className="font-medium">{ticket.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    가치: {ticket.value}
                                  </span>
                                </div>
                                {selectedTicketId === ticket.id && <Check className="h-4 w-4 text-primary" />}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">발송 예약일</Label>
            <div className="col-span-3">
              <DateTimePicker 
                date={scheduledDate} 
                setDate={setScheduledDate}
                placeholder="일시 선택 (기본: 즉시 발송)"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {DATE_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2 bg-slate-50 hover:bg-slate-100 text-slate-600"
                    onClick={() => setScheduledDate(preset.getValue())}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button 
            onClick={handleSend} 
            disabled={isPending || !selectedTicketId}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? '발송 중...' : '티켓 발급 확정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
