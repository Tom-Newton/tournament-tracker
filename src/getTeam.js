import React from "react";


export function getTeam(teamReference, gameData) {
  if (teamReference.sourceType === "number") {
    return teamReference;
  } else if (teamReference.sourceType === "rank") {
    teamReference =
      gameData[teamReference.sourceRound].roundData[
        teamReference.sourceSubRound
      ].subRoundData.leaderboard[teamReference.rank].teamReference;
    return getTeam(teamReference, gameData);
  }
}

export default function displayTeamMembers(
  teamReference,
  gameData,
  teamsData,
  teamIndex
) {
  const team = getTeam(teamReference, gameData);
  let players;
  try {
    players = teamsData[team.number].map((player, index) => {
      return <li key={index}>{player}</li>;
    });
  } catch (TypeError) {
    players = <li>{`Team: ${teamIndex + 1}`}</li>;
  }
  return <ul className="teamList">{players}</ul>;
}
