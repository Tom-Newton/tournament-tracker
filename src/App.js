import React from 'react';
import Tabs from './Tabs.js';
import PlayerInput from './PlayerInput.js';
import GameInput from './GameInput.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    const tabsData = [
      {
        tabName: "Player Input",
        renderTabContent: (() => {
          return (
            <PlayerInput
            players={this.state.players}
            onChange={(players) => this.handleChange("players", players)}
            >
            </PlayerInput>
          );
        }),
      }, {
        tabName: "Game Input",
        renderTabContent: () => {
          return (
            <GameInput
            games={this.state.games}
            players={this.state.players}
            onChange={(games) => this.handleChange("games", games)}
            >
            </GameInput>
          );
        },
      }, {
        tabName: "Results Input",
        renderTabContent: () => <div>Results input</div>,
      }, {
        tabName: "Results Table",
        renderTabContent: () => <div>results table</div>,
      },
    ]

    const defaultState = {
      tabs: {
        activeTabIndex: 0,
      },
      players: [],
      games: [],
    };

    const storedState = JSON.parse(localStorage.getItem("storedState"));
    // Use defaultState unless a state is stored in localstorage
    let state;
    if (storedState) {
      console.log("loaded state")
      state = storedState;
    } else {
      state = defaultState;
    }

    // Add in tabsData which hould never change
    state.tabs.tabsData = tabsData;
    this.state = state;
  }

  componentDidUpdate () {
    localStorage.setItem("storedState", JSON.stringify(this.state));
  };

  handleChange(area, object) {
    switch (area) {
      case "players":
        this.setState({players: object});
        break;
      case "games":
        this.setState({games: object});
        break;
      default:
        break;
    }
  }

  handleClick(index) {
    // TODO make this immutable
    this.setState((previousState, props) => {
      return previousState.tabs.activeTabIndex = index;
    })
  }

  render() {
    return (
      <div className="Apptest1">
        <Tabs
          tabs={this.state.tabs}
          onClick={(index) => this.handleClick(index)}
        >
        </Tabs>
      </div>
    );
  }
}

export default App;
