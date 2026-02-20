import { z } from 'zod'

// Enums
export const TicketCategoryEnum = z.enum(['satellite', 'tournament', 'phase'])

// Step 1: Basic Info Schema
export const ticketBasicInfoSchema = z.object({
  category: TicketCategoryEnum,
  title: z.string().min(1, '제목을 입력해주세요.'),
  value: z.string().min(1, '가치를 입력해주세요.'),
  startDate: z.date(),  
  endDate: z.date().optional(),   // expiredTimestamp용
  isNoExpiration: z.boolean().default(false), // 만료일 없음 체크용
})

// Step 2: Game Selection Schema (TargetMTT is handled as array of objects)
// We only need to validate that at least one game is selected if necessary, 
// or it can be optional depending on requirements.
// Let's assume selecting games is optional or required based on business logic. 
// I'll make it optional for now as per `CreateTicketData` types.
export const ticketGameSelectionSchema = z.object({
  games: z.array(z.object({
    id: z.string(),
    gameId: z.string(),
    owner: z.string(),
    title: z.string(),
    tournamentState: z.string(), // eTournamentState
  })).optional(),
})

// Combined Schema for final submission
export const createTicketSchema = ticketBasicInfoSchema.merge(ticketGameSelectionSchema)

export type TicketBasicInfo = z.infer<typeof ticketBasicInfoSchema>
export type TicketGameSelection = z.infer<typeof ticketGameSelectionSchema>
export type CreateTicketFormValues = z.infer<typeof createTicketSchema>
