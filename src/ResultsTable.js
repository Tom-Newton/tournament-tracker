import React from 'react';
import './ResultsTable.css';

class ResultsTable extends React.Component {
  buildLeaderboard() {
    let leaderboard = this.props.players.map(player => {
      return ({
        playerName: player.playerName,
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
      return (
        <tr
          key={index}
        >
          <td>{index}</td>
          <td>{entry.playerName}</td>
          <td>{entry.points}</td>
        </tr>
      );
    });
    if (leaderboard.length > 0) {
      return (
        <table>
          <tbody>
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