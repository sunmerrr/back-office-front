export type Category = 'satellite' | 'tournament' | 'phase';

export enum eTournamentState {
  None = 'None',
  Registering = 'Registering',
  LateReg = 'LateReg',
  Running = 'Running',
  Stop = 'Stop',
  End = 'End',
  Prepare = 'Prepare',
  Created = 'Created',
  Pending = 'Pending',
  Close = 'Close',
  Deleted = 'Deleted',
  Cancelled = 'Cancelled',
}

export type TargetMTT = {
  id: string; // TournamentId
  gameId: string; // GameId
  owner: string;
  title: string;
  tournamentState: eTournamentState;
};

export type CreateTicketData = {
  category: Category;
  title: string;
  value: string;
  amount?: number;
  sentAmount?: number;
  parentGameId?: string; // ParentGameId
  startTimestamp?: number;
  expiredTimestamp?: number;
  pendingAmount?: number;
  games?: string[]; // GameId[]
};

export type CreateTicketFormType = {
  games: TargetMTT[];
} & Omit<CreateTicketData, 'games'>;

export type UpdateTicketFormType = {
  category: string;
  title: string;
  value: string;
  games: TargetMTT[];
  startTimestamp?: Date;
  expiredTimestamp?: Date;
};

import type { UserGroup } from '@/features/users/types'

export interface Ticket extends CreateTicketData {
  id: string; // TicketId
  userId: string; // UserId
  createdAt?: string; // Added for list view
  updatedAt?: string; // Added for list view
}

export interface TicketHistory {
  id: string;
  owner: string;
  scheduledTimestamp: number;
  ticket: Ticket;
  sent: boolean;
  all: boolean;
  groups?: UserGroup[];
}

export interface TicketHistoryListParams {
  page?: number;
  limit?: number;
}

export interface TicketListParams {
  page?: number;
  limit?: number;
  category?: Category;
  title?: string;
}