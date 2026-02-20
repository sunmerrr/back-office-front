import { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { X } from 'lucide-react'
import type { AuditAction, AuditTargetType } from '../types'

const ACTION_GROUPS: { label: string; items: { value: AuditAction; label: string }[] }[] = [
  {
    label: '유저 관리',
    items: [
      { value: 'GOLD_ADD', label: '골드 지급' },
      { value: 'GOLD_SUB', label: '골드 차감' },
      { value: 'DIAMOND_ADD', label: '다이아 지급' },
      { value: 'DIAMOND_SUB', label: '다이아 차감' },
      { value: 'TICKET_GRANT', label: '티켓 지급' },
      { value: 'USER_BAN', label: '유저 차단' },
      { value: 'USER_UNBAN', label: '차단 해제' },
      { value: 'USER_ROLE_CHANGE', label: '역할 변경' },
      { value: 'NICKNAME_CHANGE', label: '닉네임 변경' },
      { value: 'PASSWORD_RESET', label: '비밀번호 초기화' },
    ],
  },
  {
    label: '토너먼트',
    items: [
      { value: 'TOURNAMENT_CREATE', label: '토너먼트 생성' },
      { value: 'TOURNAMENT_UPDATE', label: '토너먼트 수정' },
      { value: 'TOURNAMENT_DELETE', label: '토너먼트 삭제' },
      { value: 'TOURNAMENT_FORCE_DELETE', label: '토너먼트 강제삭제' },
      { value: 'TOURNAMENT_CANCEL', label: '토너먼트 취소' },
      { value: 'TOURNAMENT_FORCE_REGISTER', label: '강제 등록' },
      { value: 'TOURNAMENT_FORCE_UNREGISTER', label: '강제 등록해제' },
    ],
  },
  {
    label: '티켓',
    items: [
      { value: 'TICKET_CREATE', label: '티켓 생성' },
      { value: 'TICKET_UPDATE', label: '티켓 수정' },
      { value: 'TICKET_DELETE', label: '티켓 삭제' },
      { value: 'TICKET_SEND', label: '티켓 발송' },
    ],
  },
  {
    label: '공지',
    items: [
      { value: 'NOTICE_CREATE', label: '우편 생성' },
      { value: 'NOTICE_UPDATE', label: '우편 수정' },
      { value: 'NOTICE_DELETE', label: '우편 삭제' },
      { value: 'ANNOUNCEMENT_CREATE', label: '공지 등록' },
      { value: 'ANNOUNCEMENT_UPDATE', label: '공지 수정' },
      { value: 'ANNOUNCEMENT_DELETE', label: '공지 삭제' },
    ],
  },
  {
    label: '상점',
    items: [
      { value: 'SHOP_PRODUCT_CREATE', label: '상품 등록' },
      { value: 'SHOP_PRODUCT_UPDATE', label: '상품 수정' },
      { value: 'SHOP_PRODUCT_DELETE', label: '상품 삭제' },
    ],
  },
  {
    label: '시스템',
    items: [
      { value: 'IP_WHITELIST_ADD', label: 'IP 허용 추가' },
      { value: 'IP_WHITELIST_REMOVE', label: 'IP 허용 삭제' },
    ],
  },
]

const TARGET_TYPES: { value: AuditTargetType; label: string }[] = [
  { value: 'USER', label: '유저' },
  { value: 'TOURNAMENT', label: '토너먼트' },
  { value: 'TICKET', label: '티켓' },
  { value: 'NOTICE', label: '우편' },
  { value: 'ANNOUNCEMENT', label: '공지' },
  { value: 'SHOP', label: '상점' },
  { value: 'SYSTEM', label: '시스템' },
]

interface AuditLogFiltersProps {
  action?: AuditAction
  targetType?: AuditTargetType
  startDate: string
  endDate: string
  onActionChange: (value: AuditAction | undefined) => void
  onTargetTypeChange: (value: AuditTargetType | undefined) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onReset: () => void
}

export const AuditLogFilters: FC<AuditLogFiltersProps> = ({
  action,
  targetType,
  startDate,
  endDate,
  onActionChange,
  onTargetTypeChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) => {
  const hasFilters = action || targetType || startDate || endDate

  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-lg border shadow-sm flex-wrap">
      <Select
        value={action ?? ''}
        onValueChange={(v) => onActionChange(v ? (v as AuditAction) : undefined)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="액션 타입" />
        </SelectTrigger>
        <SelectContent>
          {ACTION_GROUPS.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={targetType ?? ''}
        onValueChange={(v) => onTargetTypeChange(v ? (v as AuditTargetType) : undefined)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="대상 타입" />
        </SelectTrigger>
        <SelectContent>
          {TARGET_TYPES.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-[160px]"
        />
        <span className="text-gray-400">~</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-[160px]"
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-500">
          <X className="h-4 w-4 mr-1" />
          초기화
        </Button>
      )}
    </div>
  )
}
