import {
  eAnteMode,
  eChipValue,
  eGameLanguage,
  eTournamentType,
  eHandMode,
  ePlayerState,
  ePayoutType,
  eSquidLevel,
  eCardFront,
  eSevenDeuceLevel,
  eBettingRule,
  ePlayerActionIndex,
  eLedgerName,
  eBotPlayerType,
} from "./enums";

//#region Preference
export interface IUserPreferenceModel {
  bettingBB: number[];
  bettingRatio: number[];
  bgm: number;
  voiceVolume: number;
  effectVolume: number;
  cardEffectVolume: number;
  language: eGameLanguage;
  handMode: eHandMode;
  guideOn: boolean;
  chipValue: eChipValue;
  cardFront: eCardFront;
  ShowEmoji: boolean;
  CardHighlight: boolean;
  ActionNoti: boolean;
}
//#endregion Preference

//#region Ledger
export interface ILedgerData {
  name: eLedgerName;
  in: number;
  out: number;
  stack: number;
  timestamp: number;
}

export interface ILedgerFeeData {
  userId: string;
  userName: string;
  stats: IGameStats;
}

export interface IUserLedgerModel {
  userId: string;
  userName: string;
  gameId: string;
  ledgers: ILedgerData[];
}
//#endregion Ledger
export interface IGameLedgerModel {
  gameId: string;
  ledgers: IUserLedgerModel[];
}
//#endregion Ledger

//#region Blind
export interface IBlind {
  Index: number;
  Lv: number;
  Small: number;
  Big: number;
  PB: number;
  Ante: number;
  Time: number;
}
//#endregion Blind
export interface IBlindTimer {
  index: number;
  startTime: number;
  elapsedTime: number;
  paused: boolean;
  totalRunTime: number;
}
//#endregion BlindTimer
export interface IBlindSnapShot {
  index: number;
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  startTime: number;
  elapsedTime: number;
  nextBlindTime: number;
  nextSmallBlind: number;
  nextBigBlind: number;
  nextAnte: number;
  paused: boolean;
  totalRunTime: number;
}
//#endregion BlindSnapShot

//#region Card
export interface ICard {
  numId: number;
  shapeId: number;
}
//#endregion Card

//#region IPlayerInfo
export interface IPlayerInfo {
  uid: string;
  profile: number;
  clanProfile: string;
  countryCode: string;
  nick: string;
  state: ePlayerState;
  pkoBounty?: number;
  pkoBountyBank?: number;
  // pkoBountyLog?:
  killLogs?: string[];
  connected: boolean;
  botType: eBotPlayerType;
}
//#endregion IPlayerInfo

//#region SeatedInfo
export interface ISeatedInfo {
  uid: string;
  isGuest: boolean;
  stack: number;
  behindStack: number;
  playState: ePlayerState;
  waitingBlind: boolean;
  totalBet: number;
  betCount: number;
  callAmount: number;
  isAllIn: boolean;
  isFolded: boolean;
  playTime: number;
  stat: IGameStats;
  isTimebankActive: boolean;
  timebankAmount: number;
  bountyBank: number;
  pkoBounty: number;
  pkoBountyBank: number;
  squidChip: number;
  isNoLook: boolean;
  isNextHandNoLook: boolean;
  isStraddle: number;
  lastBettingActionIndex: ePlayerActionIndex;
  killLogs: string[];
}
//#endregion SeatedInfo

//#region Stats
export interface IGameStats {
  H: number;
  VPIP: number;
  PFR: number;
  CB: { t: number; c: number };
  _2B: { t: number; c: number };
  _3Ba: { t: number; c: number };
  _3B: { t: number; c: number };
  _4B: { t: number; c: number };
  FCB: { t: number; c: number };
  F2B: { t: number; c: number };
  F3Ba: { t: number; c: number };
  F3B: { t: number; c: number };
  WTSD: { t: number; c: number };
  ATS: { t: number; c: number };
  AF: { t: number; c: number };
  H2: number; // 프리플랍에서 콜/벳/레이즈한 핸드의 수 (체크한 빅블라인드 포함)
  WIN: number;
  TIE: number;
  LOSE: number;
  AllIn: number;
  PlayTime: number;
  BB100: number;
}
//#endregion Stats

