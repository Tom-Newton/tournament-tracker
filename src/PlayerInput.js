import React from "react";
import "./PlayerInput.css";

class PlayerInput extends React.Component {
  editPlayers(value, index) {
    const players = this.props.players.slice();
    if (value) {
      const player = players[index];
      if (player) {
        player.playerName = value;
      } else {
        players[index] = {
          playerName: value,
          excludedGames: new Set(),
        };
      }
    } else {
      players.splice(index, 1);
    }
    return players;
  }

  render() {
    // TODO: Probably shouldn't use index for the key here so rerendering is efficient
    const players = this.props.players.slice();
    players.push({
      playerName: "",
      excludedGames: new Set(),
    });
    const playerEntries = players.map((player, index) => {
      return (
        <PlayerEntry
          key={index}
          player={player.playerName}
          onChange={(value) =>
            this.props.onChange(this.editPlayers(value, index))
          }
        ></PlayerEntry>
      );
    });
    return <ol className="playerInput">{playerEntries}</ol>;
  }
}

export default PlayerInput;

function PlayerEntry(props) {
  const className = `playerEntry${props.player ? "" : " empty"}`;
  return (
    <li className={className}>
      <input
        type="text"
        value={props.player}
        placeholder="Click to add new player"
        onChange={(event) => props.onChange(event.target.value)}
      ></input>
    </li>
  );
}
