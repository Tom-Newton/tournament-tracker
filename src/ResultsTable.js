import React from 'react';
import './ResultsTable.css';

class ResultsTable extends React.Component {
  buildLeaderboard() {
    let leaderboard = this.props.players.map(player => {
      return ({
        playerName: player.playerName,
        gamePoints: {},
        points: 0,
      });
    });
    this.props.games.forEach(game => {
      game.winners.forEach(winner => {
        let team = winner.team;
        try {
          if (team.sourceType === "rank") {
            team = game.gameData[team.sourceRound].roundData[team.sourceSubRound].subRoundData.leaderboard[team.rank].getTeam()
          }
          const teamMembers = game.teams.teamsData[team.number]
          teamMembers.forEach(playerName => {
            const entry = leaderboard.find(entry1 => entry1.playerName === playerName)
            entry.gamePoints[game.gameName] = winner.points;
            entry.points += winner.points;
          });
        } catch(TypeError) {}
      });
    });
    leaderboard.sort((entry1, entry2) => entry2.points - entry1.points);
    return leaderboard;
  }
  render() {
    const leaderboard = this.buildLeaderboard().map((entry, index) => {
      const gamePoints = this.props.games.map(game => {
        return (
          <td>{entry.gamePoints[game.gameName]}</td>
        );
      });
      return (
        <tr
          key={index}
        >
          <td>{index + 1}</td>
          <td>{entry.playerName}</td>
          {gamePoints}
          <td>{entry.points}</td>
        </tr>
      );
    });
    const gameNames = this.props.games.map(game => {
      return (
        <th>{game.gameName}</th>
      );
    });
    if (leaderboard.length > 0) {
      return (
        <table>
          <tbody>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              {gameNames}
              <th>Points</th>
            </tr>
            {leaderboard}
          </tbody>
        </table>
      );
    } else {
      return (
        <div>
          <h3>No players have been added. Add some players in the Player Input tab</h3>
        </div>
      )
    }
  }
}

export default ResultsTable;