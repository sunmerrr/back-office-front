import { useState } from 'react'
import { ChevronsUpDown, Check, X } from 'lucide-react'
import { useTicket, useSendTicket } from '../hooks/useTickets'
import { useSearchGroups } from '@/features/users/hooks/useGroups'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/utils/cn'
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
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { DateTimePicker } from '@/shared/components/ui/date-time-picker'
import type { UserGroup } from '@/features/users/types'
import { DATE_PRESETS } from '@/shared/constants/date-presets'

interface GrantTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketId: string | null
}

export const GrantTicketDialog = ({ open, onOpenChange, ticketId }: GrantTicketDialogProps) => {
  const [selectedGroups, setSelectedGroups] = useState<UserGroup[]>([])
  const [isAllUsers, setIsAllUsers] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: ticket, isLoading } = useTicket(ticketId || '')
  const { mutate: sendTicket, isPending } = useSendTicket()
  const { data: groupsResponse, isLoading: isLoadingGroups } = useSearchGroups(debouncedSearchTerm)

  const groups = groupsResponse?.data || []

  const handleSelectGroup = (group: UserGroup) => {
    const exists = selectedGroups.some((g) => g.id === group.id)
    if (exists) {
      setSelectedGroups(selectedGroups.filter((g) => g.id !== group.id))
    } else {
      setSelectedGroups([...selectedGroups, group])
    }
  }

  const handleRemoveGroup = (groupId: string) => {
    setSelectedGroups(selectedGroups.filter((g) => g.id !== groupId))
  }

  const handleSend = () => {
    if (!ticketId) return
    if (!isAllUsers && selectedGroups.length === 0) {
      alert('대상 그룹을 선택하거나 전원 발송을 체크해주세요.')
      return
    }

    sendTicket({
      ticket: ticketId,
      groups: isAllUsers ? [] : selectedGroups.map(g => g.id),
      specificUser: "", 
      all: isAllUsers,
      scheduledTimestamp: scheduledDate ? scheduledDate.getTime() : Date.now(),
    }, {
      onSuccess: () => {
        alert('티켓이 성공적으로 발송되었습니다.')
        onOpenChange(false)
        setSelectedGroups([])
        setIsAllUsers(false)
        setScheduledDate(new Date())
      },
      onError: (err: any) => {
        alert(`발송 실패: ${err.message || '알 수 없는 오류'}`)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>티켓 발송</DialogTitle>
          <DialogDescription>
            선택한 티켓을 전체 사용자 또는 특정 회원 그룹에게 발급합니다.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-4 text-center">불러오는 중...</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">선택된 티켓</Label>
              <div className="col-span-3 font-medium text-blue-600">{ticket?.title || '티켓 정보 없음'}</div>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">발송 범위</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox 
                  id="all-users" 
                  checked={isAllUsers} 
                  onCheckedChange={(checked) => setIsAllUsers(!!checked)} 
                />
                <label 
                  htmlFor="all-users" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  서비스 전체 사용자에게 발송
                </label>
              </div>
            </div>
            
            {!isAllUsers && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-3">대상 그룹</Label>
                <div className="col-span-3 flex flex-col gap-2">
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between h-auto min-h-[40px]"
                      >
                        <div className="flex flex-wrap gap-1 text-left">
                          {selectedGroups.length > 0 
                            ? `${selectedGroups.length}개 그룹 선택됨` 
                            : "그룹 검색 및 선택..."}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="그룹 이름 검색..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <CommandList>
                          {isLoadingGroups ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              불러오는 중...
                            </div>
                          ) : !groups || groups.length === 0 ? (
                            <CommandEmpty>결과가 없습니다.</CommandEmpty>
                          ) : (
                            <CommandGroup heading={searchTerm ? "검색 결과" : "전체 그룹 목록"}>
                              {groups.map((group) => {
                                const isSelected = selectedGroups.some((g) => g.id === group.id)
                                return (
                                  <CommandItem
                                    key={group.id}
                                    onSelect={() => handleSelectGroup(group)}
                                    className={cn(isSelected && "bg-accent")}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{group.title}</span>
                                        <span className="text-xs text-muted-foreground">
                                          회원 수: {group.count}명
                                        </span>
                                      </div>
                                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex flex-wrap gap-2 min-h-[30px] mt-1">
                    {selectedGroups.length === 0 && (
                      <span className="text-sm text-muted-foreground">선택된 그룹이 없습니다.</span>
                    )}
                    {selectedGroups.map((group) => (
                      <Badge key={group.id} variant="secondary" className="flex items-center gap-1 pr-1 pl-2 py-1">
                        <span className="max-w-[150px] truncate">{group.title}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveGroup(group.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button 
            onClick={handleSend} 
            disabled={isPending || !ticketId || (!isAllUsers && selectedGroups.length === 0)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? '발송 중...' : '티켓 발급 확정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}