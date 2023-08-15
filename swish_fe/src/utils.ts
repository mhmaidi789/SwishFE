import { GridColDef, GridRowsProp } from "@mui/x-data-grid";




type propMarket = {
    playerName: string;
    playerId: number;
    teamId: number;
    teamNickname: string;
    teamAbbr: string;
    statType: string;
    statTypeId: number;
    position: string;
    marketSuspended: number;
    line: number;
}

type altMarket = {
    playerName: string;
    playerId: number;
    statType: string;
    statTypeId: number;
    line: number;
    underOdds: number;
    overOdds: number;
    pushOdds: number;
}

type altMarketMap = {
    assistsByPlayerId: altMarketLines;
    reboundsByPlayerId: altMarketLines;
    pointsbyPlayerId: altMarketLines;
    stealsByPlayerId: altMarketLines;
}

type lines = {
    lowLine: number;
    highLine: number;
  };
  
type altMarketLines = {
    [key: number]: lines;
  };


const updateMarketHighLow = (
    market: altMarketLines,
    currentLine: number,
    playerId: number
  ) => {
    const trackedLines = market?.[playerId];
    if (!trackedLines) {
      market[playerId] = { lowLine: currentLine, highLine: currentLine };
    } else if (currentLine < trackedLines.lowLine) {
      market[playerId].lowLine = currentLine;
    } else {
      market[playerId].highLine = currentLine;
    }
  };
  

export const makeAltMarketsMap = (altData: altMarket[]) => {
    const assistsByPlayerId: altMarketLines = {};
    const reboundsByPlayerId: altMarketLines = {};
    const pointsbyPlayerId: altMarketLines = {};
    const stealsByPlayerId: altMarketLines = {};
  
    altData.forEach((alt: altMarket) => {
      switch (alt.statType) {
        case "assits":
          updateMarketHighLow(assistsByPlayerId, alt.line, alt.playerId);
          break;
        case "rebounds":
          updateMarketHighLow(reboundsByPlayerId, alt.line, alt.playerId);
          break;
        case "points":
          updateMarketHighLow(pointsbyPlayerId, alt.line, alt.playerId);
          break;
        case "steals":
          updateMarketHighLow(stealsByPlayerId, alt.line, alt.playerId);
          break;
        default:
          return;
      }
    });
  
    return {
      assistsByPlayerId,
      reboundsByPlayerId,
      pointsbyPlayerId,
      stealsByPlayerId,
    };
  };
  

export const getMarketRows = (propsData: propMarket[], altMarketsMap: altMarketMap) => {

return propsData.map((prop: propMarket) => {
    const {
      playerId,
      teamAbbr,
      teamNickname,
      playerName,
      position,
      statType,
      line,
      marketSuspended,
    } = prop;

    let marketType:
      | "assistsByPlayerId"
      | "reboundsByPlayerId"
      | "pointsbyPlayerId"
      | "stealsByPlayerId";
    switch (prop.statType) {
      case "assists":
        marketType = "assistsByPlayerId";
        break;
      case "rebounds":
        marketType = "reboundsByPlayerId";
        break;
      case "points":
        marketType = "pointsbyPlayerId";
        break;
      case "steals":
        marketType = "stealsByPlayerId";
        break;
      default:
        break;
    }

    const suspended = !!marketSuspended;

    const { highLine = "-", lowLine = "-" } =
      // @ts-ignore: If marketType does not exist, we will use default '-' for highLine or lowLine.
      altMarketsMap?.[marketType]?.[playerId] ?? {};

    return {
      id: statType + playerId,
      teamAbbr,
      teamNickname,
      playerName,
      position,
      statType:
        statType.charAt(0).toUpperCase() + statType.slice(1).toLowerCase(),
      line,
      highLine: highLine,
      lowLine: lowLine,
      suspended: !!suspended ? "Suspended" : "Active",
    };
  })
}

export const columns: GridColDef[] = [
    { field: "teamNickname", headerName: "Team" },
    { field: "playerName", headerName: "Name", width: 150 },
    { field: "position", headerName: "Position" },
    { field: "statType", headerName: "Type" },
    { field: "line", headerName: "Line" },
    { field: "highLine", headerName: "High Line" },
    { field: "lowLine", headerName: "Low Line" },
    { field: "suspended", headerName: "Status" },
];