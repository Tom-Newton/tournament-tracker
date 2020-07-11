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
    const unassignedPlayers = [];
    this.props.players.forEach((player, index) => {
      if (!player.excludedGames.has(this.props.game.gameName)) {
        unassignedPlayers.push(player.playerName);
      }
    });
    const teamsData = [];
    while (unassignedPlayers.length) {
      let unFilledTeams = Array.from(
        Array(this.props.game.teams.numberOfTeams).keys()
      );
      while (unFilledTeams.length && unassignedPlayers.length) {
        const player = unassignedPlayers.pop();
        const team =
          unFilledTeams[Math.floor(Math.random() * unFilledTeams.length)];
        if (teamsData[team]) {
          teamsData[team].push(player);
        } else {
          teamsData[team] = [player];
        }
        unFilledTeams = unFilledTeams.filter(
          (unfilledTeam) => unfilledTeam !== team
        );
      }
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
