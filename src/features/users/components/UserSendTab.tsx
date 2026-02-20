import { FC } from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { MessageSquare, Send } from 'lucide-react'
import { useCreateNotice, useUploadNoticeImage } from '@/features/messages/hooks/useMessages'
import { DateTimePicker } from '@/shared/components/ui/date-time-picker'
import { ImageUploader } from '@/shared/components/ui/image-uploader'
import { DATE_PRESETS } from '@/shared/constants/date-presets'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form'
import { messageSchema } from '@/features/messages/schemas/messageSchema'
import type { UserGroup } from '@/features/users/types'

interface UserSendTabProps {
  userId: string
  userName?: string
}

export const UserSendTab: FC<UserSendTabProps> = ({ userId, userName }) => {
  const { mutate: createMessage, isPending: isCreating } = useCreateNotice()
  const { mutate: uploadImage, isPending: isUploading } = useUploadNoticeImage()

  const handleImageUpload = (file: File) => {
    uploadImage(file, {
      onSuccess: (response) => {
        form.setFieldValue('imagePath', response.url)
      },
      onError: (err) => {
        alert('이미지 업로드에 실패했습니다.')
        console.error(err)
      }
    })
  }

  const form = useForm({
    defaultValues: {
      titleKo: '',
      titleEn: '',
      titleJa: '',
      descriptionKo: '',
      descriptionEn: '',
      descriptionJa: '',
      scheduledDate: undefined as Date | undefined,
      targetType: 'user' as const,
      selectedGroups: [] as UserGroup[],
      imagePath: '',
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    validators: {
      onChange: messageSchema as any,
    },
    onSubmit: async ({ value }) => {
      const isScheduled = value.scheduledDate && value.scheduledDate.getTime() > Date.now()
      const confirmMessage = isScheduled 
        ? `${userName || userId} 님에게 ${value.scheduledDate?.toLocaleString()}에 메시지를 발송하시겠습니까?`
        : `${userName || userId} 님에게 메시지를 즉시 발송하시겠습니까?`

      if (window.confirm(confirmMessage)) {
        createMessage({
          titleKo: value.titleKo,
          titleEn: value.titleKo, // Sync with KO
          titleJa: value.titleKo, // Sync with KO
          descriptionKo: value.descriptionKo,
          descriptionEn: value.descriptionKo, // Sync with KO
          descriptionJa: value.descriptionKo, // Sync with KO
          all: false,
          groups: [],
          scheduledTimestamp: value.scheduledDate ? value.scheduledDate.getTime() : Date.now(),
          sent: !isScheduled
        }, {
          onSuccess: () => {
            alert('메시지가 성공적으로 등록되었습니다.')
            form.reset()
            const now = new Date()
            now.setSeconds(0, 0)
            form.setFieldValue('scheduledDate', now)
          },
          onError: (err: any) => {
            alert(`발송 실패: ${err.message || '알 수 없는 오류'}`)
          }
        })
      }
    },
  })

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">개인 메시지 발송</CardTitle>
          </div>
          <CardDescription>
            해당 사용자에게만 노출되는 메시지를 작성하여 발송합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <form.Field
                name="titleKo"
                children={(field) => (
                  <FormField field={field}>
                    <FormItem>
                      <Label>제목 *</Label>
                      <FormControl>
                        <Input 
                          placeholder="메시지 제목을 입력하세요"
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
                name="descriptionKo"
                children={(field) => (
                  <FormField field={field}>
                    <FormItem>
                      <Label>내용 *</Label>
                      <FormControl>
                        <Textarea 
                          placeholder="메시지 내용을 입력하세요"
                          rows={5}
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
            </div>

            <div className="space-y-2">
              <form.Field
                name="imagePath"
                children={(field) => (
                  <FormField field={field}>
                    <FormItem>
                      <Label>이미지 ({isUploading ? '업로드 중...' : '선택'})</Label>
                      <FormControl>
                        <ImageUploader 
                          value={field.state.value || ''}
                          onChange={handleImageUpload}
                          onRemove={() => field.handleChange('')}
                          disabled={isUploading}
                          maxSizeInMB={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>발송 예약일</Label>
              <form.Field
                name="scheduledDate"
                children={(field) => (
                  <FormField field={field}>
                    <FormItem className="flex flex-col">
                      <DateTimePicker 
                        date={field.state.value} 
                        setDate={field.handleChange}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {DATE_PRESETS.map((preset) => (
                          <Button
                            key={preset.label}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => field.handleChange(preset.getValue())}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <div className="flex justify-end pt-2 border-t">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit]) => (
                  <Button 
                    type="submit" 
                    disabled={!canSubmit || isCreating || isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8"
                  >
                    <Send className="h-4 w-4" />
                    {isCreating || isUploading ? '처리 중...' : '메시지 전송'}
                  </Button>
                )}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}