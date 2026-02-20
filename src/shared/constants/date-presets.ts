import { addHours, addDays, startOfDay, addWeeks, addMonths, set } from "date-fns"

const sanitize = (date: Date, options: Parameters<typeof set>[1] = {}) =>
  set(date, { seconds: 0, milliseconds: 0, ...options })

export const DATE_PRESETS = [
  { 
    label: "지금", 
    getValue: () => sanitize(new Date()) 
  },
  { 
    label: "1시간 후", 
    getValue: () => sanitize(addHours(new Date(), 1)) 
  },
  { 
    label: "오늘 21시", 
    getValue: () => sanitize(new Date(), { hours: 21, minutes: 0 }) 
  },
  { 
    label: "내일 9시", 
    getValue: () => sanitize(addDays(new Date(), 1), { hours: 9, minutes: 0 }) 
  },
  { 
    label: "내일 21시", 
    getValue: () => sanitize(addDays(new Date(), 1), { hours: 21, minutes: 0 }) 
  },
] as const

export const DATE_ONLY_PRESETS = [
  { label: '오늘', getValue: () => startOfDay(new Date()) },
  { label: '내일', getValue: () => addDays(startOfDay(new Date()), 1) },
  { label: '1주 후', getValue: () => addWeeks(startOfDay(new Date()), 1) },
  { label: '1달 후', getValue: () => addMonths(startOfDay(new Date()), 1) },
] as const
