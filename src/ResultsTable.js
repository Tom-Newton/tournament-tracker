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
        console.log(team)
        console.log(game.teams)
        if (team.sourceType) {
          if (team.sourceType === "rank") {
            team = game.gameData[team.sourceRound].roundData[team.sourceSubRound].subRoundData.leaderboard[team.rank].getTeam()
          }
          const teamMembers = game.teams.teamsData[team.number]
          if (teamMembers) {
            teamMembers.forEach(playerName => {
              const entry = leaderboard.find(entry1 => entry1.playerName === playerName)
              entry.points += winner.points;
            });
          }
        }
      });
    });
    leaderboard.sort((entry1, entry2) => entry2.points - entry1.points);
    console.log(leaderboard);
    return leaderboard;
  }
  render() {
    const leaderboard = this.buildLeaderboard();
    return (
      <div>empty</div>
    );
  }
}

export default ResultsTable;