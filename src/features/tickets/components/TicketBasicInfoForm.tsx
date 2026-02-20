import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { ticketBasicInfoSchema, type TicketBasicInfo } from '../schemas/ticketSchema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { DatePicker } from '@/shared/components/ui/date-picker'
import { DATE_ONLY_PRESETS } from '@/shared/constants/date-presets'

interface TicketBasicInfoFormProps {
  defaultValues?: Partial<TicketBasicInfo>
  onSubmit: (data: TicketBasicInfo) => void
  onCancel: () => void
  onDelete?: () => void
  disabledFields?: ('category' | 'value')[]
}

export const TicketBasicInfoForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  onDelete,
  disabledFields = [],
}: TicketBasicInfoFormProps) => {
  const form = useForm({
    defaultValues: {
      category: defaultValues?.category ?? 'tournament',
      title: defaultValues?.title ?? '',
      value: defaultValues?.value ?? '',
      isNoExpiration: defaultValues?.isNoExpiration ?? false,
      startDate: defaultValues?.startDate,
      endDate: defaultValues?.endDate,
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    validators: {
      onChange: ticketBasicInfoSchema as any,
    },
    onSubmit: async ({ value }) => {
      const submissionData = { ...value } as TicketBasicInfo
      
      if (!submissionData.endDate) {
        submissionData.isNoExpiration = true
      }

      onSubmit(submissionData)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="category"
        children={(field) => (
          <FormField field={field}>
            <FormItem>
              <FormLabel>카테고리</FormLabel>
              <Select
                onValueChange={(val) => field.handleChange(val as any)}
                value={field.state.value}
                disabled={disabledFields.includes('category')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="phase">Phase</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      />

      <form.Field
        name="title"
        children={(field) => (
          <FormField field={field}>
            <FormItem>
              <FormLabel>티켓 이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 주말 스페셜 티켓"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      />

      <form.Field
        name="value"
        children={(field) => (
          <FormField field={field}>
            <FormItem>
              <FormLabel>가치 (Value)</FormLabel>
              <FormControl>
                <Input
                  placeholder="10000"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={disabledFields.includes('value')}
                />
              </FormControl>
              <FormDescription>티켓의 금액적 가치를 입력하세요.</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="startDate"
          children={(field) => (
            <FormField field={field}>
              <FormItem className="flex flex-col">
                <FormLabel>시작일</FormLabel>
                <DatePicker
                  date={field.state.value}
                  setDate={field.handleChange}
                  placeholder="시작일 선택"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {DATE_ONLY_PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-[10px] px-2 bg-slate-50 text-slate-600"
                      onClick={() => field.handleChange(preset.getValue())}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            </FormField>
          )}
        />

        <form.Field
          name="endDate"
          children={(field) => {
            const isNoExpiration = form.getFieldValue('isNoExpiration')
            
            return (
              <FormField field={field}>
                <FormItem className="flex flex-col">
                  <FormLabel>만료일</FormLabel>
                  <DatePicker
                    date={field.state.value}
                    setDate={field.handleChange}
                    disabled={isNoExpiration}
                    placeholder="만료일 선택"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {DATE_ONLY_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2 bg-slate-50 text-slate-600"
                        disabled={isNoExpiration}
                        onClick={() => field.handleChange(preset.getValue())}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              </FormField>
            )
          }}
        />
      </div>

      <form.Field
        name="isNoExpiration"
        children={(field) => (
          <FormField field={field}>
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
              <FormControl>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked: boolean) => {
                    field.handleChange(checked)
                    if (checked) {
                      form.setFieldValue('endDate', undefined)
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>만료일 없음</FormLabel>
              </div>
            </FormItem>
          </FormField>
        )}
      />

      <div className="flex justify-between items-center pt-4">
        {onDelete ? (
          <Button variant="destructive" type="button" onClick={onDelete}>
            삭제
          </Button>
        ) : <div />}
        
        <div className="flex space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            취소
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : '다음'}
              </Button>
            )}
          />
        </div>
      </div>
    </form>
  )
}
