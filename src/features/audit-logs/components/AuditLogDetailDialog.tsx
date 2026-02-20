import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { AuditLogActionBadge } from './AuditLogActionBadge'
import type { AuditLog } from '../types'

const TARGET_TYPE_LABELS: Record<string, string> = {
  USER: '유저',
  TOURNAMENT: '토너먼트',
  TICKET: '티켓',
  NOTICE: '우편',
  ANNOUNCEMENT: '공지',
  SHOP: '상점',
  SYSTEM: '시스템',
}

interface AuditLogDetailDialogProps {
  log: AuditLog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AuditLogDetailDialog: FC<AuditLogDetailDialogProps> = ({
  log,
  open,
  onOpenChange,
}) => {
  if (!log) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>오딧 로그 상세</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
            <span className="text-gray-500">일시</span>
            <span>{new Date(log.createdAt).toLocaleString('ko-KR')}</span>

            <span className="text-gray-500">관리자</span>
            <span>{log.adminName} (ID: {log.adminId})</span>

            <span className="text-gray-500">IP</span>
            <span className="font-mono text-xs">{log.ip}</span>

            <span className="text-gray-500">액션</span>
            <div><AuditLogActionBadge action={log.action} /></div>

            <span className="text-gray-500">대상</span>
            <span>
              {TARGET_TYPE_LABELS[log.targetType] ?? log.targetType}
              {log.targetName && ` - ${log.targetName}`}
              {' '}
              <span className="text-gray-400">(ID: {log.targetId})</span>
            </span>
          </div>

          {log.detail && Object.keys(log.detail).length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">상세 내용</p>
              <pre className="bg-gray-50 border rounded-md p-3 text-xs overflow-auto max-h-[300px] whitespace-pre-wrap">
                {JSON.stringify(log.detail, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
