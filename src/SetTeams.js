import React from "react";

class SetTeams extends React.Component {
  updateNumberOfTeams(value) {
    const teams = this.props.game.teams;
    teams.numberOfTeams = value;
    // Correct the number of winner objects
    const numberOfWinnersError =
      this.props.game.winners.length - this.props.game.teams.numberOfTeams;
    if (numberOfWinnersError > 0) {
      this.props.onChangeWinners(this.props.game.winners.slice(0, value));
    } else if (numberOfWinnersError < 0) {
      let winners = this.props.game.winners;
      for (let i = 0; i < -numberOfWinnersError; i++) {
        winners.push({ points: 0, team: {} });
      }
    }
    return teams;
  }

  updateTeams() {
    const includedPlayers = [];
    this.props.players.forEach((player, index) => {
      if (!player.excludedGames.has(this.props.game.gameName)) {
        includedPlayers.push(player.playerName);
      }
    });
    const randomisedPlayers = includedPlayers.map((player => {
      return {
        "player": player,
        "randomSeed": Math.random()
      }
    })).sort((entry0, entry1) => {
      return entry0.randomSeed - entry1.randomSeed
    }).map((playerAndSeed) => {
      return playerAndSeed.player
    })
    const team_size = randomisedPlayers.length / this.props.game.teams.numberOfTeams
    let division = 0;
    let rounded_division = 0;
    let previous_rounded_division = 0;
    const teamsData = [];
    for (let i = 0; i < this.props.game.teams.numberOfTeams; i++) {
      division += team_size;
      rounded_division = Math.round(division)
      teamsData.push(randomisedPlayers.slice(previous_rounded_division, rounded_division))
      previous_rounded_division = rounded_division;
    }
    const teams = this.props.game.teams;
    teams.teamsData = teamsData;
    return teams;
  }

  render() {
    const teams = this.props.game.teams.teamsData.map((teamData, teamIndex) => {
      const team = teamData.map((player, playerIndex) => {
        return <li key={playerIndex}>{player}</li>;
      });
      return (
        <div className="team" key={teamIndex}>
          <h5>{`Team ${teamIndex + 1}:`}</h5>
          <ol>{team}</ol>
        </div>
      );
    });
    const randomiseButton = (
      <button onClick={() => this.props.onChangeTeams(this.updateTeams())}>
        Randomise Teams
      </button>
    );
    return (
      <div className="setTeams">
        <h3>Set Teams: </h3>
        Number of Teams
        <input
          type="number"
          value={this.props.game.teams.numberOfTeams}
          min="2"
          max={this.props.players.length}
          onChange={(event) =>
            this.props.onChangeTeams(
              this.updateNumberOfTeams(parseInt(event.target.value))
            )
          }
        ></input>
        {randomiseButton}
        <div className="displayTeams">{teams}</div>
      </div>
    );
  }
}

export default SetTeams;
