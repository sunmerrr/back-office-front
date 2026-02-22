import { FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Coins, Gem, ArrowUpCircle, ArrowDownCircle, RotateCcw } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { formatNumber, formatFullNumber } from '@/shared/utils/format'
import { PermissionGate } from '@/shared/components/PermissionGate'
import {
  useGoldHistory,
  useDiamondHistory,
  useAddGold,
  useSubGold,
  useEmptyGold,
  useAddDiamond,
  useSubDiamond,
} from '../hooks/useUsers'
import { CurrencyActionDialog } from './CurrencyActionDialog'

interface UserAssetsCardProps {
  userId: string
  userName?: string
}

type DialogState = {
  open: boolean
  type: 'gold' | 'diamond'
  action: 'add' | 'sub'
}

export const UserAssetsCard: FC<UserAssetsCardProps> = ({ userId, userName }) => {
  const { data: goldData } = useGoldHistory(userId, 1, 1)
  const { data: diamondData } = useDiamondHistory(userId, 1, 1)

  const { mutate: addGold, isPending: isAddingGold } = useAddGold()
  const { mutate: subGold, isPending: isSubbingGold } = useSubGold()
  const { mutate: emptyGold, isPending: isEmptyingGold } = useEmptyGold()
  const { mutate: addDiamond, isPending: isAddingDiamond } = useAddDiamond()
  const { mutate: subDiamond, isPending: isSubbingDiamond } = useSubDiamond()

  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    type: 'gold',
    action: 'add',
  })

  const openDialog = (type: 'gold' | 'diamond', action: 'add' | 'sub') => {
    setDialogState({ open: true, type, action })
  }

  const handleCurrencyConfirm = (amount: number, message: string) => {
    const { type, action } = dialogState
    const params = { userIds: [userId], amount, message }

    const mutateOptions = {
      onSuccess: () => setDialogState((s) => ({ ...s, open: false })),
    }

    if (type === 'gold' && action === 'add') addGold(params, mutateOptions)
    else if (type === 'gold' && action === 'sub') subGold(params, mutateOptions)
    else if (type === 'diamond' && action === 'add') addDiamond(params, mutateOptions)
    else if (type === 'diamond' && action === 'sub') subDiamond(params, mutateOptions)
  }

  const handleEmptyGold = () => {
    if (window.confirm('유저의 모든 골드를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      emptyGold([userId])
    }
  }

  const isActionPending = isAddingGold || isSubbingGold || isEmptyingGold || isAddingDiamond || isSubbingDiamond
  const isMutatePending =
    (dialogState.type === 'gold' && dialogState.action === 'add' && isAddingGold) ||
    (dialogState.type === 'gold' && dialogState.action === 'sub' && isSubbingGold) ||
    (dialogState.type === 'diamond' && dialogState.action === 'add' && isAddingDiamond) ||
    (dialogState.type === 'diamond' && dialogState.action === 'sub' && isSubbingDiamond)

  const diamondBalance = diamondData?.data.total ?? 0

  return (
    <>
      {/* Gold Card */}
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
          <PermissionGate permission="user:currency">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-1 bg-white border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => openDialog('gold', 'add')}
                disabled={isActionPending}
              >
                <ArrowUpCircle className="h-4 w-4" />
                지급
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1 bg-white border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => openDialog('gold', 'sub')}
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
          </PermissionGate>
        </CardContent>
      </Card>

      {/* Diamond Card */}
      <Card className="border-purple-100 bg-purple-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gem className="h-5 w-5 text-purple-600" />
            다이아 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm text-center cursor-help transition-colors hover:bg-purple-50"
                >
                  <span className="text-xs text-gray-400 block mb-1">현재 보유 다이아</span>
                  <span className="text-2xl font-black text-purple-700 block truncate">
                    {formatNumber(diamondBalance)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-base">
                  {formatFullNumber(diamondBalance)} 다이아
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PermissionGate permission="user:currency">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-1 bg-white border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => openDialog('diamond', 'add')}
                disabled={isActionPending}
              >
                <ArrowUpCircle className="h-4 w-4" />
                지급
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1 bg-white border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => openDialog('diamond', 'sub')}
                disabled={isActionPending}
              >
                <ArrowDownCircle className="h-4 w-4" />
                차감
              </Button>
            </div>
          </PermissionGate>
        </CardContent>
      </Card>

      {/* Shared Dialog */}
      <CurrencyActionDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((s) => ({ ...s, open }))}
        type={dialogState.type}
        action={dialogState.action}
        userId={userId}
        userName={userName}
        onConfirm={handleCurrencyConfirm}
        isPending={isMutatePending}
      />
    </>
  )
}
