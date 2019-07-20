import React from 'react';
import Tabs from './Tabs.js'
import './GameInput.css';

class GameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0
    }
  }

  buildTabs () {
    const tabsData = this.props.games.map((game, index) => {
      return {
        tabName: game.gameName,
        renderTabContent: (() => {
          return (
            <ConfigureGame
              game={game}
              players={this.props.players}
              onChange={(value) => this.props.onChange(this.editGames(value, "players", index))}
            >
            </ConfigureGame>
          );
        }),
      }
    });
    tabsData.push({
      tabName: "Add New Game",
      renderTabContent: (() => {
        return (
          <NewGame
            onSubmit={(value) => this.props.onChange(this.editGames(value, "name", this.props.games.length))}
          >
          </NewGame>
        );
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

  editGames (value, property, index) {
    const games = this.props.games.slice();
    switch (property) {
      case "name":
        if (value) {
          games[index] = {
            gameName: value,
            // TODO: Switch to using a set instead of an array
            includedPlayers: this.props.players.slice(),
            teams: [],
          };
        }
        break;
      case "players":
        const includedPlayerIndex = this.props.games[index].includedPlayers.indexOf(value);
        if (includedPlayerIndex === -1) {
          games[index].includedPlayers.push(value);
        } else {
          games[index].includedPlayers.splice(includedPlayerIndex, 1);
        }
        break;
      default:
        break;
    }
    return games;
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

export default GameInput;

class ConfigureGame extends React.Component {
  render () {
    return (
      <div>
        ConfigureGame
        {this.props.game.gameName}
        <IncludedPlayers
          players={this.props.players}
          includedPlayers={this.props.game.includedPlayers}
          onChange={(player) => this.props.onChange(player)}
        >
        </IncludedPlayers>
        <SetTeams
          includedPlayers={this.props.game.includedPlayers}
        >
        </SetTeams>
      </div>
    );
  }
}

class SetTeams extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfTeams: 2,
      assignedPlayers: [],
    };
  }

  handleChange (value) {
    this.setState({numberOfTeams: value});
  }

  randomiseTeams (fill) {

    const unassignedPlayers = []
    this.props.includedPlayers.forEach((player) => {
      if (!this.state.assignedPlayers.includes(player)) {
        unassignedPlayers.push(player);
        // Unassigned players will be asigned to teams so add them to
        // state.assignedPlayers
        this.setState((state) => {
          return {assignedPlayers: state.assignedPlayers.push(player)}
        });
      }
    })
    console.log(unassignedPlayers);
    const teams = [];
    return teams;
  }

  render () {
    let fillButton;
    if (this.state.assignedPlayers.length) {
      fillButton = (
        <button
          onClick={() => this.randomiseTeams(true)}
        >
          Fill Teams
        </button>
      );
    }
    return (
      <div className="setTeams">
        <h3>Set Teams: </h3>
        Number of Teams
        <input
          type="number"
          value={this.state.numberOfTeams}
          min="2"
          onChange={(event) => this.handleChange(event.target.value)}
        >
        </input>
        <button
          onClick={() => this.randomiseTeams(false)}
        >
          Randomise Teams
        </button>
        {fillButton}
        <div className="displayTeams">
          displayTeams
        </div>
      </div>
    );
  }
}

function IncludedPlayers (props) {
  const includedPlayers = props.players.map((player, index) => {
    const included = !!props.includedPlayers.find((includedPlayer) => {
      return includedPlayer === player;
    });
    return (
      <li
      key={index}
      >
        <div>
          {player}
          <input
          type="checkbox"
          onChange={() => props.onChange(player)}
          checked={included}
          >
          </input>
        </div>
      </li>
    );
  });
  return (
    <div className="includedPlayers">
      <h3>Included Players: </h3>
      <ol>
        {includedPlayers}
      </ol>
    </div>
  );
}

class NewGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: "",
    }
  }

  handleChange (gameName) {
    this.setState({gameName: gameName});
  }

  handleKeyDown (keyCode) {
    if (keyCode === 13) {
      return this.props.onSubmit(this.state.gameName);
    }
  }

  render () {
    return (
      <div>
        <input
          type="text"
          value={this.state.gameName}
          placeholder="Enter new game name"
          autoFocus={true}
          onChange={(event) => this.handleChange(event.target.value)}
          onKeyDown={(event) => this.handleKeyDown(event.keyCode)}
        >
        </input>
        <button
          onClick={() => this.props.onSubmit(this.state.gameName)}
        >
          Add Game
        </button>
      </div>
    );
  }
}
