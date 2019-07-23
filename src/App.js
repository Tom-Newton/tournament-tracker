import React from 'react';
import Tabs from './Tabs.js';
import PlayerInput from './PlayerInput.js';
import GameInput from './GameInput.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: {
        tabsData: [
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
        ],
        activeTabIndex: 1,
      },
      players: ["player0", "player1", "player2"],
      games: [{
        gameName: "gamename",
        includedPlayers: ["player0", "player1", "player2"],
        teams: {
          numberOfTeams: 2,
          teamsData: [],
        },
        gameData: [],
      }],
    };
  }

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
