import { FC } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import type { ShopContentItem } from '../types'

interface ProductContentsEditorProps {
  value: ShopContentItem[]
  onChange: (value: ShopContentItem[]) => void
}

const TYPE_LABELS: Record<ShopContentItem['type'], string> = {
  gold: '골드',
  diamond: '다이아',
  ticket: '티켓',
}

export const ProductContentsEditor: FC<ProductContentsEditorProps> = ({ value, onChange }) => {
  const handleAdd = () => {
    onChange([...value, { type: 'gold', amount: 0 }])
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof ShopContentItem, fieldValue: any) => {
    onChange(value.map((item, i) => i === index ? { ...item, [field]: fieldValue } : item))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">구성품</span>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-3 w-3 mr-1" /> 추가
        </Button>
      </div>
      {value.length === 0 && (
        <p className="text-xs text-gray-400">구성품을 추가하세요.</p>
      )}
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Select
            value={item.type}
            onValueChange={(v) => handleChange(i, 'type', v)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min={0}
            value={item.amount}
            onChange={(e) => handleChange(i, 'amount', Number(e.target.value))}
            placeholder="수량"
            className="w-24"
          />
          {item.type === 'ticket' && (
            <Input
              value={item.ticketId || ''}
              onChange={(e) => handleChange(i, 'ticketId', e.target.value)}
              placeholder="티켓 ID"
              className="w-28"
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => handleRemove(i)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
