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
      players: ["player0", "player1", ""],
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
  focus (index) {
    return true;
  }

  editPlayers (value, index) {
    const players = this.props.players.slice();
    if (value || this.focus(index)) {
      players[index] = value;
    } else {
      players.splice(index, 1);
    }
    if (players[players.length - 1]) {
      players.push("")
    }
    return players;
  }

  render () {
    console.log("render PlayerInputContent")
    // TODO: Probably shouldn't use index for the key here so rerendering is efficient
    const playerEntries = this.props.players.map((player, index) => {
      return (
        <PlayerEntry
          key={index}
          id={`inputField${index}`}
          player={player}
          onChange={(value) => this.props.onChange(this.editPlayers(value, index))}
          focus={() => this.focus(index)}
        >
        </PlayerEntry>
      );
    })
    return (
      <ol>
        {playerEntries}
      </ol>
    );
  }
}

class PlayerEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
    }
  }

  getValue (event) {
    // this.setState({edited: true});
    if (!(event.target.id === this.props.id)) {
      console.log("delete empty")
    }
    console.log(event.target)
    return event.target.value
  }

  focus () {
    console.log(document.activeElement)
  }

  render () {
    return (
      <li
        className="playerEntry"
      >
        <input
          id={this.props.id}
          type="text"
          value={this.props.player}
          placeholder={this.state.edited ? "" : "Click to add new player"}
          onChange={(event) => this.props.onChange(this.getValue(event))}
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
