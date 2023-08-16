import "./App.css";

import propsDataRaw from "./data/props.json";
import altDataRaw from "./data/alternates.json";
import { DataGrid } from "@mui/x-data-grid";
import { columns, getMarketRows } from "./utils";
import { useState } from "react";

const MARKET_ROWS = getMarketRows(propsDataRaw, altDataRaw);

function App() {
  const [marketRowsFiltered, setMarketRowsFiltered] = useState(MARKET_ROWS);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // todo: fix type any
  const onChangeText = (event: any) => {
    const text = event.target.value.toLowerCase();

    const filteredRows = MARKET_ROWS.filter((market) => {
      const { teamNickname, playerName } = market;

      return (
        teamNickname.toLocaleLowerCase().includes(text) ||
        playerName.toLocaleLowerCase().includes(text)
      );
    });

    setMarketRowsFiltered(filteredRows);
  };

  const onClickInvertStatus = () => {
    const updatedRows = marketRowsFiltered.slice().map((marketRow) => {
      const { isSuspended, id } = marketRow;

      // @ts-ignore
      if (selectedRowIds.includes(id)) {
        console.log("hi");
        return {
          ...marketRow,
          // Invert market status and isSuspended
          marketStatus: isSuspended ? "Unsuspended" : "Suspended",
          isSuspended: !isSuspended,
        };
      }

      return marketRow;
    });

    setMarketRowsFiltered(updatedRows);
  };

  const onRowSelectionModelChange = (selection: any) => {
    setSelectedRowIds(selection);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Swish FE</p>
      </header>
      <body className="App-body">
        <div className="Search-button-container">
          <input
            onChange={onChangeText}
            className="Search-bar"
            placeholder="Filter by Player or Team Name"
          />
          <button onClick={onClickInvertStatus}>
            Invert Status Selected Rows
          </button>
        </div>
        <div className="Table-container">
          <DataGrid
            rows={marketRowsFiltered}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={onRowSelectionModelChange}
          />
        </div>
      </body>
    </div>
  );
}

export default App;
