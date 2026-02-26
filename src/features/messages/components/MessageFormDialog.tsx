import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { ChevronsUpDown, Check, X } from 'lucide-react'
import { useCreateNotice, useUpdateNotice, useNotice, useUploadNoticeImage } from '../hooks/useMessages'
import { useSearchGroups } from '@/features/users/hooks/useGroups'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/utils/cn'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Badge } from '@/shared/components/ui/badge'
import { DateTimePicker } from '@/shared/components/ui/date-time-picker'
import { ImageUploader } from '@/shared/components/ui/image-uploader'
import { DATE_PRESETS } from '@/shared/constants/date-presets'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form'
import { messageSchema } from '../schemas/messageSchema'
import type { UserGroup } from '@/features/users/types'

interface MessageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  noticeId?: string | null
}

export const MessageFormDialog = ({ open, onOpenChange, noticeId }: MessageFormDialogProps) => {
  const { data: noticeDetail, isLoading: isLoadingNotice } = useNotice(noticeId || '')
  
  const notice = noticeId ? noticeDetail : null
  const isSent = notice?.sent === true
  
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  const { mutate: createNotice, isPending: isCreating } = useCreateNotice()
  const { mutate: updateNotice, isPending: isUpdating } = useUpdateNotice()
  const { mutateAsync: uploadImage } = useUploadNoticeImage()
  const { data: groupsResponse, isLoading: isLoadingGroups } = useSearchGroups(debouncedSearchTerm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const groups = groupsResponse?.data || []

  const form = useForm({
    defaultValues: {
      titleKo: '',
      titleEn: '',
      titleJa: '',
      descriptionKo: '',
      descriptionEn: '',
      descriptionJa: '',
      scheduledDate: undefined as Date | undefined,
      targetType: 'all' as 'all' | 'group' | 'uid',
      selectedGroups: [] as UserGroup[],
      uidInput: '',
      imagePath: '',
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    validators: {
      onChange: messageSchema as any,
    },
    onSubmit: async ({ value }) => {
      if (value.targetType === 'group' && value.selectedGroups.length === 0) {
        alert('최소 1개 이상의 그룹을 선택해야 합니다.')
        return
      }
      const parsedUids = value.uidInput
        .split(/[,\n]+/)
        .map((s: string) => s.trim())
        .filter(Boolean)
      if (value.targetType === 'uid' && parsedUids.length === 0) {
        alert('UID를 최소 1개 이상 입력해야 합니다.')
        return
      }

      setIsSubmitting(true)
      try {
        let imagePath = value.imagePath
        if (imageFile) {
          const res = await uploadImage(imageFile)
          imagePath = res.url
        }

        const data: any = {
          titleKo: value.titleKo,
          titleEn: value.titleKo,
          titleJa: value.titleKo,
          descriptionKo: value.descriptionKo,
          descriptionEn: value.descriptionKo,
          descriptionJa: value.descriptionKo,
          imagePath,
          all: value.targetType === 'all',
          groups: value.targetType === 'group' ? value.selectedGroups.map(g => g.id) : [],
          sent: false,
          scheduledTimestamp: value.scheduledDate ? value.scheduledDate.getTime() : Date.now(),
        }
        if (value.targetType === 'uid') {
          data.recipientIds = parsedUids
        }

        if (notice && !isSent) {
          updateNotice({ id: notice.id, data }, {
            onSuccess: () => {
              alert('메시지가 수정되었습니다.')
              onOpenChange(false)
            }
          })
        } else {
          createNotice(data, {
            onSuccess: () => {
              alert(isSent ? '메시지가 새로 등록되었습니다.' : '메시지가 등록되었습니다.')
              onOpenChange(false)
            }
          })
        }
      } catch {
        alert('이미지 업로드에 실패했습니다.')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (open) {
      if (noticeId && notice) {
        const groups = (notice.groups || []).filter((g): g is UserGroup => typeof g !== 'string')
        const defaultDate = isSent ? new Date() : new Date(notice.scheduledTimestamp)
        if (isSent) defaultDate.setSeconds(0, 0)

        form.reset({
          titleKo: notice.titleKo,
          titleEn: notice.titleEn,
          titleJa: notice.titleJa,
          descriptionKo: notice.descriptionKo,
          descriptionEn: notice.descriptionEn,
          descriptionJa: notice.descriptionJa,
          imagePath: notice.imagePath || '',
          scheduledDate: defaultDate,
          targetType: notice.all ? 'all' : 'group',
          selectedGroups: groups,
          uidInput: '',
        })
        setImagePreview(notice.imagePath || '')
        setImageFile(null)
      } else if (!noticeId) {
        const now = new Date()
        now.setSeconds(0, 0)

        form.reset({
          titleKo: '',
          titleEn: '',
          titleJa: '',
          descriptionKo: '',
          descriptionEn: '',
          descriptionJa: '',
          imagePath: '',
          scheduledDate: now,
          targetType: 'all',
          selectedGroups: [],
          uidInput: '',
        })
        setImagePreview('')
        setImageFile(null)
      }
    }
  }, [open, noticeId, notice, form, isSent])

  const isPending = isCreating || isUpdating || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isLoadingNotice && noticeId ? '불러오는 중...' : (noticeId ? (isSent ? '메시지 재작성' : '메시지 수정') : '메시지 등록')}
          </DialogTitle>
        </DialogHeader>

        {isLoadingNotice && noticeId ? (
          <div className="py-10 text-center text-muted-foreground">
            데이터를 불러오고 있습니다...
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="grid gap-6 py-4"
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
                          rows={10}
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
                      <Label>이미지</Label>
                      <FormControl>
                        <ImageUploader
                          value={imagePreview}
                          onChange={(file) => {
                            setImageFile(file)
                            setImagePreview(URL.createObjectURL(file))
                          }}
                          onRemove={() => {
                            setImageFile(null)
                            setImagePreview('')
                            field.handleChange('')
                          }}
                          maxSizeInMB={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="scheduledDate"
                children={(field) => (
                  <FormField field={field}>
                    <FormItem className="flex flex-col">
                      <Label>발송 예약일</Label>
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

              <div className="space-y-2 flex flex-col justify-start">
                <Label>발송 대상</Label>
                <form.Field
                  name="targetType"
                  children={(field) => (
                    <FormField field={field}>
                      <FormItem>
                        <div className="space-y-2 border rounded-md p-3 bg-gray-50 mb-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="target-all"
                              checked={field.state.value === 'all'}
                              onCheckedChange={(checked) => checked && field.handleChange('all')}
                            />
                            <label htmlFor="target-all" className="text-sm font-medium leading-none cursor-pointer">
                              전체 사용자
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="target-group"
                              checked={field.state.value === 'group'}
                              onCheckedChange={(checked) => checked && field.handleChange('group')}
                            />
                            <label htmlFor="target-group" className="text-sm font-medium leading-none cursor-pointer">
                              그룹 선택
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="target-uid"
                              checked={field.state.value === 'uid'}
                              onCheckedChange={(checked) => checked && field.handleChange('uid')}
                            />
                            <label htmlFor="target-uid" className="text-sm font-medium leading-none cursor-pointer">
                              UID 직접 입력
                            </label>
                          </div>
                        </div>
                      </FormItem>
                    </FormField>
                  )}
                />
                
                <form.Subscribe
                  selector={(state) => state.values.targetType}
                  children={(targetType) => targetType === 'uid' && (
                    <form.Field
                      name="uidInput"
                      children={(field) => {
                        const parsedUids = (field.state.value || '')
                          .split(/[,\n]+/)
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                        return (
                          <div className="space-y-2">
                            <Textarea
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder={'UID를 쉼표 또는 줄바꿈으로 구분하여 입력\n예: 1001, 1002, 1003'}
                              rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                              입력된 UID: <span className="font-medium text-blue-600">{parsedUids.length}건</span>
                            </p>
                          </div>
                        )
                      }}
                    />
                  )}
                />

                <form.Subscribe
                  selector={(state) => state.values.targetType}
                  children={(targetType) => targetType === 'group' && (
                    <form.Field
                      name="selectedGroups"
                      children={(field) => {
                        const selectedGroups = field.state.value

                        const handleSelectGroup = (group: UserGroup) => {
                          const exists = selectedGroups.some((g) => g.id === group.id)
                          if (exists) {
                            field.handleChange(selectedGroups.filter((g) => g.id !== group.id))
                          } else {
                            field.handleChange([...selectedGroups, group])
                          }
                        }

                        const handleRemoveGroup = (groupId: string) => {
                          field.handleChange(selectedGroups.filter((g) => g.id !== groupId))
                        }

                        return (
                          <div className="flex flex-col gap-2">
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openCombobox}
                                  className="w-full justify-between h-auto min-h-[40px]"
                                >
                                  <div className="flex flex-wrap gap-1 text-left">
                                    {selectedGroups.length > 0 
                                      ? `${selectedGroups.length}개 그룹 선택됨` 
                                      : "그룹 검색 및 선택..."}
                                  </div>
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                  <CommandInput 
                                    placeholder="그룹 이름 검색..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                                  <CommandList>
                                    {isLoadingGroups ? (
                                      <div className="py-6 text-center text-sm text-muted-foreground">
                                        불러오는 중...
                                      </div>
                                    ) : !groups || groups.length === 0 ? (
                                      <CommandEmpty>결과가 없습니다.</CommandEmpty>
                                    ) : (
                                      <CommandGroup heading={searchTerm ? "검색 결과" : "전체 그룹 목록"}>
                                        {groups.map((group) => {
                                          const isSelected = selectedGroups.some((g) => g.id === group.id)
                                          return (
                                            <CommandItem
                                              key={group.id}
                                              onSelect={() => handleSelectGroup(group)}
                                              className={cn(isSelected && "bg-accent")}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <div className="flex flex-col">
                                                  <span className="font-medium">{group.title}</span>
                                                  <span className="text-xs text-muted-foreground">
                                                    회원 수: {group.count}명
                                                  </span>
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                                              </div>
                                            </CommandItem>
                                          )
                                        })}
                                      </CommandGroup>
                                    )}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>

                            <div className="flex flex-wrap gap-2 min-h-[30px]">
                              {selectedGroups.length === 0 && (
                                <span className="text-xs text-orange-500">
                                  * 최소 1개 이상의 그룹을 선택해야 합니다.
                                </span>
                              )}
                              {selectedGroups.map((group) => (
                                <Badge key={group.id} variant="secondary" className="flex items-center gap-1 pr-1 pl-2 py-1">
                                  <span className="max-w-[150px] truncate">{group.title}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => handleRemoveGroup(group.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )
                      }}
                    />
                  )}
                />
              </div>
            </div>
          
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit]) => (
                  <Button 
                    type="submit" 
                    disabled={!canSubmit || isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPending ? '처리 중...' : (noticeId ? (isSent ? '새로 등록' : '수정 저장') : '메시지 등록')}
                  </Button>
                )}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}