"use client"

import { useState, useEffect } from "react"
import { format, addDays, addMonths, addWeeks } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/shared/utils/cn"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  disabled?: boolean
  placeholder?: string
}

export function DatePicker({ date, setDate, disabled, placeholder = "날짜 선택" }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date)

  // Sync internal state with prop
  useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    setDate(newDate)
  }

  const presets = [
    { label: "오늘", value: new Date() },
    { label: "내일", value: addDays(new Date(), 1) },
    { label: "3일 후", value: addDays(new Date(), 3) },
    { label: "1주일 후", value: addWeeks(new Date(), 1) },
    { label: "1달 후", value: addMonths(new Date(), 1) },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-row" align="start">
        {/* Presets - Left Side */}
        <div className="flex flex-col gap-1 p-3 border-r border-border bg-slate-50/50 min-w-[100px]">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Presets</p>
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              className="justify-start font-normal h-8 px-2 text-xs"
              onClick={() => handleSelect(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Calendar - Right Side */}
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