export function ZeroStats() {
  return {
    H: 0,
    VPIP: 0,
    PFR: 0,
    CB: { t: 0, c: 0 },
    _2B: { t: 0, c: 0 },
    _3Ba: { t: 0, c: 0 },
    _3B: { t: 0, c: 0 },
    _4B: { t: 0, c: 0 },
    FCB: { t: 0, c: 0 },
    F2B: { t: 0, c: 0 },
    F3Ba: { t: 0, c: 0 },
    F3B: { t: 0, c: 0 },
    WTSD: { t: 0, c: 0 },
    ATS: { t: 0, c: 0 },
    AF: { t: 0, c: 0 },
    H2: 0, // 프리플랍에서 콜/벳/레이즈한 핸드의 수 (체크한 빅블라인드 포함)
    WIN: 0,
    TIE: 0,
    LOSE: 0,
    AllIn: 0,
    PlayTime: 0,
    BB100: 0,
  };
}
//#endregion Stats
//#region Prize
export interface IPayoutConfig {
  payoutType: ePayoutType;
  guaranteedPrize: number;
  prizeList: ICustomPrize[] | null;
}

export interface ICustomPrize {
  Index: number;
  Min: number;
  Max: number;
  Prize: number;
}

export interface IPrize {
  min: number;
  max: number;
  prize: number;
}
//#endregion Prize

//#region Rank
export interface IRank {
  uid: string;
  nick: string;
  profile: number;
  stack: number;
  tableIdx: number;
  totalBuyIn: number;
  clanProfile: string;
}

export interface IBountyRank {
  uid: string;
  nick: string;
  profile: number;
  bountyBank: number;
  tableIdx: number;
  totalBuyIn: number;
}

export interface IRankInfo {
  totalEntry: number;
  rankList: IRank[];
  qualifierRankList?: IRank[];
  bountyRankList?: IBountyRank[];
}
//#endregion RankInfo

//#region ResultPlayerInfo
export interface IResultPlayerInfo {
  totalEntry: number;
  resultList: IResultPlayer[];
}
//#endregion ResultPlayerInfo

//#region ResultPlayer
export interface IResultPlayer {
  uid: string;
  nick: string;
  profile: number;
  clanProfile: string;
  totalBuyIn: number;
  sitOutTime: number;
}
//#endregion ResultPlayer

//#region Restore data
export interface IRestorePlayerData {
  sid: string;
  uid: string;
  isGuest: boolean;
  profile: number;
  clanProfile: string;
  countryCode: string;
  nick: string;
  stack: number;
  playState: string;
  tableIdx: number;
  seatIdx: number;
  hand: ICard[];
  betCount: number;
  totalBet: number;
  callAmount: number;
  blind: number;
  isAllIn: boolean;
  isFolded: boolean;
  waitingBlind: boolean;
  handNum: number;
  awayBlindCount: number;
  startTime: number;
  playTime: number;
  connectTime: number;
  disconnectedTime: number;
  timebankAmount: number;
  isTimebankActive: boolean;
  squidChipCount: number;
  behindStack: number;
  killLogs: string[];
  newKillLogs: string[];
  bountyBank: number;
  pkoBounty: number;
  pkoBountyBank: number;
  // stats: IGameStats;
  // statsSnap: IGameStats;
}
//#endregion RestorePlayerData

