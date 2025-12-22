export default function getTeam(teamReference, gameData) {
  if (teamReference.sourceType === "number") {
    return teamReference;
  } else if (teamReference.sourceType === "rank") {
    if (teamReference.rank == null) {
      return null
    }
    const subRoundData = gameData[teamReference.sourceRound].roundData[
      teamReference.sourceSubRound
    ].subRoundData
    teamReference = subRoundData.leaderboard[teamReference.rank].teamReference;
    return getTeam(teamReference, gameData);
  }
}
