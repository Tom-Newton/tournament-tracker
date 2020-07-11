import React from "react";
import Tabs from "./Tabs.js";
import PlayerInput from "./PlayerInput.js";
import GameInput from "./GameInput.js";
import ResultsInput from "./ResultsInput.js";
import ResultsTable from "./ResultsTable.js";
import SaveLoad from "./SaveLoad.js";
import { cloneDeep } from "lodash";

class App extends React.Component {
  constructor(props) {
    super(props);
    const tabsData = [
      {
        tabName: "Player Input",
        renderTabContent: () => {
          return (
            <PlayerInput
              players={this.state.players}
              onChange={(players) => this.handleChange("players", players)}
            ></PlayerInput>
          );
        },
      },
      {
        tabName: "Game Input",
        renderTabContent: () => {
          return (
            <GameInput
              games={this.state.games}
              players={this.state.players}
              onChangePlayers={(players) =>
                this.handleChange("players", players)
              }
              onChange={(games) => this.handleChange("games", games)}
            ></GameInput>
          );
        },
      },
      {
        tabName: "Results Input",
        renderTabContent: () => {
          return (
            <ResultsInput
              games={this.state.games}
              players={this.state.players}
              onChange={(games) => this.handleChange("games", games)}
            ></ResultsInput>
          );
        },
      },
      {
        tabName: "Results Table",
        renderTabContent: () => {
          return (
            <ResultsTable
              games={this.state.games}
              players={this.state.players}
            ></ResultsTable>
          );
        },
      },
      {
        tabName: "Save/Load",
        renderTabContent: () => {
          return (
            <SaveLoad
              saveLoad={this.state.saveLoad}
              onChange={(saveLoad) => this.handleChange("saveLoad", saveLoad)}
            />
          );
        },
      },
    ];

    const defaultState = {
      tabs: {
        activeTabIndex: 0,
      },
      players: [],
      games: [],
      saveLoad: {
        save: "",
        load: "",
      },
    };

    const restoredState = JSON.parse(
      localStorage.getItem("storedState"),
      function (key, value) {
        if (
          typeof value === "string" &&
          value.startsWith("/Set(") &&
          value.endsWith(")/")
        ) {
          value = value.substring(5, value.length - 2);
          return new Set(JSON.parse(value));
        }
        return value;
      }
    );
    // Use defaultState unless a state is stored in localstorage
    let state;
    if (restoredState) {
      state = restoredState;
    } else {
      state = defaultState;
    }

    // Add in tabsData which should never change
    state.tabs.tabsData = tabsData;
    this.state = state;
  }

  componentDidUpdate() {
    // Convert excludedGames sets to arrays so they can be stringified
    let copiedState = cloneDeep(this.state);

    let convertedState = JSON.stringify(copiedState, function (key, value) {
      if (typeof value === "object" && value instanceof Set) {
        return "/Set(" + JSON.stringify(Array.from(value)) + ")/";
      }
      return value;
    });
    localStorage.setItem("storedState", convertedState);
  }

  handleChange(area, object) {
    switch (area) {
      case "players":
        this.setState({ players: object });
        break;
      case "games":
        this.setState({ games: object });
        break;
      case "saveLoad":
        this.setState({ saveLoad: object });
        break;
      default:
        break;
    }
  }

  handleClick(index) {
    // TODO make this immutable
    this.setState((previousState, props) => {
      return (previousState.tabs.activeTabIndex = index);
    });
  }

  render() {
    return (
      <div className="Apptest1">
        <Tabs
          tabs={this.state.tabs}
          onClick={(index) => this.handleClick(index)}
        ></Tabs>
      </div>
    );
  }
}

export default App;
