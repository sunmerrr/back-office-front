import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { usePaymentHistory } from '../hooks/useUsers'
import { formatFullNumber } from '@/shared/utils/format'

interface UserPaymentsTabProps {
  userId: string
}

export const UserPaymentsTab: FC<UserPaymentsTabProps> = ({ userId }) => {
  const { data: paymentData, isLoading } = usePaymentHistory(userId)
  const payments = paymentData?.data.paymentList || []

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-md flex justify-between items-center">
          결제 및 구독 내역
          <span className="text-sm font-normal text-gray-400">전체 {payments.length}건</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">상품명 (Order Name)</TableHead>
              <TableHead className="text-center w-[100px]">상태</TableHead>
              <TableHead className="text-right">결제 금액</TableHead>
              <TableHead className="text-center w-[180px]">만료/갱신일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">로딩 중...</TableCell>
              </TableRow>
            ) : !payments.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">내역이 없습니다.</TableCell>
              </TableRow>
            ) : (
              payments.map((item, index) => {
                const isSuccess = item.status === 'CONFIRM'
                
                return (
                  <TableRow key={`${item.orderName}-${index}`}>
                    <TableCell className="text-sm font-medium">
                      {item.orderName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={isSuccess ? "default" : "destructive"} 
                        className={`text-[10px] font-normal ${isSuccess ? 'bg-green-100 text-green-800 border-none hover:bg-green-100' : ''}`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatFullNumber(item.amount.toString())} {item.currency}
                    </TableCell>
                    <TableCell className="text-center text-xs text-gray-500">
                      {item.expiredAt ? new Date(item.expiredAt).toLocaleString() : '-'}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
