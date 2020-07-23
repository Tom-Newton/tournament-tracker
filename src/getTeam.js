export default function getTeam(teamReference, gameData) {
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
