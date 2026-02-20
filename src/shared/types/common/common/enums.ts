export enum eErrorCode {
  NoError = 0,
  SocketClose = -1,
  SocketError = -2,
  DbConnectionError = -3,
  DbTransactionError = -4,
  DbUnknownError = -5,

  NewAccount = 1,
  InvalidUid = -98,
  InvalidGameId = -99,
  SessionError = -100,
  SessionDuplication = -101,
  AuthenticationError = -102,
  NotExistAccount = -103,
  LoginTypeError = -104,
  ServerBusy = -200,
  NotFoundGameServer = -201,

  // DB ErrorCode 1000~4999
  DbErrorGameLedger = 1000,
  DbErrorUserHand = 1001,
  DBErrorUserPreference = 1002,
  DBErrorUserStats = 1003,
  DBErrorUserPreset = 1004,
  DBErrorGameData = 1005,
  DBErrorUserResult = 1006,
  DbErrorUserPkoBountyLog = 1007,
  DBConnectionError = 2000,
  DBDuplicateKey = 4000,
  DBUnknown = 4999,

  RequestExists = -5100,
  CreateGameError = -5200,
  UpdateGameError = -5201,
  CancelGameError = -5202,

  InvalidToken = -9991,
  RegisterError = -9992,
  NoGame = -9993,
  InvalidGameState = -9994,
  InvalidGameMode = -9995,
  InvalidRequest = -9996,
  InvalidParams = -9997,
  NotOwner = -9998,
  NoPlayer = -9999,
  InvalidPassword = -10000,
  NeedPassword = -10001,
  AlreadyJoined = -10010,
  InvalidNick = -10020,
  DuplicateNick = -10021,
  EmptyNick = -10022,
  AdminOnly = -10030,
  AlreadyRegistered = -10048,
  FullSeatError = -10049,
  SeatIndexError = -10050,
  AlreadySitting = -10051,
  CannotSitOnTheButton = -10052,
  StackError = -10053,
  AlreadyRequestedSeat = -10054,
  OwnerCannotLeave = -10055,
  NotActivePlayer = -10056,
  CannotPutOnAway = -10057,
  CannotComeback = -10058,
  IsNotWaitState = -10059,
  IsNotSeatOutState = -10060,
  AlreadyRequested = -10061,
  InvalidTable = -10062,
  IsNotPlayState = -10063,
  RebuyInCount = -10064,
  CannotSitOut = -10065,
  AlreadyEndedRegister = -10066,
  CannotMoveToSeat = -10067,
  CannotAddOn = -10068,
  CannotSetStack = -10069,
  CannotTransferOwner = -10070,
  InvalidPlayerState = -10071,
  CannotStartGame = -11000,
  NotEnoughSeats = -11001,
  AlreadyStartedGame = -11002,
  AlreadyEndedGame = -11003,
  NotMyTurn = -12001,
  IsPaused = -12002,
  BettingTypeError = -13001,
  OverBetLimit = -13002,
  InvalidRaise = -13003,
  GameStartRserveRequest = -13004,
  InvalidGameConfig = -13005,
  AlreadyAddon = -13006,
  NotEnoughPlayers = -13007,
}

export const enum eGameLanguage {
  EN = "en",
  JP = "jp",
  KR = "kr",
}

export enum eBettingRule {
  NoLimit = "no-limit",
  AOF = "aof",
}

export enum eGameMode {
  SitAndGo,
  Tournament,
  Ring,
  AOF,
  SpinAndGo,
  SquidGame,
  SevenDeuce,
  PlayNow,
}

export const enum ePlayerState {
  Entering = "entering",
  Observing = "observing",
  Reserved = "reserved",
  Waiting = "waiting",
  Playing = "playing",
  Eliminated = "eliminated",
  Away = "away",
  Leave = "leave",
  ReservedWaiting = "reservedWaiting",
}

export const enum eAnteMode {
  NONE = "NONE",
  BB = "BB",
  ALL = "ALL",
}

export const enum eGameState {
  Created = "created",
  Prepare = "prepare",
  Ready = "ready", // 제거 예정
  Playing = "playing",
  Stop = "stop",
  End = "end",
  Cancel = "cancel",
}

export const enum eTableState {
  NotStarted = "notstarted",
  Waiting = "waiting",
  Playing = "playing",

  WaitingHand = "handforHand",
  WaitingBreak = "breakTime",
}

export const enum eWaitingState {
  EnableNextHand = 0,
  NotStarted = 1,
  BreakTime = 2,
  Bubble = 3,
  TournamentEnd = 4,
  EndBubble = 5,
  Paused = 6,
}

export const enum eHandMode {
  SQUEEZE = "squeeze",
  HIDE = "hide",
  NONE = "none",
}

export const enum eChipValue {
  CHIP = "chip",
  BB = "bb",
}

