import React from "react";
import displayTeamMembers from "./getTeam";

function SubRoundLeaderboard(props) {
  return (
    <div className="subRoundLeaderboard">
      <h3>Leaderboard</h3>
      <table>
        <tbody>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Points</th>
            {props.subRoundData.type === "roundRobin" ? (
              <th>Point Difference</th>
            ) : null}
          </tr>
          {props.subRoundData.leaderboard.map((entry, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {displayTeamMembers(
                    entry.teamReference,
                    props.gameData,
                    props.teamsData,
                    index
                  )}
                </td>
                <td>{entry.points}</td>
                {props.subRoundData.type === "roundRobin" ? (
                  <td>{entry.pointDifference}</td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SubRoundLeaderboard;
