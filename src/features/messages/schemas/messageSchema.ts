import { z } from 'zod'

export const messageSchema = z.object({
  titleKo: z.string().min(1, '한국어 제목을 입력해주세요.'),
  titleEn: z.string(),
  titleJa: z.string(),
  descriptionKo: z.string().min(1, '한국어 내용을 입력해주세요.'),
  descriptionEn: z.string(),
  descriptionJa: z.string(),
  
  scheduledDate: z.date().optional(),
  
  targetType: z.enum(['all', 'group', 'user']),
  selectedGroups: z.array(z.object({
    id: z.string(),
    title: z.string(),
    count: z.number().optional()
  })).default([]),
  
  imagePath: z.string().optional(),
})

export type MessageFormValues = z.infer<typeof messageSchema>