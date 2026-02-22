import { FC, useState } from 'react'
import { useSettings, useUpdateSetting } from '../hooks/useSettings'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/shared/components/ui/dialog'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Settings, Pencil, Plus } from 'lucide-react'

export const SettingsPage: FC = () => {
  const { data: settings, isLoading } = useSettings()
  const { mutate: updateSetting, isPending } = useUpdateSetting()

  const [editOpen, setEditOpen] = useState(false)
  const [editKey, setEditKey] = useState('')
  const [editValue, setEditValue] = useState('')
  const [isNewSetting, setIsNewSetting] = useState(false)
  const [newKey, setNewKey] = useState('')

  const handleEdit = (key: string, value: any) => {
    setEditKey(key)
    setEditValue(typeof value === 'string' ? value : JSON.stringify(value, null, 2))
    setIsNewSetting(false)
    setEditOpen(true)
  }

  const handleAdd = () => {
    setNewKey('')
    setEditValue('')
    setIsNewSetting(true)
    setEditOpen(true)
  }

  const handleSave = () => {
    const key = isNewSetting ? newKey.trim() : editKey
    if (!key) return

    let parsedValue: any
    try {
      parsedValue = JSON.parse(editValue)
    } catch {
      parsedValue = editValue
    }

    updateSetting(
      { key, value: parsedValue },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  const formatValue = (value: any): string => {
    if (typeof value === 'string') return value
    return JSON.stringify(value)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('ko-KR')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          시스템 설정
        </h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          설정 추가
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">키</TableHead>
              <TableHead>값</TableHead>
              <TableHead className="text-center w-[180px]">최종 수정</TableHead>
              <TableHead className="text-center w-[80px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">로딩 중...</TableCell>
              </TableRow>
            ) : !settings?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  설정이 없습니다. "설정 추가" 버튼으로 새 설정을 추가하세요.
                </TableCell>
              </TableRow>
            ) : (
              settings.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm font-medium">{s.key}</TableCell>
                  <TableCell className="text-sm max-w-[400px] truncate">{formatValue(s.value)}</TableCell>
                  <TableCell className="text-center text-sm text-gray-500">{formatDate(s.updatedAt)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(s.key, s.value)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 편집 다이얼로그 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{isNewSetting ? '설정 추가' : '설정 수정'}</DialogTitle>
            <DialogDescription>
              {isNewSetting ? '새로운 시스템 설정을 추가합니다.' : `"${editKey}" 값을 수정합니다.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isNewSetting && (
              <div className="space-y-2">
                <Label>키</Label>
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="설정 키 (예: maintenance_mode)"
                  className="font-mono"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>값</Label>
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="값을 입력하세요 (JSON 또는 문자열)"
                rows={5}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-400">{'JSON 형식도 지원합니다 (예: true, ["item1"], {"key":"value"})'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>취소</Button>
            <Button
              onClick={handleSave}
              disabled={isPending || (isNewSetting && !newKey.trim())}
            >
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
