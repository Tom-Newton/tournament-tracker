import React from "react";
import getTeam from "./getTeam.js";

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
