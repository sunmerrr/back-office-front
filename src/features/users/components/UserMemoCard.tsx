import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

export const UserMemoCard: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">관리자 메모</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea 
          className="w-full h-32 p-3 text-sm border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="유저에 대한 특이사항을 기록하세요..."
        />
        <Button className="w-full mt-2" size="sm">메모 저장</Button>
      </CardContent>
    </Card>
  )
}
