import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { ChevronsUpDown, X, Check } from 'lucide-react'
import { type TicketGameSelection } from '../schemas/ticketSchema'
import { cn } from '@/shared/utils/cn'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useSearchTicketTournaments } from '@/features/tickets/hooks/useTickets'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/shared/components/ui/form'
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
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'

interface TicketGameSelectionFormProps {
  defaultValues?: Partial<TicketGameSelection>
  onSubmit: (data: TicketGameSelection) => void
  onBack: () => void
  isLoading?: boolean
}

export const TicketGameSelectionForm = ({
  defaultValues,
  onSubmit,
  onBack,
  isLoading,
}: TicketGameSelectionFormProps) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: tournamentsData, isLoading: isLoadingTournaments } = useSearchTicketTournaments(debouncedSearchTerm)

  const tournaments = tournamentsData?.items || []
  
  const form = useForm({
    defaultValues: {
      games: defaultValues?.games || [],
    },
    onSubmit: async ({ value }) => {
      onSubmit(value as TicketGameSelection)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.Field
        name="games"
        children={(field) => {
          const selectedGames = field.state.value || []

          const handleSelectGame = (game: typeof tournaments[0]) => {
            const exists = selectedGames.some((g) => g.id === game.id)

            if (exists) {
              field.handleChange(selectedGames.filter((g) => g.id !== game.id))
            } else {
              field.handleChange([...selectedGames, game])
              setOpen(false)
            }
          }

          const removeGame = (gameId: string) => {
            field.handleChange(selectedGames.filter((g) => g.id !== gameId))
          }

          return (
            <FormField field={field}>
              <FormItem className="flex flex-col">
                <FormLabel>토너먼트 선택</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedGames.length > 0
                          ? `${selectedGames.length}개 게임 선택됨`
                          : "게임을 선택하세요"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[400px] p-0 z-[100]" 
                    align="start" 
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <Command className="h-auto overflow-hidden">
                      <CommandInput
                        placeholder="토너먼트 이름 또는 ID 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <CommandList>
                        {isLoadingTournaments ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            불러오는 중...
                          </div>
                        ) : tournaments.length === 0 ? (
                          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        ) : (
                          <CommandGroup heading={searchTerm ? "검색 결과" : "전체 목록"}>
                            {tournaments.map((game) => {
                              const isSelected = selectedGames.some((g) => g.id === game.id)
                              return (
                                <CommandItem
                                  key={game.id}
                                  onSelect={() => handleSelectGame(game)}
                                  className={cn(isSelected && "bg-accent/50")}
                                >
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{game.title}</span>
                                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      ID: {game.gameId} | 상태: {game.tournamentState}
                                    </span>
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
                <FormDescription>
                  목록에서 토너먼트를 클릭하여 추가하세요.
                </FormDescription>
                <FormMessage />
              </FormItem>

              {/* Selected Games List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">선택된 게임 ({selectedGames.length})</h4>
                <div className="flex flex-wrap gap-2 min-h-[50px] p-4 border rounded-md bg-gray-50">
                  {selectedGames.length === 0 && (
                    <p className="text-sm text-muted-foreground w-full text-center py-8">
                      선택된 게임이 없습니다.
                    </p>
                  )}
                  {selectedGames.map((game) => (
                    <Badge key={game.id} variant="secondary" className="flex items-center gap-1 pr-1 pl-2 py-1">
                      <span className="max-w-[150px] truncate">{game.title}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeGame(game.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </FormField>
          )
        }}
      />

      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={onBack}>
          이전
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? '생성 중...' : '생성 완료'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}