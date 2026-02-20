import { useState, useEffect } from 'react'
import { useTicket, useUpdateTicket, useDeleteTicket } from '../hooks/useTickets'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { TicketBasicInfoForm } from './TicketBasicInfoForm'
import { TicketGameSelectionForm } from './TicketGameSelectionForm'
import type { TicketBasicInfo, TicketGameSelection } from '../schemas/ticketSchema'
import type { CreateTicketData } from '../types'

interface EditTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketId: string | null
}

export const EditTicketDialog = ({ open, onOpenChange, ticketId }: EditTicketDialogProps) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<Partial<TicketBasicInfo & TicketGameSelection>>({})
  
  const { data: ticket, isLoading } = useTicket(ticketId || '')
  const { mutate: updateTicket, isPending } = useUpdateTicket()
  const { mutate: deleteTicket } = useDeleteTicket()

  useEffect(() => {
    if (ticket && open) {
      
      setFormData({
        category: ticket.category,
        title: ticket.title,
        value: ticket.value.toString(),
        isNoExpiration: !ticket.expiredTimestamp,
        startDate: ticket.startTimestamp ? new Date(ticket.startTimestamp) : undefined,
        endDate: ticket.expiredTimestamp ? new Date(ticket.expiredTimestamp) : undefined,
        games: (ticket.games as any) || [], 
      })
      setStep(1)
    }
  }, [ticket, open])

  const handleDelete = () => {
    if (!ticketId) return
    if (confirm('정말 이 티켓을 삭제하시겠습니까?')) {
      deleteTicket(ticketId, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    }
  }

  const handleStep1Submit = (data: TicketBasicInfo) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStep2Submit = (data: TicketGameSelection) => {
    if (!ticketId) return

    const finalData = { ...formData, ...data }
    
    const payload: Partial<CreateTicketData> = {
      title: finalData.title,
      startTimestamp: finalData.startDate ? finalData.startDate.getTime() : undefined,
      expiredTimestamp: finalData.endDate ? finalData.endDate.getTime() : undefined,
      games: finalData.games?.map(g => g.id),
    }

    updateTicket({ id: ticketId, data: payload }, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>티켓 수정 {step === 1 ? '(1/2)' : '(2/2)'}</DialogTitle>
          <DialogDescription>
            {step === 1 
              ? '티켓의 기본 정보를 수정합니다. (가치와 카테고리는 수정할 수 없습니다)' 
              : '티켓을 사용할 수 있는 토너먼트를 수정합니다.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
             <div className="flex justify-center p-4">Loading...</div>
          ) : (
            <>
              {step === 1 && (
                <TicketBasicInfoForm
                  defaultValues={formData}
                  onSubmit={handleStep1Submit}
                  onCancel={() => onOpenChange(false)}
                  onDelete={(ticket?.sentAmount ?? 0) === 0 ? handleDelete : undefined}
                  disabledFields={['category', 'value']}
                />
              )}
              
              {step === 2 && (
                <TicketGameSelectionForm
                  defaultValues={formData}
                  onSubmit={handleStep2Submit}
                  onBack={handleBack}
                  isLoading={isPending}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}