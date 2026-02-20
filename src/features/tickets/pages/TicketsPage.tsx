import { FC } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'
import { TicketListTab } from '../components/TicketListTab'
import { TicketHistoryTab } from '../components/TicketHistoryTab'

export const TicketsPage: FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">티켓 관리</h1>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">티켓 목록</TabsTrigger>
          <TabsTrigger value="history">발송 내역</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TicketListTab />
        </TabsContent>
        <TabsContent value="history">
          <TicketHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
