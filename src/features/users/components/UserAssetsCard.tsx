import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Coins, ArrowUpCircle, ArrowDownCircle, RotateCcw } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { formatNumber, formatFullNumber } from '@/shared/utils/format'
import { useGoldHistory, useAddGold, useSubGold, useEmptyGold } from '../hooks/useUsers'

interface UserAssetsCardProps {
  userId: string
}

export const UserAssetsCard: FC<UserAssetsCardProps> = ({ userId }) => {
  // Use page 1 limit 1 just to get the total balance
  const { data: goldData } = useGoldHistory(userId, 1, 1)
  
  const { mutate: addGold, isPending: isAddingGold } = useAddGold()
  const { mutate: subGold, isPending: isSubbingGold } = useSubGold()
  const { mutate: emptyGold, isPending: isEmptyingGold } = useEmptyGold()

  const handleAddGold = () => {
    const amountStr = window.prompt('지급할 골드 수량을 입력하세요:', '1000')
    if (!amountStr) return
    const amount = parseInt(amountStr, 10)
    if (isNaN(amount) || amount <= 0) return alert('유효한 숫자를 입력하세요.')
    
    if (window.confirm(`${amount.toLocaleString()} 골드를 지급하시겠습니까?`)) {
      addGold({ userIds: [userId], amount })
    }
  }

  const handleSubGold = () => {
    const amountStr = window.prompt('차감할 골드 수량을 입력하세요:', '1000')
    if (!amountStr) return
    const amount = parseInt(amountStr, 10)
    if (isNaN(amount) || amount <= 0) return alert('유효한 숫자를 입력하세요.')
    
    if (window.confirm(`${amount.toLocaleString()} 골드를 차감하시겠습니까?`)) {
      subGold({ userIds: [userId], amount })
    }
  }

  const handleEmptyGold = () => {
    if (window.confirm('유저의 모든 골드를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      emptyGold([userId])
    }
  }

  const isActionPending = isAddingGold || isSubbingGold || isEmptyingGold

  return (
    <Card className="border-blue-100 bg-blue-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-600" />
          골드 관리
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm text-center cursor-help transition-colors hover:bg-blue-50"
              >
                <span className="text-xs text-gray-400 block mb-1">현재 보유 골드</span>
                <span className="text-2xl font-black text-blue-700 block truncate">
                  {goldData?.data.total ? formatNumber(goldData.data.total) : '0'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono text-base">
                {formatFullNumber(goldData?.data.total)} 골드
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1 bg-white border-green-200 text-green-700 hover:bg-green-50"
            onClick={handleAddGold}
            disabled={isActionPending}
          >
            <ArrowUpCircle className="h-4 w-4" />
            지급
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 bg-white border-red-200 text-red-700 hover:bg-red-50"
            onClick={handleSubGold}
            disabled={isActionPending}
          >
            <ArrowDownCircle className="h-4 w-4" />
            차감
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-xs text-gray-400 hover:text-red-500 gap-1"
          onClick={handleEmptyGold}
          disabled={isActionPending}
        >
          <RotateCcw className="h-3 w-3" />
          골드 초기화
        </Button>
      </CardContent>
    </Card>
  )
}
