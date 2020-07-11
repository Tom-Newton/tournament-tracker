import React from 'react';
import Tabs from './Tabs.js';
import TeamSelection from './TeamSelection.js';
import SetTeams from './SetTeams.js';
import './GameInput.css';
import './App.css';

class GameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  buildTabs() {
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

  handleClick(index) {
    this.setState({ activeTabIndex: index });
  }

  editGames(game, index) {
    const games = this.props.games.slice();
    games[index] = game;
    return games;
  }

  render() {
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
  updateGame(winners, teams, gameData) {
    const game = this.props.game;
    if (winners) {
      game.winners = winners;
    }
    if (teams) {
      game.teams = teams;
    }
    if (gameData) {
      game.gameData = gameData;
    }
    return game;
  }

  getGetTeam(team) {
    if (team.sourceType === "number") {
      return () => team
    }
    else if (team.sourceType === "rank") {
      return () => this.props.game.gameData[team.sourceRound].roundData[team.sourceSubRound].subRoundData.leaderboard[team.rank].getTeam();
    } else {
      const message = `buildFixture team had no sourceType team = ${team}`
      console.warn(message)
      return () => message;
    }
  }

  buildFixture(teams) {
    return teams.map(teamReference => {
      return ({
        teamReference: teamReference,
        points: ""
      });
    });
  }

  buildFixtures() {
    let game = this.props.game
    game.gameData.forEach((round) => {
      round.roundData.forEach((subRound) => {
        const subRoundData = subRound.subRoundData
        let includedTeams = subRound.includedTeams //.map(team => this.getGetTeam(team));
        if (subRoundData.type === "headToHead") {
          if (includedTeams.length >= 2) {
            subRoundData.fixtures = [this.buildFixture(includedTeams)];
            subRoundData.leaderboard = includedTeams.map(teamReference => {
              return {teamReference: teamReference}
            });
          }
        } else if (subRoundData.type === "roundRobin") {
          let fixtures = [];
          let includedTeamsCopy = includedTeams.slice();
          while (includedTeamsCopy.length) {
            const currentTeam = includedTeamsCopy.pop();
            includedTeamsCopy.forEach((team) => {
              fixtures.push(this.buildFixture([currentTeam, team]));
            });
          }
          subRoundData.fixtures = fixtures.slice();
          subRoundData.leaderboard = includedTeams.map(teamReference => {
            return ({
              points: 0,
              pointDifference: 0,
              fixtures: subRoundData.fixtures.map(() => {
                return { points: 0, pointDifference: 0 }
              }),
              teamReference: teamReference,
            });
          });
        }
      });
    });
    return game;
  }

  render() {
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
          game={this.props.game}
          onChangeTeams={(teams) => this.props.onChange(this.updateGame(null, teams, null))}
          onChangeWinners={(winners) => this.props.onChange(this.updateGame(winners, null, null))}
        >
        </SetTeams>
        <GameData
          game={this.props.game}
          onChange={(gameData) => this.props.onChange(this.updateGame(null, null, gameData))}
        >
        </GameData>
        <button
          onClick={() => this.props.onChange(this.buildFixtures())}
        >
          Build Fixtures
        </button>
        <Winners
          game={this.props.game}
          onChange={(winners) => this.props.onChange(this.updateGame(winners, null, null))}
        >
        </Winners>
      </div>
    );
  }
}

class Winners extends React.Component {
  updateWinners(team, points, index) {
    const winners = this.props.game.winners;
    if (team) {
      winners[index].team = team;
    }
    if (points) {
      console.log(points)
      winners[index].points = parseInt(points);
    }
    return winners;
  }

  render() {
    const gameWinners = this.props.game.winners.map((winner, index) => {
      return (
        <div
          key={index}
        >
          <h5>{`Rank: ${index + 1}`}</h5>
          {/* TODO: Find a better way to allow any round number rather than just setting to 10 */}
          <TeamSelection
            team={winner.team}
            roundNumber={10}
            game={this.props.game}
            teamNumber={index + 1}
            onChange={(team) => this.props.onChange(this.updateWinners(team, null, index))}
          >
          </TeamSelection>
          Points:
          <input
            type="number"
            value={winner.points}
            onChange={(event) => this.props.onChange(this.updateWinners(null, event.target.value, index))}
          >
          </input>
        </div>
      );
    });
    return (
      <div>
        <h3>Winners Points: </h3>
        {gameWinners}
      </div>
    )
  }
}

class GameData extends React.Component {
  updateRound(round, index) {
    const gameData = this.props.game.gameData.slice();
    gameData[index] = round;
    return gameData;
  }

  addRound() {
    const gameData = this.props.game.gameData.slice();
    gameData.push({
      roundData: [],
    });
    return gameData;
  }

  removeRound() {
    const gameData = this.props.game.gameData.slice();
    gameData.pop();
    return gameData;
  }

  render() {
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
        <h3>Tournament Structure:</h3>
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
  updateSubRound(subRound, index) {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData[index] = subRound;
    round.roundData = roundData;
    return round;
  }

  addSubRound() {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData.push({
      includedTeams: [],
      subRoundData: {
        name: "",
        leaderboard: [],
        fixtures: [],
      },
    });
    round.roundData = roundData
    return round;
  }

  removeSubRound() {
    const round = this.props.round;
    const roundData = round.roundData.slice();
    roundData.pop();
    round.roundData = roundData;
    return round;
  }

  render() {
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
        className="round"
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
  updateTeams(team, index) {
    const subRound = this.props.subRound;
    const includedTeams = this.props.subRound.includedTeams.slice();
    includedTeams[index] = team;
    subRound.includedTeams = includedTeams;
    return subRound;
  }

  addTeam() {
    const subRound = this.props.subRound;
    const includedTeams = this.props.subRound.includedTeams.slice()
    includedTeams.push({});
    subRound.includedTeams = includedTeams;
    return subRound;
  }

  removeTeam() {
    const subRound = this.props.subRound;
    const includedTeams = this.props.subRound.includedTeams.slice()
    includedTeams.pop();
    subRound.includedTeams = includedTeams;
    return subRound;
  }

  updateType(type) {
    const subRound = this.props.subRound;
    subRound.subRoundData.type = type;
    return subRound;
  }

  updateName(name) {
    const subRound = this.props.subRound;
    subRound.subRoundData.name = name;
    return subRound;
  }

  render() {
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

class GamePlayers extends React.Component {
  updatePlayers(index) {
    const players = this.props.players.slice();
    if (players[index].excludedGames.has(this.props.gameName)) {
      players[index].excludedGames.delete(this.props.gameName);
    } else {
      players[index].excludedGames.add(this.props.gameName);
    }
    return players;
  }

  render() {
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

  buildNewGame() {
    const newGame = {
      gameName: this.state.gameName,
      teams: {
        numberOfTeams: 2,
        teamsData: [],
      },
      gameData: [],
      winners: [
        { points: 0, team: {} },
        { points: 0, team: {} },
      ],
    };
    return newGame;
  }

  handleChange(gameName) {
    this.setState({ gameName: gameName });
  }

  handleKeyDown(keyCode) {
    if (keyCode === 13) {
      return this.props.onSubmit(this.buildNewGame());
    }
  }

  render() {
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
