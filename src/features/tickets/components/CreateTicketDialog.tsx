import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCreateTicket } from '../hooks/useTickets'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { TicketBasicInfoForm } from './TicketBasicInfoForm'
import type { TicketBasicInfo } from '../schemas/ticketSchema'
import type { CreateTicketData } from '../types'

export const CreateTicketDialog = () => {
  const [open, setOpen] = useState(false)

  const { mutate: createTicket, isPending } = useCreateTicket()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleSubmit = (data: TicketBasicInfo) => {
    const payload: CreateTicketData = {
      category: data.category,
      title: data.title,
      value: data.value,
      startTimestamp: data.startDate ? data.startDate.getTime() : undefined,
      expiredTimestamp: data.endDate ? data.endDate.getTime() : undefined,
    }

    createTicket(payload, {
      onSuccess: () => {
        handleOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          티켓 생성
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>티켓 생성</DialogTitle>
          <DialogDescription>
            티켓의 기본 정보를 입력하세요. 토너먼트 매칭은 생성 후 수정에서 설정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <TicketBasicInfoForm
            defaultValues={{}}
            onSubmit={handleSubmit}
            onCancel={() => handleOpenChange(false)}
            submitLabel={isPending ? '생성 중...' : '생성'}
            isSubmitDisabled={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
