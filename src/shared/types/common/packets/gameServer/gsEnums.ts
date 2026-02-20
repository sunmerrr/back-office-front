export enum eGSClientPacketType {
  Auth = "auth",
  User = "user",
  Game = "game",
  Table = "table",
}

export enum eGSClientPacketCommand {
  //Game
  GameStartReserve = "gamestartreserve",
  GameStartCancel = "gamestartcancel",
  GameStart = "gamestart",
  GameFinish = "gamefinish",
  GameCancel = "gameCancel",
  GameConfigUpdate = "gameConfigUpdate",
  Sit = "sit",
  SitOut = "sit_out",
  Join = "join",
  Reconnect = "reconnect",
  Register = "register",
  RebuyIn = "rebuyin",
  Req_Register = "req_register",
  Approve = "approve",
  ApproveNotice = "approvenotice",
  Ledger = "get_ledger",

  SignIn = "signin",
  SignOut = "signout",
  Auth = "auth",
  Enter = "enter",
  Info = "info",

  Leave = "leave",
  Shuffle = "shuffle",

  AddOn = "add_on",
  RemoveStack = "remove_stack",
  SetStack = "set_stack",
  MoveTo = "move_to",
  AwayMode = "away_mode",
  Comeback = "comeback",
  WaitBlind = "waitblind",

  TargetAddOn = "target_add_on",
  TargetRemoveStack = "target_remove_stack",
  TargetSetStack = "target_set_stack",
  TargetMoveTo = "target_move_to",
  TargetSitOut = "target_sit_out",
  TargetAwayMode = "target_away_mode",

  RequestSetStack = "req_set_stack",
  RequestAddOn = "req_add_on",
  RequestRemoveStack = "req_remove_stack",
  RequestMoveOn = "req_move_on",
  RequestSitOut = "req_sit_out",
  RequestSitOutNextSession = "req_sit_out_next_session",

  SetNickName = "set_nick",
  TransferOwner = "transfer_owner",

  Remove = "remove",
  Set_Host_Setting = "set_hostsetting",
  Get_Host_Setting = "get_hostsetting",
  ViewTable = "viewtable",
  ApplyPreset = "applypreset",

  GameStop = "stop",
  GamePause = "pause",
  GameUnPause = "unpause",
  Reqs = "reqs",
  Disconnect = "disconnect",

  TournamentInfo = "tournamentinfo",
  ChangeTable = "changetable",
  CompleteChangeTable = "completeChangeTable",

  PlayerResponse = "playerResponse",
  SystemMessage = "systemmessage",

  //SquidGame
  SquidSessionFinish = "squidSessionFinish",
  NextHandStart = "nextHandStart",
  NextSessionSquidGameOn = "nextsessionsquidgameon",

  //5K
  PlaySpin = "playspin",
  Unregister_5K = "unrgister_5k",

  //play now
  NextPlayNow = "nextPlayNow",
  CompleteNextPlayNow = "completeNext",
  StopPlayNow = "StopPlayNow",
  SitOutPlayNow = "SitOutPlayNow",

  //Table
  Start = "start",
  Betting = "betting",
  ReservedBetting = "reservedBetting",
  Dealing = "dealing",
  NewRound = "newround",
  NewBoard = "newboard",
  Round = "round",
  EndRound = "endround",
  Finish = "finish",
  ClearTable = "cleartable",
  Hand = "hand",
  AllInUser = "allinuser",
  ShowHand = "showhand",
  RabbitHunting = "rabbithunting",
  TableInfo = "tableinfo",
  SendChat = "sendChat",
  RequestChat = "reqChat",
  SendEmoji = "sendEmoji",
  ActionEmoji = "actionEmoji",
  UnsitMovePlayer = "unsitmoveplayer",
  SitMovePlayer = "sitmoveplayer",
  NextHandNoLook = "next_nolook",
  CurrentNoLook = "current_nolook",
  Straddle = "straddle",
  MultiStraddle = "multi_straddle",
  OfferMultiRun = "offer_multirun",
  DecideMultiRun = "decide_multirun",
  SevenDeuceWin = "sevenDeuceWin",
  EarnBounty = "earnBounty",

  //User
  GetPreference = "getPreference",
  UpdatePreference = "updatePreference",
  GetPlayerStat = "getPlayerStat",
  UpdatePlayerTimebank = "updatePlayerTimebank",
  UserMessage = "usermessage",

  //History
  GameLogs = "gamelogs",

  //Ping
  Ping = "ping",

  //Observe
  BroadcastConnect = "broadcastConnect",
  Observe = "observe",
  ObserveChange = "observeChange",
  ObserveList = "observeList",
  HotTableNotify = "hotTableNotify",
  ObserveAddTable = "observeAddTable",
  ObserveRemoveTable = "observeRemoveTable",
  GetActiveTable = "getActiveTable",
  GetObserveInfo = "getObserveInfo",
  GetHighlights = "getHighlights",

  //Error
  Error = "error",
}
