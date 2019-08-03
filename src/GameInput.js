import React from 'react';
import Tabs from './Tabs.js'
import './GameInput.css';
import './App.css';

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
              onChangePlayers={(players) => this.props.onChangePlayers(players)}
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
  updateGame (gamePlayers, teams, gameData) {
    const game = this.props.game;
    if (gamePlayers) {
      game.gamePlayers = gamePlayers;
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
        {`Configure game: ${this.props.game.gameName}`}
        <GamePlayers
          players={this.props.players}
          gameName={this.props.game.gameName}
          onChangePlayers={(players) => this.props.onChangePlayers(players)}
        >
        </GamePlayers>
        <SetTeams
          players={this.props.players}
          gameName={this.props.game.gameName}
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
          roundNumber={index}
          game={this.props.game}
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
              <td
                colSpan="100%"
              >
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
  updateSubRound (subRound, index) {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData[index] = subRound;
    round.roundData = roundData;
    return round;
  }

  addSubRound () {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData.push({
      includedTeams: [],
      subRoundData: {
        name: "",
        scores: [],
      },
    });
    round.roundData = roundData
    return round;
  }

  removeSubRound () {
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
          roundNumber={this.props.roundNumber}
          subRoundNumber={index}
          game={this.props.game}
          subRound={this.props.round.roundData[index]}
          onChange={(subRound) => this.props.onChange(this.updateSubRound(subRound, index))}
        >
        </SubRound>
      );
    });
    return (
      <tr
      className = "round"
      >
        <td>
          <h5>{`Round: ${this.props.roundNumber + 1}`}</h5>
        </td>
        {subRounds}
        <td>
          <button
            onClick={() => this.props.onChange(this.addSubRound())}
          >
            Add Sub Round
          </button>
          <button
            onClick={() => this.props.onChange(this.removeSubRound())}
          >
            Remove Sub Round
          </button>
        </td>
      </tr>
    );
  }
}

class SubRound extends React.Component {
  updateTeams (team, index) {
    const subRound = this.props.subRound;
    const includedTeams = this.props.subRound.includedTeams.slice();
    includedTeams[index] = team;
    subRound.includedTeams = includedTeams;
    return subRound;
  }

  addTeam () {
    const subRound = this.props.subRound;
    const includedTeams = this.props.subRound.includedTeams.slice()
    includedTeams.push({});
    subRound.includedTeams = includedTeams;
    return subRound;
  }

  removeTeam () {
    const subRound = this.props.subRound;
    const includedTeams = this.props.subRound.includedTeams.slice()
    includedTeams.pop();
    subRound.includedTeams = includedTeams;
    return subRound;
  }

  updateType (type) {
    const subRound = this.props.subRound;
    subRound.subRoundData.type = type;
    return subRound;
  }

  updateName (name) {
    const subRound = this.props.subRound;
    subRound.subRoundData.name = name;
    return subRound;
  }

  render () {
    const teamsSelection = this.props.subRound.includedTeams.map((team, index) => {
      return (
        <TeamSelection
          key={index}
          team={team}
          roundNumber={this.props.roundNumber}
          game={this.props.game}
          teamNumber={index + 1}
          onChange={(team) => this.props.onChange(this.updateTeams(team, index))}
        >
        </TeamSelection>
      );
    });
    return (
      <td
        className="subRound"
      >
        <h5>{`Sub Round: ${this.props.subRoundNumber + 1}`}</h5>
        Sub round name:
        <input
          type="text"
          value={this.props.subRound.subRoundData.name}
          placeholder="Enter sub round name"
          onChange={(event) => this.props.onChange(this.updateName(event.target.value))}
        >
        </input>
        Sub round type:
        <select
          value={this.props.subRound.subRoundData.type}
          onChange={(event) => this.props.onChange(this.updateType(event.target.value))}
        >
          <option value={undefined}>Select sub round type</option>
          <option value="headToHead">Head to head</option>
          <option value="roundRobin">Round robin</option>
        </select>
        {teamsSelection}
        <div
        key="buttons"
        >
          <button
            onClick={() => this.props.onChange(this.addTeam())}
          >
            Add Team
          </button>
          <button
            onClick={() => this.props.onChange(this.removeTeam())}
          >
            Remove Team
          </button>
        </div>
      </td>
    )
  };
}

class TeamSelection extends React.Component {
  updateTeam (sourceType, sourceRound, sourceSubRound, number, rank) {
    // TODO: Change this to a switch statement
    const team = this.props.team;
    if (sourceType) {
      team.sourceType = sourceType
    }
    if (sourceRound || sourceRound === 0) {
      team.sourceRound = sourceRound;
    }
    if (sourceSubRound || sourceSubRound === 0) {
      team.sourceSubRound = sourceSubRound;
    }
    if (number || number === 0) {
      team.number = number;
    }
    if (rank || rank === 0) {
      team.rank = rank
    }
    return team;
  }

