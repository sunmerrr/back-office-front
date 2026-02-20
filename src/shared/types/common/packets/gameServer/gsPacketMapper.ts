import * as packet from "./gsPacket";
import { IPacket } from "../common";
import { eGSClientPacketCommand } from "./gsEnums";

export type GamePacketPayloadMap = {
  [eGSClientPacketCommand.Auth]: packet.U2G_Auth | packet.G2U_Auth;
  [eGSClientPacketCommand.UpdatePreference]:
    | packet.U2G_UpdatePreference
    | packet.G2U_UpdatePreference;
  [eGSClientPacketCommand.GetPreference]: packet.U2G_GetPreference | packet.G2U_GetPreference;
  [eGSClientPacketCommand.Ledger]: packet.U2G_Ledger | packet.G2U_Ledger;
  [eGSClientPacketCommand.Ping]: packet.U2G_PING | packet.G2U_PING;
  [eGSClientPacketCommand.RequestChat]: packet.U2G_RequestChat | packet.G2U_RequestChat;
  [eGSClientPacketCommand.SendChat]: packet.U2G_Chat | packet.G2U_Chat;
  [eGSClientPacketCommand.SendEmoji]: packet.U2G_Emoji | packet.G2U_Emoji;
  [eGSClientPacketCommand.ActionEmoji]: packet.U2G_ActionEmoji | packet.G2U_ActionEmoji;
  [eGSClientPacketCommand.GameLogs]: packet.U2G_GameLogs | packet.G2U_GameLogs;
};

type PacketType<T extends eGSClientPacketCommand> = T extends keyof GamePacketPayloadMap
  ? IPacket<T, GamePacketPayloadMap[T]>
  : never;

export type GameServerPacket = PacketType<eGSClientPacketCommand>;
