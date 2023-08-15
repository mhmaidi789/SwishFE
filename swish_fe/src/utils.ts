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
    historicalLinesGoodOdds: number[];
  };
  
type altMarketLines = {
    [key: number]: lines;
  };


const updateMarketHighLow = (
    marketMap: altMarketLines,
    altMarket: altMarket,
  ) => {
    const { playerId, line, underOdds, overOdds, pushOdds } = altMarket

    let trackedLines = marketMap?.[playerId];
    if (!trackedLines) {
      marketMap[playerId] = { lowLine: line, highLine: line, historicalLinesGoodOdds: [] };
      trackedLines = marketMap[playerId];
    } else if (line < trackedLines.lowLine) {
      marketMap[playerId].lowLine = line;
    } else if (line > trackedLines.highLine) {
      marketMap[playerId].highLine = line;
    }

    if(underOdds > 0.4 || overOdds > 0.4 || pushOdds > 0.4){
      trackedLines.historicalLinesGoodOdds.push(line);
    }

  };
  

export const makeAltMarketsMap = (altData: altMarket[]) => {
    const assistsByPlayerId: altMarketLines = {};
    const reboundsByPlayerId: altMarketLines = {};
    const pointsbyPlayerId: altMarketLines = {};
    const stealsByPlayerId: altMarketLines = {};
  
    altData.forEach((alt: altMarket) => {
      switch (alt.statType) {
        case "assists":
          updateMarketHighLow(assistsByPlayerId, alt);
          break;
        case "rebounds":
          updateMarketHighLow(reboundsByPlayerId, alt);
          break;
        case "points":
          updateMarketHighLow(pointsbyPlayerId, alt);
          break;
        case "steals":
          updateMarketHighLow(stealsByPlayerId, alt);
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

const isMarketSuspended = (prop: propMarket, historicalLinesGoodOdds: number[]) => {
  const {marketSuspended, line} = prop
  return !!marketSuspended || !historicalLinesGoodOdds.includes(line)
}
  

export const getMarketRows = (propsData: propMarket[], altDataRaw: altMarket[]) => {
  const altMarketsMap = makeAltMarketsMap(altDataRaw);

  return propsData.map((prop: propMarket) => {
      const {
        playerId,
        teamAbbr,
        teamNickname,
        playerName,
        position,
        statType,
        line,
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

      const { highLine = "-", lowLine = "-", historicalLinesGoodOdds = [] } =
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
        suspended: isMarketSuspended(prop, historicalLinesGoodOdds) ? "Suspended" : "Active",
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