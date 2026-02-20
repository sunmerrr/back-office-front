import { IPacket } from "../common";
import { eServerPacketCommand } from "./csEnums";
import * as packet from "./csPacket";

export type CenterServerPayloadMap = {
  [eServerPacketCommand.Connect]: packet.C2G_Connect | packet.G2C_Connect;

  // out game
  [eServerPacketCommand.UpdateGame]: packet.C2G_UpdateGame | packet.G2C_UpdateGame;
  [eServerPacketCommand.ObserveGame]: packet.C2G_ObserveGame | packet.G2C_ObserveGame;
  [eServerPacketCommand.RegisterGame]: packet.C2G_RegisterGame | packet.G2C_RegisterGame;
  [eServerPacketCommand.UnRegisterGame]: packet.C2G_UnRegisterGame | packet.G2C_UnRegisterGame;
  [eServerPacketCommand.ReBuyRegister]: packet.C2G_ReBuyRegister | packet.G2C_ReBuyRegister;
  [eServerPacketCommand.CreateTable]: packet.C2G_CreateTable | packet.G2C_CreateTable;
  [eServerPacketCommand.NextPlayNow]: packet.C2G_NextPlayNow | packet.G2C_NextPlayNow;
  [eServerPacketCommand.RewardPlayNow]: packet.C2G_RewardPlayNow | packet.G2C_RewardPlayNow;

  // in game by mtt
  [eServerPacketCommand.StartTable]: packet.C2G_StartTable | packet.G2C_StartTable;
  [eServerPacketCommand.EndTable]: packet.C2G_EndTable | packet.G2C_EndTable;
  [eServerPacketCommand.StartHand]: packet.C2G_StartHand | packet.G2C_StartHand;
  [eServerPacketCommand.FinishHand]: packet.C2G_FinishHand | packet.G2C_FinishHand;
  [eServerPacketCommand.UnSitMovePlayer]:
    | packet.C2G_UnSitMovePlayer
    | packet.G2C_UnSitMovePlayer;
  [eServerPacketCommand.SitMovePlayer]: packet.C2G_SitMovePlayer | packet.G2C_SitMovePlayer;
  [eServerPacketCommand.CompleteMoved]: packet.C2G_CompleteMoved | packet.G2C_CompleteMoved;
  [eServerPacketCommand.TableShuffle]: packet.C2G_TableShuffle | packet.G2C_TableShuffle;
  [eServerPacketCommand.TableWaitState]: packet.C2G_TableWaitState | packet.G2C_TableWaitState;
  [eServerPacketCommand.SitOutPlayer]: packet.C2G_SitOutPlayer | packet.G2C_SitOutPlayer;
  [eServerPacketCommand.TableSync]: packet.C2G_TableSync | packet.G2C_TableSync;
  [eServerPacketCommand.FinalTable]: packet.C2G_FinalTable | packet.G2C_FinalTable;
  [eServerPacketCommand.CreateFinalTable]:
    | packet.C2G_CreateFinalTable
    | packet.G2C_CreateFinalTable;
};

type CenterServerPacketType<T extends eServerPacketCommand> =
  T extends keyof CenterServerPayloadMap ? IPacket<T, CenterServerPayloadMap[T]> : never;

export type CenterServerPacket = CenterServerPacketType<eServerPacketCommand>;
