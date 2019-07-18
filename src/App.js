import React from 'react';
import './App.css';
import PlayerInput from './PlayerInput.js';

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
                  onChange={(games) => this.handleChange("games", games)}
                >
                </GameInput>
              );
            },
          }, {
            tabName: "Results Input",
            renderTabContent: () => <PlayerInput></PlayerInput>,
          }, {
            tabName: "Results Table",
            renderTabContent: () => <PlayerInput></PlayerInput>,
          },
        ],
        activeTabIndex: 0,
      },
      players: ["player0", "player1"],
      games: [{
        gameName: "football"
      }, {
        gameName: "water polo"
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

class GameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0
    }
  }

  buildTabs () {
    const tabsData = this.props.games.map((game) => {
      return {
        tabName: game.gameName,
        renderTabContent: (() => {
          return (
            <ConfigureGame
              game={game}>
            </ConfigureGame>
          );
        }),
      }
    });
    tabsData.push({
      tabName: "Add New Game",
      renderTabContent: (() => {
        return (
          <div>
            <input
              type="text"
            >
            </input>
            <button
              onClick={() => this.props.onClick()}
            >
              Add Game
            </button>
          </div>
        )
      })
    })
    return {
      tabsData: tabsData,
      activeTabIndex: this.state.activeTabIndex,
    }
  }

  handleClick (index) {
    this.setState({activeTabIndex: index});
  }

  render () {
    return (
      <Tabs
        tabs={this.buildTabs(this.props.games)}
        onClick={(index) => this.handleClick(index)}
      >
      </Tabs>
    );
  }
}

class ConfigureGame extends React.Component {
  render () {
    return (
      <div>
        ConfigureGame
        {this.props.game.gameName}
      </div>
    )
  }
}

function Tabs(props) {
  const tabList = props.tabs.tabsData.map((tabData, index) => {
    return (
      <Tab
        key={index}
        tabName={tabData.tabName}
        active={index === props.tabs.activeTabIndex}
        onClick={() => props.onClick(index)}
      >
      </Tab>
    );
  });

  const currentTabContent = props.tabs.tabsData[props.tabs.activeTabIndex].renderTabContent()
  return (
    <div className="tabs">
      <header>
        <div className="tabsBar">
          {tabList}
        </div>
      </header>
      <div className="tabContent">
        {currentTabContent}
      </div>
    </div>
  );
}

function Tab(props) {
  return (
    <button
      className={`tab ${props.active ? "active" : ""}`}
      onClick={() => props.onClick()}
    >
      {props.tabName}
    </button>
  );
}