//#region RestoreTableData
export interface IRestoreTableData {
  tableIdx: number;
  timer: {
    name: string;
    remain_time: number;
    term: number;
    info: any;
  };
  maxTablePlayer: number;
  activePlayers: string[];
  seats: { uid: string; value: { grade: any; name: any } }[];
  isShowdown: boolean;
  isBombPot: boolean;
  dealerIdx: number;
  sbIdx: number;
  bbIdx: number;
  turnIdx: number;
  lastRaise: number;
  lastRaiseAmount: number;
  minRaiseAllIn: boolean;
  minBet: number;
  maxTotalBet: number;
  roundBet: number[];
  prizePot: {
    totalAmount: number;
    ante: number;
    pots: { active: boolean; amount: number; stack: number }[];
    roundBet: number[];
  };
  deck: ICard[];
  board: ICard[][];
  tablestate: string;
  tablePlayers: IRestorePlayerData[];
  blindSnapshot: IBlindSnapShot;
  handNum: number;
  betInfo: any;
  spinRewardIndex: number;
  squidGameData: ISquidGameData;
  sitandgoGameData: ISitAndGoData;
}

// 실제로 데이터베이스에 저장되는 테이블 데이터
export interface ITableData extends IRestoreTableData {
  gameId: string;
  serverId: string;
}

//#endregion RestoreTableData

//#region GameConfigData
interface ISquidGameConfig {
  SquidLevel: eSquidLevel;
  SquidChipSet: number;
  SquidChipValue: number;
}

interface IBombPotGameConfig {
  BombPot: number; // the number of BB to collect from each player.
  BombPotProbability: number; // 0.2 means a 20% change.
}

interface IBaseGameConfig {
  GameTitle: string;
  Blind: IBlind[];
  BettingTime: number;
  IsTimebankEnabled: boolean;
  TimebankBeginningAmount: number;
  TimebankBonusInterval: number;
  TimebankBonusAmount: number;
  TimebankMaxAmount: number;
  ShowdownTime: number;

  // 게임 모드와 관계없이 해당 정보들은 여기에서 기본 값을 넣어두고, 토너먼트 모드에서 필수로 들고있어야함
  MaxPlayerCount: number;
  BettingRule: eBettingRule;
  MinBuyInAmount: number;
  MaxBuyInAmount: number;
  BuytheButton: boolean;
  AnteMode: eAnteMode;
  Password: string;
  Prize: IPayoutConfig;
  MinEntry?: number;

  //seven duce mode
  SevenDeuceLevel?: eSevenDeuceLevel;
  SevenDeuceChipValue?: number;

  // gameOption
  NoLook: boolean;
  Straddle: boolean;
  Bounty: boolean /* Mistery Bounty */;
  BountyPrizeCount: number /* Mistery Bounty */;
  RunItTwice: boolean;
}

// 최소한으로 default 값이라도 설정되어야하는 값들 (모든 게임 모드에서 필수)
export interface IBasicGameConfig extends IBaseGameConfig, IBombPotGameConfig {
  // 토너먼트 설정
  StartingChip: number;
  RegLimitIndex: number;
  TournamentStartTime: number;
}

interface ISevenDeuceGameConfig {
  SevenDeuceChipValue: number;
}

// 토너먼트 모드이면 필수인 값
interface ITournamentConfig {
  RebuyInCount: number;
  ReBuyInChipRatio: number;
  ReBuyInChips: number[];
  AddOnChip: number;
  StartingBB: number;
  TournamentType: eTournamentType;
  EnableSyncBreak: boolean;
  ExpectedTime: number;
  MinEntry?: number;
  ItmRank?: number;
  GuaranteeCount?: number;
  ManualStart?: boolean;
  IsPKOBounty: boolean;
  PKOBountyAmount: number /* 0 ~ 바이인 금액 미만 */;
  IsQualifier?: boolean;
  TargetStack?: number;
}

export interface IGameConfigData
  extends IBasicGameConfig,
    Partial<ITournamentConfig>,
    Partial<ISquidGameConfig>,
    Partial<ISevenDeuceGameConfig> {}
//#endregion restore data

//#region Game
export interface IGame {
  serverId: string;
  gameId: string;
  owner: string;
  state: string;
  gsId: string;
  gameMode: number;
  gameConfig: IGameConfigData;
  createTime: Date;
  startTime: Date;
  endTime: Date;

