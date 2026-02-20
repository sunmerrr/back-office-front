import { GAME_SETTING_VALUE } from "./constants";
import {
  eAnteMode,
  eBettingRule,
  eCheckGameConfig,
  eGameMode,
  eHighlightType,
  ePayoutType,
  ePosition,
} from "./enums";
import { IBasicGameConfig, IGameConfigData } from "./interface";
import "./prototypes";

interface Result<T> {
  success: boolean;
  data?: T | null;
  error?: string;
}

export function checkGameConfig(
  config: IGameConfigData,
  isDebugMode: boolean = false,
  gameType: eGameMode
): Result<IGameConfigData> {
  let result: IGameConfigData | null = config;
  const processPipeline: Result<IGameConfigData>[] = [];

  if (config == null) {
    // TODO: config is null -> default config 셋팅 필요.
    config = {
      GameTitle: "default",
      Password: "",
      BettingRule: eBettingRule.NoLimit,
      MaxPlayerCount: 9,
      BettingTime: isDebugMode == true ? 5000 : 30000, // FIXME: action time default 12 sec
      ShowdownTime: 6000,
      IsTimebankEnabled: false,
      TimebankBeginningAmount: 30000, // 30 sec
      TimebankBonusInterval: 30, // 30 hands
      TimebankBonusAmount: 20000, // 20 sec
      TimebankMaxAmount: 60000, // 60 sec
      Blind: [
        { Index: 0, Lv: 1, Small: 50, Big: 100, Time: 360, PB: 0, Ante: 0 },
        { Index: 1, Lv: 2, Small: 70, Big: 140, Time: 360, PB: 0, Ante: 0 },
        { Index: 2, Lv: 3, Small: 100, Big: 200, Time: 360, PB: 0, Ante: 0 },
        { Index: 3, Lv: 4, Small: 150, Big: 300, Time: 360, PB: 0, Ante: 0 },
        { Index: 4, Lv: 5, Small: 200, Big: 400, Time: 360, PB: 0, Ante: 0 },
        { Index: 5, Lv: 6, Small: 250, Big: 500, Time: 360, PB: 0, Ante: 0 },
        { Index: 6, Lv: 7, Small: 300, Big: 600, Time: 360, PB: 0, Ante: 0 },
        { Index: 7, Lv: 8, Small: 350, Big: 700, Time: 360, PB: 0, Ante: 0 },
        { Index: 8, Lv: 9, Small: 400, Big: 800, Time: 360, PB: 0, Ante: 0 },
        { Index: 9, Lv: 10, Small: 450, Big: 900, Time: 360, PB: 0, Ante: 0 },
        { Index: 10, Lv: 11, Small: 500, Big: 1000, Time: 360, PB: 0, Ante: 0 },
        { Index: 11, Lv: 12, Small: 600, Big: 1200, Time: 360, PB: 0, Ante: 0 },
        { Index: 12, Lv: 13, Small: 700, Big: 1400, Time: 360, PB: 0, Ante: 0 },
        { Index: 13, Lv: 14, Small: 800, Big: 1600, Time: 360, PB: 0, Ante: 0 },
        { Index: 14, Lv: 15, Small: 900, Big: 1800, Time: 360, PB: 0, Ante: 0 },
        {
          Index: 15,
          Lv: 16,
          Small: 1000,
          Big: 2000,
          Time: 360,
          PB: 0,
          Ante: 0,
        },
        {
          Index: 16,
          Lv: 17,
          Small: 1250,
          Big: 2500,
          Time: 360,
          PB: 0,
          Ante: 0,
        },
        {
          Index: 17,
          Lv: 18,
          Small: 1500,
          Big: 3000,
          Time: 360,
          PB: 0,
          Ante: 0,
        },
        {
          Index: 18,
          Lv: 19,
          Small: 1750,
          Big: 3500,
          Time: 360,
          PB: 0,
          Ante: 0,
        },
        {
          Index: 19,
          Lv: 20,
          Small: 2000,
          Big: 4000,
          Time: 360,
          PB: 0,
          Ante: 0,
        },
      ],
      AnteMode: eAnteMode.BB,
      MinBuyInAmount: 1000,
      MaxBuyInAmount: 1000000,
      BuytheButton: false,
      Prize: {
        guaranteedPrize: 0,
        payoutType: ePayoutType.NONE,
        prizeList: [],
      },
      NoLook: false,
      Straddle: false,
      Bounty: false,
      BountyPrizeCount: 0,
      RunItTwice: true,
      RegLimitIndex: -1,
      StartingChip: 10000,
      TournamentStartTime: 0,
      BombPot: 0,
      BombPotProbability: 0,
    } satisfies IBasicGameConfig; // TODO: 점진적으로 마이그레이션 예정

    processPipeline.push({ success: false, error: "config is null" });
    result = Object.assign({}, config);
  }
  //TODO 비속어 체크

  if (!config.GameTitle || config.GameTitle.length <= 0) {
    processPipeline.push({
      success: false,
      error: `Game title is empty. GameTitle: '${config.GameTitle}', condition: at least 1 character`,
    });
    result = null;
  }

  if (config.BettingTime <= 0) {
    processPipeline.push({
      success: false,
      error: `Betting time is invalid. BettingTime: '${config.BettingTime}' is must be greater than 0`,
    });
    result = null;
  }
  if (config.MaxPlayerCount < 2 || config.MaxPlayerCount > 9) {
    processPipeline.push({
      success: false,
      error: `Invalid player count. MaxPlayerCount: '${config.MaxPlayerCount}' is must be between 2 and 9`,
    });
    result = null;
  }
  if (config.MinBuyInAmount > config.MaxBuyInAmount) {
    processPipeline.push({
      success: false,
      error: `Minimum buy-in amount '${config.MinBuyInAmount}' is should be less than maximum buy-in amount '${config.MaxBuyInAmount}'`,
    });
    result = null;
  }

  if (
    gameType === eGameMode.Tournament &&
    config.RegLimitIndex &&
    config.RegLimitIndex >= config.Blind.length
  ) {
    processPipeline.push({
      success: false,
      error: `Blind Index '${config.RegLimitIndex}' is greater than Blind Structure Array length '${config.Blind.length}'`,
    });
    result = null;
  }

  for (let i = 0; i < config.Blind.length; i++) {
    const blind = config.Blind[i];

    if (blind.Lv > 0 && blind.Small <= 0) {
      processPipeline.push({
        success: false,
        error: `Blind Structure ${blind.Lv} level has SB value '${blind.Small}' which must be greater than 0`,
      });
      result = null;
    }
    if (blind.Lv > 0 && blind.Big <= 0) {
      processPipeline.push({
        success: false,
        error: `Blind Structure ${blind.Lv} level has BB value '${blind.Big}' which must be greater than 0`,
      });
      result = null;
    }
    if (blind.Small > blind.Big) {
      processPipeline.push({
        success: false,
        error: `Blind Structure ${blind.Lv} level has SB value '${blind.Small}' which is greater than BB value '${blind.Big}'`,
      });
      result = null;
    }
  }

  if (config.ShowdownTime <= 0) {
    processPipeline.push({
      success: false,
      error: `Showdown time is invalid. ShowdownTime: '${config.ShowdownTime}' is must be greater than 0`,
      // if debug mode, timebank option should be enabled to set ShowdownTime (local test)
    });
    result = null;
  }

  if (gameType === eGameMode.Tournament) {
    if (
      config.RebuyInCount &&
      config.ReBuyInChipRatio &&
      config.RebuyInCount > 0 &&
      config.ReBuyInChipRatio <= 0
    ) {
      processPipeline.push({
        success: false,
        error: `RebuyInCount is set to ${config.RebuyInCount} but Rebuy chip ratio (ReBuyInChipRatio) is ${config.ReBuyInChipRatio} which is less than 0`,
      });
      result = null;
    }

    if (!config.TournamentStartTime) {
      processPipeline.push({
        success: false,
        error: "Tournament start time is not set",
      });
      result = null;
    } else if (config.EnableSyncBreak) {
      const startTime = new Date(config.TournamentStartTime).getMinutes();
      const limitMinuteRange = { from: 50, to: 59 };

      const isWithinLimitRange =
        startTime >= limitMinuteRange.from && startTime <= limitMinuteRange.to;
      if (isWithinLimitRange) {
        processPipeline.push({
          success: false,
          error: `SyncBreaks is enabled. MTT game creation is restricted during ${
            limitMinuteRange.from
          }~${limitMinuteRange.to} minutes. TournamentStartTime: ${new Date(
            config.TournamentStartTime
          )} is not allowed.`,
        });
        result = null;
      }
    }
  }

  return {
    success: processPipeline.length === 0,
    data: result,
    error:
      `config check fail, mode: ${getGameModeName(gameType)}, title: ${
        config.GameTitle
      } can not be created because of ` + processPipeline.map((p) => p.error).join(" & "),
  };
}