export enum eTournamentType {
  CUSTOM = "Customized",
  SLOW = "Slow",
  NORMAL = "Normal",
  FAST = "Fast",
  SUPER_FAST = "Super Fast",
}

export const enum eTimerName {
  GameStart = "gameStart",
  Betting = "betting",
  BettingDelay = "bettingdelay",
  AllinUser = "allInUsers",
  EndRound = "endRound",
  Restart = "restart",
  ShowDown = "showdown",
  Dealing = "dealing",
  NewRound = "newRound",
  BreakTime = "breakTime",
  PlaySpin = "playspin",
  WaitPlayer = "waitPlayer",
  SquidSessionFinish = "squidSeesionFinish",
}

export const enum ePlayerAction {
  Fold = "fold",
  Check = "check",
  Call = "call",
  Raise = "raise",
  None = "none",
}

export enum ePlayerActionIndex {
  None = -1,
  Fold,
  Check,
  Call,
  Raise,
  Bet,
  Allin,
  NoLook,
  Straddle,
  Look,
}

export const enum ePlayerReservedAction {
  None = "none",
  CheckOrFold = "cof",
  Check = "check",
  Call = "call",
  Fold = "fold",
}

export const enum ePayoutType {
  NONE = "None",
  PERCENT_10 = "percent10",
  PERCENT_12 = "percent12",
  PERCENT_15 = "percent15",
  PERCENT_20 = "percent20",
  CUSTOM = "Custom",
}

export const enum eRoundName {
  PreFlop = "pre-flop",
  Flop = "flop",
  Turn = "turn",
  River = "river",
}

export const enum eSquidLevel {
  BASIC = "Normal",
  PLUS = "Hard",
  HELL = "Hell",
}

export const enum eSevenDeuceLevel {
  BASIC = "Basic",
  EASY = "Easy",
  NORMAL = "Normal",
  HARD = "Hard",
  HELL = "Hell",
}

export const enum eLedgerName {
  NICKNAME = "NICKNAME",
  BUYIN = "BUY-IN",
  ADDON = "ADD-ON",
  WASH = "WASH",
  SITOUT = "SIT-OUT",
  SUSPEND = "SUSPEND",
  SEVENDEUCE = "SevenDeuce",
  SQUID = "Squid",
  IN = "IN",
  OUT = "OUT",
}

export const enum eCardFront {
  CARD_01 = "01",
  CARD_02 = "02",
  CARD_03 = "03",
  CARD_04 = "04",
}

export const enum ePosition {
  BB = "BB",
  SB = "SB",
  BTN = "BTN",
  CO = "CO",
  HJ = "HJ",
  LJ = "LJ",
  UTG2 = "UTG+2",
  UTG1 = "UTG+1",
  UTG = "UTG",
  NONE = "None",
}

export const enum eBotPlayerType {
  NONE = "none",
  GRAND = "grand",
  GTO = "gto",
  PRAY = "pray",
}

export const enum eNoticeType {
  PLAYNOW_REWARD = "pReward",
  PLAYNOW_HIGHEST = "pHighest",
}

export const enum eCheckGameConfig {
  NO_ERROR = 0,
  ERROR_SB_RANGE = 1 << 0,
  ERROR_BB_RANGE = 1 << 1,
  ERROR_INVALID_BLIND = 1 << 2,
  ERROR_MINBUYIN_RANGE = 1 << 3,
  ERROR_MAXBUYIN_RANGE = 1 << 4,
  ERROR_INVALID_BUYIN = 1 << 5,
  ERROR_BETTINGTIME_RANGE = 1 << 6,
  ERROR_TITLE_RANGE = 1 << 7,
}

export const enum eHighlightType {
  None = 0,

  /** 올인 후 쇼다운이 진행된 경우 */
  AllIn = 1 << 0, // 올인

  /** 해당 시점 토너먼트의 평균 스택 이상 팟일 경우 */
  BigPot = 1 << 1,

  /**
   * 1. 리버 단계에 두 명의 플레이어만 남아 있는 상황
   * 2. 플레이어 A가 세컨 페어 이하의 핸드로 팟의 75% 이상 사이즈 베팅
   * 3. 플레이어 B가 A를 이기는 핸드일 경우 */
  Bluff = 1 << 2,

  /** 등록 마감 후 남은 인원이 20명 이하일 때 탈락 발생 시 */
  Elimination = 1 << 3,

  /**
   * 1. 리버 이전에 쇼다운 발생
   * 2. 백도어로 패배하거나, 아웃츠 4 이하에서 패배한 경우 */
  Badbeat = 1 << 4,

  /** 프리플랍 올인 상황에서 파켓 vs 투오버 조합일 경우 */
  CoinFlip = 1 << 5,

  /** 리버 단계에서 올인한 경우 (결과와 무관) */
  RiverAllIn = 1 << 6,
}
