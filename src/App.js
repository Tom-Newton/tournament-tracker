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
  constructor(props) {
    super(props);
    this.state = {
      players: this.props.players,
    };
  }
  // TODO: stop double rerenders due to handleChange and handleKeyDown
  async handleChange (value, index) {
    console.log("handle change")
    this.setState((state) => {
      const players = state.players.slice();
      console.log(value)
      players[index] = value;
      if (players[players.length - 1]) {
        players.push("")
      }
      return state.players = players;
    });
  }

  async handleKeyDown (keyCode, index) {
    console.log("handlekeydown")
    this.setState((state) => {
      const players = state.players.slice();
      if (keyCode === 8 || keyCode === 13) {
        if (keyCode === 8) {
          // Backspace
          if (!players[index] && index < players.length - 1) {
            // Field is empty -> delete field and focus above
            players.splice(index, 1);
            // TODO: Stop this from backspacing on the line above
            // document.getElementById(`inputField${index - 1}`).focus()
          }
        } else {
          if (players[index]) {
            if (players[index + 1]) {
              // Next fieldis not empty -> add an empty field below
              players.splice(index + 1, 0, "")
            }
            if (index < players.length - 1) {
              // Focus field below
              document.getElementById(`inputField${index + 1}`).focus()
              console.log("Focused next line")
            }
          }
        }
      }
        return state.players = players;
      });

    }

  async handleBlur (index) {
    console.log("handleBlur")
    this.setState((state) => {
      const players = this.state.players.slice();
      if (!players[index] && index < players.length - 1) {
        // Clicked off an empty field -> delete that field
        players.splice(index, 1);
        console.log("deleted line: " + index)
        this.setState((state) => {
          return state.players = players;
        });
      }
    });
  }

  render () {
    // TODO: Probably shouldn't use index for the key here so rerendering is efficient
    const playerEntries = this.state.players.map((player, index) => {
      return (
        <PlayerEntry
          key={index}
          id={`inputField${index}`}
          player={player}
          focus={index === 1}
          onChange={(value) => this.handleChange(value, index)}
          onKeyDown={(keyCode) => this.handleKeyDown(keyCode, index)}
          onBlur={() => this.handleBlur(index)}
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
  render () {
    if (this.props.focus) {
      console.log("focus");
      this.focusTextInput();
    }
    return (
      <li
        className="playerEntry"
      >
        <input
          id={this.props.id}
          type="text"
          value={this.props.player}
          placeholder={"Click to add new player"}
          onChange={(event) => this.props.onChange(event.target.value)}
          onKeyDown={(event) => this.props.onKeyDown(event.keyCode)}
          onBlur={() => this.props.onBlur()}
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
