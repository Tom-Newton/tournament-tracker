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
            includedPlayers: this.props.players.slice(),
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
    const players = this.props.players.slice().map((player, index) => {
      const included = !!this.props.game.includedPlayers.find((includedPlayer) => {
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
              onChange={() => this.props.onChange(player)}
              checked={included}
            >
            </input>
          </div>
        </li>
      );
    })
    return (
      <div>
      ConfigureGame
      {this.props.game.gameName}
        <div className="Included players">
          <h3>Included Players: </h3>
          <ol>
            {players}
          </ol>
        </div>
      </div>
    )
  }
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
