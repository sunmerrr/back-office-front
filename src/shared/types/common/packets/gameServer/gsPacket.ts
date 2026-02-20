// Center 서버가 "C"
// User(Client) -> Game Server : U2G
// Game Server -> User(Client) : S2U

//#region OutGame
import { eGSClientPacketCommand, eGSClientPacketType } from "./gsEnums";
import { eErrorCode } from "../../common/enums";
import { ILedgerFeeData, IUserLedger, IUserPreferenceModel } from "../../common/interface";

//#region 기존 Packet 구조
export interface IGSToClientPacket {
  from: {
    name: eGSClientPacketType;
    id: string;
  };
  cmd: eGSClientPacketCommand;
  data: any;
  status: eErrorCode;
  msg: string | null;
}

export class InfoPacket_S implements IGSToClientPacket {
  public readonly from: { name: eGSClientPacketType; id: string };
  public readonly cmd: eGSClientPacketCommand;
  public data: any;
  public status: eErrorCode;
  public msg: string | null;

  constructor(gameId: string, status: eErrorCode, data: any) {
    this.from = { name: eGSClientPacketType.Game, id: gameId };
    this.cmd = eGSClientPacketCommand.Info;

    this.status = status;
    this.data = { info: data };
    this.msg = null;
  }
}

//Enter
export class EnterPacket_S implements IGSToClientPacket {
  public readonly from: { name: eGSClientPacketType; id: string };
  public readonly cmd: eGSClientPacketCommand;
  public data: any;
  public status: eErrorCode;
  public msg: string | null;

  constructor(gameId: string, status: eErrorCode, data: any) {
    this.from = { name: eGSClientPacketType.Game, id: gameId };
    this.cmd = eGSClientPacketCommand.Enter;
    this.status = status;
    this.data = data;
    this.msg = null;
  }
}

export class JoinPacket_S implements IGSToClientPacket {
  public readonly from: { name: eGSClientPacketType; id: string };
  public readonly cmd: eGSClientPacketCommand;
  public data: any;
  public status: eErrorCode;
  public msg: string | null;

  constructor(gameId: string, status: eErrorCode, data: any) {
    this.from = { name: eGSClientPacketType.Game, id: gameId };
    this.cmd = eGSClientPacketCommand.Join;
    this.status = status;
    this.data = data;
    this.msg = null;
  }
}

export class HandPacket_S implements IGSToClientPacket {
  public readonly from: { name: eGSClientPacketType; id: string };
  public readonly cmd: eGSClientPacketCommand;
  public data: any;
  public status: eErrorCode;
  public msg: string | null;
  public tableIdx: number;

  constructor(gameId: string, tableIdx: number, status: eErrorCode, data: any) {
    this.from = { name: eGSClientPacketType.Table, id: gameId };
    this.cmd = eGSClientPacketCommand.Hand;
    this.data = { cards: data };
    this.status = status;
    this.tableIdx = tableIdx;
    this.msg = null;
  }
}

export class TablePacket_S implements IGSToClientPacket {
  public readonly from: { name: eGSClientPacketType; id: string };
  public readonly cmd: eGSClientPacketCommand;
  public data: any;
  public status: eErrorCode;
  public msg: string | null;
  public tableIdx: number;

  constructor(
    gameId: string,
    tableIdx: number,
    cmd: eGSClientPacketCommand,
    status: eErrorCode,
    data: any
  ) {
    this.from = { name: eGSClientPacketType.Table, id: gameId };
    this.cmd = cmd;
    this.data = data;
    this.status = status;
    this.tableIdx = tableIdx;
    this.msg = null;
  }
}

export class ErrorPacket_S implements IGSToClientPacket {
  public readonly from: { name: eGSClientPacketType; id: string };
  public readonly cmd: eGSClientPacketCommand;
  public data: any;
  public status: eErrorCode;
  public msg: string | null;

  constructor(name: eGSClientPacketType, gameId: string, status: eErrorCode, msg: string) {
    this.from = { name: name, id: gameId };
    this.cmd = eGSClientPacketCommand.Error;
    this.status = status;
    this.msg = msg;
  }
}
//#endregion 기존 Packet 구조

export interface U2G_Auth {
  token: string;
  gameId: string;
  isGuest: boolean;
  uid: string;
  userNick: string;
  profile: number;
}

export interface G2U_Auth {
  uid: string;
}

export interface U2G_SignIn {
  token: string;
}

export interface U2G_SignOut {
  guestUid: string;
}

export interface U2G_UpdatePreference {
  uid: string;
  preference: IUserPreferenceModel;
}

export interface G2U_UpdatePreference {}

export interface U2G_GetPreference {
  uid: string;
}

export interface G2U_GetPreference {
  uid: string;
  preference: IUserPreferenceModel;
}

export interface U2G_Ledger {
  gameId: string;
  tableIdx: number;
}

export interface G2U_Ledger {
  ledger: IUserLedger[];
  fees: ILedgerFeeData[];
}

export interface U2G_PING {}

export interface G2U_PING {
  serverTime: number;
}

export interface U2G_RequestChat {
  gameId: string;
  tableIdx: number;
}

export interface G2U_RequestChat {
  chatList: {
    gameId: string;
    tableIdx: number;
    sender: string; //nickname
    senderUid: string;
    message: string;
    timestamp: number;
  }[];
}

export interface U2G_Chat {
  gameId: string;
  tableIdx: number;
  uid: string;
  message: string;
}

export interface G2U_Chat {
  gameId: string;
  tableIdx: number;
  sender: string; //nickname
  senderUid: string;
  message: string;
  timestamp: number;
}

export interface U2G_Emoji {
  gameId: string;
  tableIdx: number;
  uid: string;
  emojiCategory: string;
  emojiIndex: number;
  timestamp: number;
}

export interface G2U_Emoji {
  gameId: string;
  tableIdx: number;
  seatIdx: number;
  emojiCategory: string;
  emojiIndex: number;
  timestamp: number;
}

export interface U2G_ActionEmoji {
  gameId: string;
  tableIdx: number;
  uid: string;
  targetSeatIdx: number;
  actionEmojiIndex: number;
  timestamp: number;
}

export interface G2U_ActionEmoji {
  gameId: string;
  tableIdx: number;
  seatIdx: number;
  targetSeatIdx: number;
  actionEmojiIndex: number;
  timestamp: number;
}

export interface U2G_GameLogs {
  gameId: string;
  tableIdx: number;
  uid: string;
}

export interface G2U_GameLogs {
  gameId: string;
  tableIdx: number;
  logs: any[];
}
//#endregion OutGame

//#region InGame
//#endregion InGame
