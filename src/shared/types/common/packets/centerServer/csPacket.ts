// Center 서버가 "C"
// Center Server -> Game Server : C2G
// Game Server -> Center Server : G2C
import { IBlindTimer, IGameStats } from "../../common/interface";
import { ePlayerState } from "../../common/enums";

export interface C2G_Connect {}

export interface G2C_Connect {
  bindIp: string; // game server endPoint
}

export interface C2G_CreateTable {
  gameId: string;
  tableIdx?: number;
  profile?: number;
}

export interface G2C_CreateTable {
  gameId: string;
  tableIdx: number;
  userId: string;
  resultCode: number;
}

export interface C2G_UpdateGame {
  ownerId: string;
  gameId: string;
  tableIdx: number;
  config: any; // TODO: type 정의 game config
}

export interface G2C_UpdateGame {
  ownerId: string;
  gameId: string;
  updated: boolean;
}

export interface C2G_ObserveGame {
  userId: string;
  userNick: string;
  gameId: string;
  password: string;
  tableIdx: number;
  profile: number;
}

export interface G2C_ObserveGame {
  userId: string;
  gameId: string;
  tableIdx: number;
  resultCode: number;
}

export interface C2G_RegisterGame {
  uid: string;
  nick: string;
  gameId: string;
  tableIdx: number;
  seatNo: number;
  reBuyCount: number;
  profile: number;
  clanProfile: string;
}

export interface G2C_RegisterGame {
  gameId: string;
  tableIdx: number;
  uid: string;
  nick: string;
  resultCode: number;
  totalEntry: number;
  uniqueEntry: number;
  totalBuyinStack: number;
  reBuyCount: number;
  stack: number;
  profile: number;
  seatNo: number;
  tableState: string; // eTableState
  addActiveTable: boolean; // 0: 실패, 1: 성공
}

export interface C2G_UnRegisterGame {
  userId: string;
  gameId: string;
  tableIdx: number;
}

export interface G2C_UnRegisterGame {
  userId: string;
  userNick: string;
  gameId: string;
  tableIdx: number;
  resultCode: number;
}

export interface C2G_ReBuyRegister {
  userId: string;
  gameId: string;
  tableIdx: number;
  seatNo: number;
  reBuyCount: number;
}

export interface G2C_ReBuyRegister {
  userId: string;
  gameId: string;
  tableIdx: number;
  resultCode: number;
}

export interface C2G_StartTable {
  gameId: string;
  tableIdx: number;
  blind: IBlindTimer;
  startTime: number;
  enableStart: boolean;
}

export interface G2C_StartTable {
  gameId: string;
}

export interface C2G_EndTable {
  gameId: string;
  tableIdx: number;
  blind: IBlindTimer;
}

export interface G2C_EndTable {}

export interface C2G_StartHand {
  gameId: string;
  tableIdx: number;
  blind: IBlindTimer;
  isEnableNextHand: number;
  gameState: string;
}

export interface G2C_StartHand {}

export interface C2G_FinishHand {}

export interface G2C_FinishHand {
  gameId: string;
  tableId: number;
  players: {
    uid: string;
    nick: string;
    state: ePlayerState;
    stack: number;
    bountyBank: number;
    pkoBounty: number;
    pkoBountyBank: number;
    newKillLogs: string[];
  }[];
}

export interface C2G_UpdateEntry {
  gameId: string;
  tableIdx: number;
  totalEntry: number;
  uniqueEntry: number;
  totalBuyinStack: number;
}

export interface G2C_UpdateEntry {}

export interface C2G_UnSitMovePlayer {
  gameId: string;
  srcTableIdx: number;
  dstTableIdx: number;
  srcURL: string;
  dstURL: string;
}

export interface G2C_UnSitMovePlayer {
  gameId: string;
  srcTableIdx: number;
  dstTableIdx: number;
  movePlayer: {
    uid: string;
    nick: string;
    profile: number;
    stack: number;
    playTime: number;
    stat: IGameStats;
    startTime: number;
    behindStack: number;
    bountyBank: number;
    pkoBounty: number;
    pkoBountyBank: number;
    killLogs: string[];
  };
}

export interface C2G_SitMovePlayer {
  gameId: string;
  srcTableIdx: number;
  dstTableIdx: number;
  seatNo: number;
  playerData: {
    uid: string;
    nick: string;
    profile: number;
    clanProfile: string;
    stack: number;
    playTime: number;
    stat: IGameStats;
    startTime: number;
    isAway: boolean;
    timeBank: number;
    isTimebankActive: boolean;
    totalBuyInCount: number;
    behindStack: number;
    bountyBank: number;
    pkoBounty: number;
    pkoBountyBank: number;
    killLogs: string[];
  };
}

export interface G2C_SitMovePlayer {
  gameId: string;
  srcTableIdx: number;
  dstTableIdx: number;
  playerUid: string;
  isSuccess: boolean;
}

export interface C2G_CompleteMoved {
  gameId: string;
  tableIdx: number;
  userId: string;
}

export interface G2C_CompleteMoved {}

export interface C2G_TableSync {}

export interface G2C_TableSync {
  gameId: string;
  tableIdx: number;
  tableState: string;
  activePlayer: number;
}

export interface C2G_FinalTable {
  gameId: string;
  tableIdx: number;
}

export interface G2C_FinalTable {}

export interface C2G_CreateFinalTable {
  gameId: string;
  tableIdx: number;
}

export interface G2C_CreateFinalTable {
  gameId: string;
  tableIdx: number;
  userId: string;
  resultCode: number;
}

export interface C2G_TableShuffle {
  gameId: string;
  tableIdx: number;
}

export interface G2C_TableShuffle {
  gameId: string;
}

export interface C2G_TableWaitState {
  gameId: string;
  tableIdx: number;
  isEnableNextHand: number;
}

export interface G2C_TableWaitState {}

export interface C2G_SitOutPlayer {}

export interface G2C_SitOutPlayer {
  gameId: string;
  tableId: number;
  allInPlayers: string[];
  isKick: boolean;
  reason?: string[];
}

export interface C2G_NextPlayNow {
  clientId: string;
  nextGameId: string;
  serverUrl: string;
}

export interface G2C_NextPlayNow {
  clientId: string;
  userId: string;
  userNick: string;
}

export interface C2G_RewardPlayNow {
  clientId: string;
}

export interface G2C_RewardPlayNow {}

export interface C2G_CancelGame {
  gameId: string;
}

export interface G2C_CancelGame {}