// TODO sky: 나중에 checkGameConfig랑 잘 머지해야할듯
export function checkRingGameConfig(config: IGameConfigData): eCheckGameConfig {
  // 유효성 체크 우선은 링게임만 온다는 가정
  let errorFlags = eCheckGameConfig.NO_ERROR;
  const titleBytes = config.GameTitle.getBytes();
  if (titleBytes < 4 || titleBytes > 60) {
    errorFlags |= eCheckGameConfig.ERROR_TITLE_RANGE;
  }
  //Blind
  for (const blind of config.Blind) {
    // 0 ~ 100,000
    if (
      isNaN(blind.Small) ||
      blind.Small < GAME_SETTING_VALUE.minBlind ||
      blind.Small > GAME_SETTING_VALUE.maxBlind
    ) {
      errorFlags |= eCheckGameConfig.ERROR_SB_RANGE;
    }
    // 0 ~ 100,000
    if (
      isNaN(blind.Big) ||
      blind.Big < GAME_SETTING_VALUE.minBlind ||
      blind.Big > GAME_SETTING_VALUE.maxBlind
    ) {
      errorFlags |= eCheckGameConfig.ERROR_BB_RANGE;
    }
    // SB <= BB
    if (blind.Small > blind.Big) {
      errorFlags |= eCheckGameConfig.ERROR_INVALID_BLIND;
    }

    if (
      errorFlags & eCheckGameConfig.ERROR_SB_RANGE &&
      errorFlags & eCheckGameConfig.ERROR_BB_RANGE &&
      errorFlags & eCheckGameConfig.ERROR_INVALID_BLIND
    ) {
      break;
    }
  }

  //BuyIn
  // minBuyIn
  if (
    isNaN(config.MinBuyInAmount) ||
    config.MinBuyInAmount < GAME_SETTING_VALUE.minBuyIn ||
    config.MinBuyInAmount > GAME_SETTING_VALUE.maxBuyIn
  ) {
    errorFlags |= eCheckGameConfig.ERROR_MINBUYIN_RANGE;
  }
  // maxBuyIn
  if (
    isNaN(config.MaxBuyInAmount) ||
    config.MaxBuyInAmount < GAME_SETTING_VALUE.minBuyIn ||
    config.MaxBuyInAmount > GAME_SETTING_VALUE.maxBuyIn
  ) {
    errorFlags |= eCheckGameConfig.ERROR_MAXBUYIN_RANGE;
  }

  if (config.MinBuyInAmount > config.MaxBuyInAmount) {
    errorFlags |= eCheckGameConfig.ERROR_INVALID_BUYIN;
  }

  //ActionTime
  // 1~999
  if (
    isNaN(config.BettingTime) ||
    config.BettingTime < GAME_SETTING_VALUE.minActionTime ||
    config.BettingTime > GAME_SETTING_VALUE.maxActionTime
  ) {
    errorFlags |= eCheckGameConfig.ERROR_BETTINGTIME_RANGE;
  }

  return errorFlags;
}