  //tournament
  regCount: number;
  reRegCount: number;
  addOnCount: number;
  regLimitTime: Date;
  rebuyInCount: number;
  tableCount: number;
  nextTableIdx: number;
  blindIdx: number;
  elapsedTime: number;
  paused: boolean;
  autoPaused: boolean;
  activePlayers: number;
  activeTables: number;
  isBubble: boolean;
  totalStack: number;
  isOffline: boolean;

  // fiveK
  keyCount: number;
}
//#endregion Game

export interface IPlayerRedisData {
  tableIdx: number;
  totalBuyInCount: number;
  profile: number;
  clanProfile: string;
}

//#region IGame Schema's props
export interface IPrizePot {
  totalAmount: number;
  ante: number;
  pots: {
    active: boolean;
    amount: number;
    stack: number;
  }[];
  roundBet: number[];
}
//#endregion IGame Schema's props

//#region ILedger Schema's props
export interface IUserLedger {
  userId: string;
  userName: string;
  gameId: string;
  ledgers: ILedgerData[]; //  ILedgerData of ObjectId[]
  createdAt: Date;
}

export interface IGameLedger {
  gameId: string;
  ledgers: IUserLedger[]; //  IUserLedger of ObjectId[]
  createdAt: Date;
}

export interface IUserPreference {
  userId: string;
  preference: string;
}

export interface IHandData {
  handNum: number;
  hand1NumId: number;
  hand1ShapeId: number;
  hand2NumId: number;
  hand2ShapeId: number;
}

export interface IUserHands {
  userId: string;
  userName: string;
  gameId: string;
  hands: IHandData[]; // IHandData of ObjectId[]
}

export interface IUserFavoritedHand {
  userId: string;
  gameId: string;
  tableIdx: number;
  hand: IHandData; // IHandData of ObjectId
  log: any; // game_log
}

export interface IUserStats {
  userId: string;
  userNick: string;
  gameId: string;
  stats: string; // json
  createdAt: Date;
  updatedAt: Date;
}

export interface IPresetData {
  title: string;
  presetData: string; // json (IPresetData from web-backend)
  prize: string; // json (SetPrizeDto from web-backend)
}

export interface IUserPreset {
  userId: string;
  gameMode: number;
  preset: IPresetData[];
}

export interface IUserRecentPreset {
  userId: string;
  gameMode: number;
  preset: IPresetData[];
  latest: number[];
}

export interface IUserGameResult {
  userId: string;
  userName: string;
  gameId: string;
  gameMode: number;
  buyInCount: number;
  rank: number;
  prize: number; // Tournament Prize
  profit: number; // Ring Game User Ledger Summary
  reward: number; // 5k key reward
  session: number; // Sit&Go Session
  bounty?: number;
  sitOutTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ePlayNowUserState {
  none = 0,
  sit = 1,
}

export interface IPlayNowUser {
  userId: string;
  userNick: string;
  step: number;
  state: number;
  gameId: string;
  gsId: string;
  lastGameId: string;
}

export interface ISquidGameData {
  isSquidGameOn: boolean;
  nextSessionSquidGameOn: boolean;
  remainSquidChip: number;
  sessionPlayers: string[];
  sessionStop: boolean;
  squidSession: number;
}

export interface ISitAndGoUserSessionResult {
  session: number;
  rank: number;
}

export interface ISitAndGoData {
  session: number;
  resultMap?: Record<string, ISitAndGoUserSessionResult[]>;
  sessionStop: boolean;
}

export interface IJwtPayLoad {
  sub: string;
  exp?: number;
  iat?: number;
  userId: string;
  gameId: string;
  expiredAt: number;
  nickName: string;
  password: string;
  isGuest: boolean;
  iconIndex: number;
  clanImage: string;
  [key: string]: any;
}

export interface PKOBountyLogData {
  userId: string;
  userName: string;
  gameId: string;
  bounty: number;
  profit: number;
  createdAt?: Date;
  timestamp: number;
}

export interface PKOBountyLog {
  userId: string;
  userName: string;
  gameId: string;
  buyInCount: number;
  initialBounty: number;
  logs: PKOBountyLogData[];
}
