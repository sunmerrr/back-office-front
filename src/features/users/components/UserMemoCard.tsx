import { FC, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { useUserMemo, useSaveUserMemo } from '../hooks/useUsers'

interface UserMemoCardProps {
  userId: string
}

export const UserMemoCard: FC<UserMemoCardProps> = ({ userId }) => {
  const { data: memo, isLoading } = useUserMemo(userId)
  const { mutate: saveMemo, isPending } = useSaveUserMemo()
  const [content, setContent] = useState('')

  useEffect(() => {
    if (memo) setContent(memo.content)
  }, [memo])

  const handleSave = () => {
    saveMemo({ userId, content }, {
      onSuccess: () => alert('메모가 저장되었습니다.'),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">관리자 메모</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full h-32 p-3 text-sm border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={isLoading ? '불러오는 중...' : '유저에 대한 특이사항을 기록하세요...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
        <Button className="w-full mt-2" size="sm" onClick={handleSave} disabled={isPending || isLoading}>
          {isPending ? '저장 중...' : '메모 저장'}
        </Button>
      </CardContent>
    </Card>
  )
}
