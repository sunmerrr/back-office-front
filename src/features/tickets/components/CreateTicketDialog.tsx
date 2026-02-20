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
import { TicketGameSelectionForm } from './TicketGameSelectionForm'
import type { TicketBasicInfo, TicketGameSelection } from '../schemas/ticketSchema'
import type { CreateTicketData } from '../types'

export const CreateTicketDialog = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<Partial<TicketBasicInfo & TicketGameSelection>>({})
  
  const { mutate: createTicket, isPending } = useCreateTicket()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset on close
      setTimeout(() => {
        setStep(1)
        setFormData({})
      }, 300)
    }
  }

  const handleStep1Submit = (data: TicketBasicInfo) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStep2Submit = (data: TicketGameSelection) => {
    const finalData = { ...formData, ...data }
    
    // Transform to API payload
    const payload: CreateTicketData = {
      category: finalData.category!,
      title: finalData.title!,
      value: finalData.value!,
      startTimestamp: finalData.startDate ? finalData.startDate.getTime() : undefined,
      expiredTimestamp: finalData.endDate ? finalData.endDate.getTime() : undefined,
      games: finalData.games?.map(g => g.id),
      // Default values for other fields if needed
    }

    createTicket(payload, {
      onSuccess: () => {
        handleOpenChange(false)
      },
    })
  }

  const handleBack = () => {
    setStep(1)
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
          <DialogTitle>티켓 생성 {step === 1 ? '(1/2)' : '(2/2)'}</DialogTitle>
          <DialogDescription>
            {step === 1 
              ? '티켓의 기본 정보를 입력하세요.' 
              : '티켓을 사용할 수 있는 토너먼트를 선택하세요.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <TicketBasicInfoForm
              defaultValues={formData}
              onSubmit={handleStep1Submit}
              onCancel={() => handleOpenChange(false)}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
