import { FC, useState, useMemo } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Settings, Pencil, Plus, Shield, Trash2 } from 'lucide-react'

export const SettingsPage: FC = () => {
  const { data: settings, isLoading } = useSettings()
  const { mutate: updateSetting, isPending } = useUpdateSetting()

  const [editOpen, setEditOpen] = useState(false)
  const [editKey, setEditKey] = useState('')
  const [editValue, setEditValue] = useState('')
  const [isNewSetting, setIsNewSetting] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newIp, setNewIp] = useState('')

  // IP Whitelist
  const ipWhitelist: string[] = useMemo(() => {
    if (!settings) return []
    const setting = settings.find((s) => s.key === 'ip_whitelist')
    if (!setting || !Array.isArray(setting.value)) return []
    return setting.value as string[]
  }, [settings])

  const handleAddIp = () => {
    const ip = newIp.trim()
    if (!ip) return
    const updated = [...ipWhitelist, ip]
    updateSetting(
      { key: 'ip_whitelist', value: updated },
      { onSuccess: () => setNewIp('') },
    )
  }

  const handleRemoveIp = (index: number) => {
    const ip = ipWhitelist[index]
    if (!window.confirm(`"${ip}"를 화이트리스트에서 제거하시겠습니까?`)) return
    const updated = ipWhitelist.filter((_, i) => i !== index)
    updateSetting({ key: 'ip_whitelist', value: updated })
  }

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

      {/* IP 화이트리스트 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            IP 화이트리스트
          </CardTitle>
          <p className="text-sm text-gray-500">
            등록된 IP만 백오피스에 접근할 수 있습니다. 비어있으면 제한 없이 접근 가능합니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ipWhitelist.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {ipWhitelist.map((ip, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2">
                    <span className="font-mono text-sm">{ip}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveIp(i)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">등록된 IP가 없습니다. (전체 허용)</p>
            )}
            <div className="flex items-center gap-2">
              <Input
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="IP 또는 CIDR (예: 192.168.1.0/24)"
                className="font-mono max-w-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddIp()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddIp}
                disabled={!newIp.trim() || isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                추가
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
