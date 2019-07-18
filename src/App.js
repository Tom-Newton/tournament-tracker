import React from 'react';
import './App.css';
import $ from 'jquery';

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
                  onChange={(players) => this.handleChange(players)}
                >
                </PlayerInput>
              );
            }),
          }, {
            tabName: "Game Input",
            renderTabContent: () => <PlayerInput></PlayerInput>,
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
    };
  }

  handleChange(players) {
    this.setState({players: players});
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

class PlayerInput extends React.Component {
  editPlayers (value, index) {
      const players = this.props.players.slice();
      console.log(value)
      console.log(index)
      if (value) {
        console.log("update value")
        players[index] = value;
      } else {
        console.log("delete row")
        players.splice(index, 1)
      }
      console.log(players)
      // if (players[players.length - 1]) {
      //   players.push("")
      // }
      return players;
  }

  addPlayer (value) {
    const players = this.props.players.slice();
    players.push(value);
    return players;
  }

  render () {
    // TODO: Probably shouldn't use index for the key here so rerendering is efficient
    const players = this.props.players.slice();
    players.push("")
    const playerEntries = players.map((player, index) => {
      return (
        <PlayerEntry
          key={index}
          player={player}
          onChange={(value) => this.props.onChange(this.editPlayers(value, index))}
        >
        </PlayerEntry>
      );
    })
    return (
      <ol
      className="playerInput"
      >
        {playerEntries}
      </ol>
    );
  }
}

class PlayerEntry extends React.Component {
  render () {
    const className = `playerEntry${this.props.player ? "" : " empty"}`
    return (
      <li
        className={className}
      >
        <input
          id={this.props.id}
          type="text"
          value={this.props.player}
          placeholder={"Click to add new player"}
          onChange={(event) => this.props.onChange(event.target.value)}
        >
        </input>
      </li>
    );
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
