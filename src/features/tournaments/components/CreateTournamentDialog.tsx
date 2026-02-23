import { FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import type { CreateTournamentData, PrizeEntry, PauseConfig } from '../types'

interface CreateTournamentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: CreateTournamentData) => void
  isPending?: boolean
}

export const CreateTournamentDialog: FC<CreateTournamentDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}) => {
  // 기본 정보
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [prizePool, setPrizePool] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')

  // Buyin
  const [buyinGold, setBuyinGold] = useState('')
  const [buyinTicketId, setBuyinTicketId] = useState('')
  const [ticketOnly, setTicketOnly] = useState(false)

  // Prize
  const [prizeStructure, setPrizeStructure] = useState<PrizeEntry[]>([])
  const [prizeTicketId, setPrizeTicketId] = useState('')

  // 부가 설정
  const [visibility, setVisibility] = useState(true)
  const [pauseType, setPauseType] = useState<PauseConfig['type']>('level')
  const [pauseValue, setPauseValue] = useState('')
  const [pauseEnabled, setPauseEnabled] = useState(false)
  const [hitRunEnabled, setHitRunEnabled] = useState(false)
  const [hitRunMinHands, setHitRunMinHands] = useState('')

  // 섹션 토글
  const [showBuyin, setShowBuyin] = useState(false)
  const [showPrize, setShowPrize] = useState(false)
  const [showExtra, setShowExtra] = useState(false)

  const resetState = () => {
    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setPrizePool('')
    setMaxParticipants('')
    setBuyinGold('')
    setBuyinTicketId('')
    setTicketOnly(false)
    setPrizeStructure([])
    setPrizeTicketId('')
    setVisibility(true)
    setPauseType('level')
    setPauseValue('')
    setPauseEnabled(false)
    setHitRunEnabled(false)
    setHitRunMinHands('')
    setShowBuyin(false)
    setShowPrize(false)
    setShowExtra(false)
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState()
    onOpenChange(value)
  }

  const isValid = name.trim().length > 0 && startDate && endDate

  const handleAddPrizeEntry = () => {
    const nextRank = prizeStructure.length > 0
      ? Math.max(...prizeStructure.map(e => e.rank)) + 1
      : 1
    setPrizeStructure([...prizeStructure, { rank: nextRank, percent: 0 }])
  }

  const handleRemovePrizeEntry = (index: number) => {
    setPrizeStructure(prizeStructure.filter((_, i) => i !== index))
  }

  const handlePrizeEntryChange = (index: number, field: 'rank' | 'percent', value: number) => {
    setPrizeStructure(prizeStructure.map((e, i) => i === index ? { ...e, [field]: value } : e))
  }

  const handleConfirm = () => {
    if (!isValid) return

    const data: CreateTournamentData = {
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      prizePool: prizePool || undefined,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
    }

    // Buyin
    if (buyinGold) data.buyinGold = buyinGold
    if (buyinTicketId) data.buyinTicketId = buyinTicketId
    if (ticketOnly) data.ticketOnly = true

    // Prize
    if (prizeStructure.length > 0) data.prizeStructure = prizeStructure
    if (prizeTicketId) data.prizeTicketId = prizeTicketId

    // 부가 설정
    if (!visibility) data.visibility = false
    if (pauseEnabled && pauseValue) {
      data.pauseConfig = { type: pauseType, value: Number(pauseValue) }
    }
    if (hitRunEnabled && hitRunMinHands) {
      data.hitRunConfig = { enabled: true, minHands: Number(hitRunMinHands) }
    }

    onConfirm(data)
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>토너먼트 생성</DialogTitle>
          <DialogDescription>새로운 토너먼트를 생성합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 기본 정보 */}
          <div className="space-y-2">
            <Label>
              토너먼트 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="토너먼트 이름을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="토너먼트 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                시작일시 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                종료일시 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>상금풀</Label>
              <Input
                type="number"
                min={0}
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>최대 참가 인원</Label>
              <Input
                type="number"
                min={1}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="제한 없음"
              />
            </div>
          </div>

          {/* 바이인 설정 */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left hover:bg-gray-50"
              onClick={() => setShowBuyin(!showBuyin)}
            >
              <span>바이인 설정</span>
              {showBuyin ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {showBuyin && (
              <div className="px-4 pb-4 space-y-3 border-t">
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="space-y-2">
                    <Label>골드 바이인</Label>
                    <Input
                      type="number"
                      min={0}
                      value={buyinGold}
                      onChange={(e) => setBuyinGold(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>티켓 바이인 (티켓 ID)</Label>
                    <Input
                      value={buyinTicketId}
                      onChange={(e) => setBuyinTicketId(e.target.value)}
                      placeholder="티켓 ID"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ticketOnly}
                    onChange={(e) => setTicketOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">티켓으로만 참가 가능</span>
                </label>
              </div>
            )}
          </div>

          {/* 상금 설정 */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left hover:bg-gray-50"
              onClick={() => setShowPrize(!showPrize)}
            >
              <span>상금 배분 설정</span>
              {showPrize ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {showPrize && (
              <div className="px-4 pb-4 space-y-3 border-t">
                <div className="space-y-2 pt-3">
                  <Label>상금 티켓 (티켓 ID)</Label>
                  <Input
                    value={prizeTicketId}
                    onChange={(e) => setPrizeTicketId(e.target.value)}
                    placeholder="티켓 상금 대상 티켓 ID (선택)"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>순위별 상금 비율</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddPrizeEntry}>
                      <Plus className="h-3 w-3 mr-1" /> 추가
                    </Button>
                  </div>
                  {prizeStructure.length > 0 && (
                    <div className="space-y-2">
                      {prizeStructure.map((entry, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={entry.rank}
                            onChange={(e) => handlePrizeEntryChange(i, 'rank', Number(e.target.value))}
                            className="w-20"
                            placeholder="순위"
                          />
                          <span className="text-sm text-gray-500">위</span>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={entry.percent}
                            onChange={(e) => handlePrizeEntryChange(i, 'percent', Number(e.target.value))}
                            className="w-20"
                            placeholder="%"
                          />
                          <span className="text-sm text-gray-500">%</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemovePrizeEntry(i)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500">
                        합계: {prizeStructure.reduce((s, e) => s + e.percent, 0)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 부가 설정 */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left hover:bg-gray-50"
              onClick={() => setShowExtra(!showExtra)}
            >
              <span>부가 설정</span>
              {showExtra ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {showExtra && (
              <div className="px-4 pb-4 space-y-3 border-t pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibility}
                    onChange={(e) => setVisibility(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">메인 토너먼트 목록에 노출</span>
                </label>

                {/* Pause 설정 */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pauseEnabled}
                      onChange={(e) => setPauseEnabled(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Pause 설정</span>
                  </label>
                  {pauseEnabled && (
                    <div className="flex items-center gap-2 pl-6">
                      <Select value={pauseType} onValueChange={(v) => setPauseType(v as PauseConfig['type'])}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="level">레벨</SelectItem>
                          <SelectItem value="players">플레이어 수</SelectItem>
                          <SelectItem value="percent">비율 (%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={0}
                        value={pauseValue}
                        onChange={(e) => setPauseValue(e.target.value)}
                        placeholder="값"
                        className="w-24"
                      />
                    </div>
                  )}
                </div>

                {/* Hit & Run 설정 */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hitRunEnabled}
                      onChange={(e) => setHitRunEnabled(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Hit & Run 방지</span>
                  </label>
                  {hitRunEnabled && (
                    <div className="flex items-center gap-2 pl-6">
                      <Label className="text-sm whitespace-nowrap">최소 핸드 수</Label>
                      <Input
                        type="number"
                        min={1}
                        value={hitRunMinHands}
                        onChange={(e) => setHitRunMinHands(e.target.value)}
                        placeholder="0"
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isPending}>
            {isPending ? '생성 중...' : '생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
