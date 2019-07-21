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
              onChange={(game) => this.props.onChange(this.editGames(game, index))}
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
            players={this.props.players}
            onSubmit={(game) => this.props.onChange(this.editGames(game, this.props.games.length))}
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

  editGames (game, index) {
    const games = this.props.games.slice();
    games[index] = game;
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
  updateGame (includedPlayers, teams, gameData) {
    const game = this.props.game;
    if (includedPlayers) {
      game.includedPlayers = includedPlayers;
    }
    if (teams) {
      game.teams = teams;
    }
    if (gameData) {
      game.gameData = gameData;
    }
    return game;
  }

  render () {
    return (
      <div>
        ConfigureGame
        {this.props.game.gameName}
        <IncludedPlayers
          players={this.props.players}
          includedPlayers={this.props.game.includedPlayers}
          onChange={(includedPlayers) => this.props.onChange(this.updateGame(includedPlayers, null, null))}
        >
        </IncludedPlayers>
        <SetTeams
          includedPlayers={this.props.game.includedPlayers}
          teams={this.props.game.teams}
          onChange={(teams) => this.props.onChange(this.updateGame(null, teams, null))}
        >
        </SetTeams>
        <GameData
          game={this.props.game}
          onChange={(gameData) => this.props.onChange(this.updateGame(null, null, gameData))}
        >
        </GameData>
      </div>
    );
  }
}

class GameData extends React.Component {
  updateRound (round, index) {
    const gameData = this.props.game.gameData.slice();
    gameData[index] = round;
    return gameData;
  }

  addRound () {
    const gameData = this.props.game.gameData.slice();
    gameData.push({
      includedTeams: [],
      roundData: [],
    });
    return gameData;
  }

  removeRound () {
    const gameData = this.props.game.gameData.slice();
    gameData.pop();
    return gameData;
  }

  render () {
    const rounds = this.props.game.gameData.map((round, index) => {
      return (
        <Round
          key={index}
          round={round}
          onChange={(round) => this.props.onChange(this.updateRound(round, index))}
        >
        </Round>
      );
    });
    return (
      <div className="gameData">
        <table>
          <tbody>
            {rounds}
            <tr>
              <td>
                <button
                  onClick={() => this.props.onChange(this.addRound())}
                >
                  Add Game Round
                </button>
                <button
                  onClick={() => this.props.onChange(this.removeRound())}
                >
                  Remove Game Round
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Round extends React.Component {
  updateRound (subRound, index) {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData[index] = subRound;
    round.roundData = roundData;
    return round;
  }

  addRound () {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData.push({
      includedTeams: [],
      subRoundData: {
        type: "",
        scores: [],
      },
    });
    round.roundData = roundData
    return round;
  }

  removeRound () {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData.pop();
    round.roundData = roundData;
    return round;
  }

  render () {
    const subRounds = this.props.round.roundData.map((subRound, index) => {
      return (
        <SubRound
          key={index}
          subRound={this.props.subRound}
          onChange={(subRound) => this.props.onChange(subRound, index)}
        >
        </SubRound>
      );
    });
    return (
      <tr
      className = "round"
      >
        {subRounds}
        <td>
          <button
            onClick={() => this.props.onChange(this.addRound())}
          >
            Add Sub Round
          </button>
          <button
            onClick={() => this.props.onChange(this.removeRound())}
          >
            Remove Sub Round
          </button>
        </td>
      </tr>
    );
  }
}

class SubRound extends React.Component {
  render () {
    return (
      <td
        className="subRound"
      >
        subround
      </td>
    )
  };
}

class SetTeams extends React.Component {
  updateNumberOfTeams (value) {
    const teams = this.props.teams;
    teams.numberOfTeams = value;
    return teams;
  }

  updateTeams () {
    const unassignedPlayers = this.props.includedPlayers.slice();
    const teamsData = [];
    while (unassignedPlayers.length) {
      let unFilledTeams = Array.from(Array(this.props.teams.numberOfTeams).keys())
      while (unFilledTeams.length && unassignedPlayers.length) {
        const player = unassignedPlayers.pop();
        const team = unFilledTeams[Math.floor(Math.random()*unFilledTeams.length)]
        if (teamsData[team]) {
          teamsData[team].push(player);
        } else {
          teamsData[team] = [player];
        }
        unFilledTeams = unFilledTeams.filter((unfilledTeam) => unfilledTeam !== team);
      }
    };
    const teams = this.props.teams;
    teams.teamsData = teamsData;
    return teams;
  }

  render () {
    const teams = this.props.teams.teamsData.map((teamData, teamIndex) => {
      const team = teamData.map((player, playerIndex) => {
        return (
          <li
            key={playerIndex}
          >
            {player}
          </li>
        );
      })
      return (
        <div
          className="team"
          key={teamIndex}
        >
          <h5>{`Team ${teamIndex}:`}</h5>
          <ol>
            {team}
          </ol>
        </div>
      );
    });
    const randomiseButton = (
      <button
      onClick={() => this.props.onChange(this.updateTeams())}
      >
      Randomise Teams
      </button>
    );
    return (
      <div className="setTeams">
        <h3>Set Teams: </h3>
        Number of Teams
        <input
          type="number"
          value={this.props.teams.numberOfTeams}
          min="2"
          max={this.props.includedPlayers.length}
          onChange={(event) => this.props.onChange(this.updateNumberOfTeams(parseInt(event.target.value)))}
        >
        </input>
        {randomiseButton}
        <div className="displayTeams">
          {teams}
        </div>
      </div>
    );
  }
}

class IncludedPlayers extends React.Component {
  updateIncludedPlayers (player) {
    const includedPlayers = this.props.includedPlayers.slice();
    const includedPlayerIndex = includedPlayers.indexOf(player);
    if (includedPlayerIndex === -1) {
      includedPlayers.push(player);
    } else {
      includedPlayers.splice(includedPlayerIndex, 1);
    }
    return includedPlayers
  }

  render () {
    // Fix this so it works when players have the same names
    const includedPlayers = this.props.players.map((player, index) => {
      const included = !!this.props.includedPlayers.find((includedPlayer) => {
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
              onChange={() => this.props.onChange(this.updateIncludedPlayers(player))}
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
}

class NewGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: "",
    }
  }

  buildNewGame () {
    const newGame = {
        gameName: this.state.gameName,
        // TODO: Switch to using a set instead of an array
        includedPlayers: this.props.players.slice(),
        teams: {
          numberOfTeams: 2,
          teamsData: [],
        },
        gameData: [],
    };
    return newGame;
  }

  handleChange (gameName) {
    this.setState({gameName: gameName});
  }

  handleKeyDown (keyCode) {
    if (keyCode === 13) {
      return this.props.onSubmit(this.buildNewGame());
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
          onClick={() => this.props.onSubmit(this.buildNewGame())}
        >
          Add Game
        </button>
      </div>
    );
  }
}