  roundSelection () {
    const rounds = this.props.game.gameData.slice().splice(0, this.props.roundNumber)
    const options = rounds.map((round, index) => {
      return (
        <option
          key={index}
          value={index}
        >
          {index + 1}
        </option>
      );
    });
    return (
      <div className="roundSelection">
        Source round:
        <select
          value={this.props.team.sourceRound}
          onChange={(event) => this.props.onChange(this.updateTeam(null, parseInt(event.target.value), null, null, null))}
        >
          <option value={undefined}>Select source round</option>
          {options}
        </select>
      </div>
    );
  }

  subRoundSelection () {
    const sourceRound = this.props.team.sourceRound;
    const options = this.props.game.gameData[sourceRound].roundData.map((subRound, index) => {
      return (
        <option
          key={index}
          value={index}
        >
          {index + 1}
        </option>
      );
    });
    return (
      <div className="subRoundSelection">
      Source sub round:
        <select
          value={this.props.team.sourceSubRound}
          onChange={(event) => this.props.onChange(this.updateTeam(null, null, parseInt(event.target.value), null, null))}
        >
          <option value={undefined}>Select source sub round</option>
          {options}
        </select>
      </div>
    );
  }

  numberSelection () {
    const options = Array.from(Array(this.props.game.teams.numberOfTeams).keys()).map((index) => {
      return (
        <option
          key={index}
          value={index}
        >
          {index + 1}
        </option>
      );
    });
    return(
      <div className="numberSelection">
        Number:
        <select
          value={this.props.team.number}
          onChange={(event) => this.props.onChange(this.updateTeam(null, null, null, parseInt(event.target.value), null))}
        >
          <option value={undefined}>Select team</option>
          {options}
        </select>
      </div>
    );
  }

  rankSelection () {
    const sourceRound = this.props.team.sourceRound;
    const sourceSubRound = this.props.team.sourceSubRound;
    const numberOfRanks = this.props.game.gameData[sourceRound].roundData[sourceSubRound].includedTeams.length;
    const options = Array.from(Array(numberOfRanks).keys()).map((index) => {
      return (
        <option
          key={index}
          value={index}
        >
          {index + 1}
        </option>
      );
    });
    return (
      <div className="rankSelection">
        Rank:
        <select
          value={this.props.team.rank}
          onChange={(event) => this.props.onChange(this.updateTeam(null, null, null, null, parseInt(event.target.value)))}
        >
          <option value={undefined}>Select team</option>
          {options}
        </select>
      </div>
    );
  }

  render () {
    const roundSelection = this.props.team.sourceType === "rank";
    const numberSelection = this.props.team.sourceType === "number";
    const subRoundSelection = roundSelection && (this.props.team.sourceRound || this.props.team.sourceRound === 0);
    const rankSelection = subRoundSelection && (this.props.team.sourceSubRound || this.props.team.sourceSubRound === 0);
    return (
      <div className="teamSelection">
        <div className="sourceTypeSelection">
          <h5>{`Select Team: ${this.props.teamNumber}`}</h5>
          Team source type:
          <select
            value={this.props.team.sourceType}
            onChange={(event) => this.props.onChange(this.updateTeam(event.target.value, null, null, null))}
          >
            <option value={undefined}>Select team source type</option>
            <option value="number">Team List</option>
            <option value="rank">Ranking</option>
          </select>
        </div>
        {roundSelection && this.roundSelection()}
        {subRoundSelection && this.subRoundSelection()}
        {numberSelection && this.numberSelection()}
        {rankSelection && this.rankSelection()}
      </div>
    );
  }
}

class SetTeams extends React.Component {
  updateNumberOfTeams (value) {
    const teams = this.props.teams;
    teams.numberOfTeams = value;
    return teams;
  }

  updateTeams () {
    const unassignedPlayers = [];
    this.props.players.forEach((player, index) => {
      if (!(player.excludedGames.has(this.props.gameName))) {
        unassignedPlayers.push(player.playerName)
      }
    })
    console.log(unassignedPlayers)
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
          <h5>{`Team ${teamIndex + 1}:`}</h5>
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
          max={this.props.players.length}
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

class GamePlayers extends React.Component {
  updatePlayers (index) {
    const players = this.props.players.slice();
    if (players[index].excludedGames.has(this.props.gameName)) {
      players[index].excludedGames.delete(this.props.gameName);
    } else {
      players[index].excludedGames.add(this.props.gameName);
    }
    return players;
  }

  render () {
    const gamePlayers = this.props.players.map((player, index) => {
      return (
        <li
        key={index}
        >
          <div>
            {player.playerName}
            <input
              type="checkbox"
              onChange={() => this.props.onChangePlayers(this.updatePlayers(index))}
              checked={!(player.excludedGames.has(this.props.gameName))}
            >
            </input>
          </div>
        </li>
      );
    });
    return (
      <div className="gamePlayers">
        <h3>Included Players: </h3>
        <ol>
          {gamePlayers}
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