export function delayedRecursive(task, delayMS) {
  return new Promise((resolve) => setTimeout(() => resolve(task), delayMS));
}

export const setTimeoutPromise = (timeout: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

export const sevenDeuceMission: number[][] = [
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  // [2, 7], 디폴트로 항상 셋팅 됨. -> 첫 번째 보상 핸드는 반드시 7-2를 포함합니다.
  [2, 8],
  [2, 9],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [4, 5],
  [4, 6],
  [4, 7],
  [4, 8],
  [4, 9],
  [5, 6],
  [5, 7],
];

const positionList = [
  ePosition.BB,
  ePosition.SB,
  ePosition.BTN,
  ePosition.CO,
  ePosition.HJ,
  ePosition.LJ,
  ePosition.UTG2,
  ePosition.UTG1,
  ePosition.UTG,
];

export function getPosition(posIdx: number) {
  if (positionList.length <= posIdx) {
    return ePosition.NONE;
  } else {
    return positionList[posIdx];
  }
}

export function getGameModeName(mode: eGameMode) {
  switch (mode) {
    case eGameMode.SitAndGo:
      return "SitAndGo";
    case eGameMode.Tournament:
      return "Tournament";
    case eGameMode.Ring:
      return "Ring";
    case eGameMode.AOF:
      return "AOF";
    case eGameMode.SquidGame:
      return "Squid";
    case eGameMode.SevenDeuce:
      return "SevenDeuce";
    case eGameMode.PlayNow:
      return "PlayNow";
    case eGameMode.SpinAndGo:
      return "SpinAndGo";
    default:
      return "unknown";
  }
}

export function shuffleArray(array: any[]) {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
}

export function convertRecordToMap<T>(record: Record<string, T>): Map<string, T> {
  return new Map(Object.entries(record));
}

export function addHighlight(origin: number, ...highlightTypes: eHighlightType[]) {
  let result = origin;

  for (const type of highlightTypes) {
    result |= type;
  }

  return result;
}

export function hasHighlight(origin: number, highlightType: eHighlightType) {
  return (origin & highlightType) !== 0;
}

export function countHighlight(origin: number) {
  let count = 0;
  while (origin) {
    origin &= origin - 1; // 켜진 비트 하나 제거
    count++;
  }
  return count;
}

export function getNewHighlights(oldFlags: number, newFlags: number): number[] {
  let addedFlags = newFlags & ~oldFlags; // 새로 켜진 하이라이트 추출
  const result: number[] = [];

  while (addedFlags) {
    const bit = addedFlags & -addedFlags; // 최하위 켜진 하이라이트 추출
    result.push(bit);
    addedFlags &= ~bit; // 추가된거 제거
  }

  return result;
}
