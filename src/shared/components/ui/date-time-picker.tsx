"use client"

import { format, isSameDay } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/shared/utils/cn"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

interface DateTimePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  disabled?: boolean
  placeholder?: string
}

export function DateTimePicker({ date, setDate, disabled, placeholder = "일시 선택" }: DateTimePickerProps) {
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return
    const current = date || new Date()
    const updated = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      current.getHours(),
      current.getMinutes(),
      0,
      0
    )
    setDate(updated)
  }

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    const current = date || new Date()
    const updated = new Date(current)
    if (type === 'hours') updated.setHours(parseInt(value))
    else updated.setMinutes(parseInt(value))
    updated.setSeconds(0, 0)
    setDate(updated)
  }

  const isToday = date && isSameDay(date, new Date())
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // 분을 5분 단위로 내림 처리하여 기본값 설정
  const defaultMinute = (Math.floor(currentMinute / 5) * 5).toString()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd HH:mm") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-row" align="start">
        {/* Calendar - Middle */}
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>

        {/* Time Picker - Right Side */}
        <div className="flex flex-col p-3 border-l border-border min-w-[100px] bg-slate-50/30">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">시간 설정</span>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground px-1">시 (Hour)</label>
              <Select 
                value={date ? date.getHours().toString() : currentHour.toString()} 
                onValueChange={(v) => handleTimeChange('hours', v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem 
                      key={i} 
                      value={i.toString()}
                      disabled={isToday && i < currentHour}
                    >
                      {i.toString().padStart(2, '0')}시
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground px-1">분 (Min)</label>
              <Select 
                value={date ? date.getMinutes().toString() : defaultMinute} 
                onValueChange={(v) => handleTimeChange('minutes', v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: 60 }).map((_, i) => {
                    // 기본적으로 5분 단위거나, 현재 선택된 분인 경우만 표시
                    const isSelectedMinute = date && date.getMinutes() === i;
                    const isFiveMinuteStep = i % 5 === 0;
                    
                    if (isFiveMinuteStep || isSelectedMinute) {
                      return (
                        <SelectItem 
                          key={i} 
                          value={i.toString()}
                          disabled={isToday && date?.getHours() === currentHour && i < currentMinute}
                        >
                          {i.toString().padStart(2, '0')}분
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-auto pt-4">
             <Button 
               variant="secondary" 
               className="w-full h-7 text-[10px]" 
               onClick={() => {
                 const d = new Date()
                 d.setSeconds(0, 0)
                 setDate(d)
               }}
             >
               현재 시간
             </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}