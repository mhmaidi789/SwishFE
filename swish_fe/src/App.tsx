import "./App.css";

import propsDataRaw from "./data/props.json";
import altDataRaw from "./data/alternates.json";
import { DataGrid } from "@mui/x-data-grid";
import { columns, getMarketRows, makeAltMarketsMap } from "./utils";
import { useCallback, useState } from "react";

const MARKET_ROWS = getMarketRows(propsDataRaw, altDataRaw);

function App() {
  const [marketRowsFiltered, setMarketRowsFiltered] = useState(MARKET_ROWS);

  const onChangeText = useCallback((event: any) => {
    const text = event.target.value.toLowerCase();

    const filteredRows = MARKET_ROWS.filter((market) => {
      const { teamNickname, playerName } = market;

      return (
        teamNickname.toLocaleLowerCase().includes(text) ||
        playerName.toLocaleLowerCase().includes(text)
      );
    });

    setMarketRowsFiltered(filteredRows);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Swish FE</p>
      </header>
      <body className="App-body">
        <div className="Search-container">
          <input
            onChange={onChangeText}
            className="Search-bar"
            placeholder="Filter by Player or Team Name"
          />
        </div>
        <div className="Table-container">
          <DataGrid rows={marketRowsFiltered} columns={columns} />
        </div>
      </body>
    </div>
  );
}

export default App;
