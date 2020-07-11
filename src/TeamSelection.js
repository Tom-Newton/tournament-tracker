import React from "react";

class TeamSelection extends React.Component {
  updateTeam(sourceType, sourceRound, sourceSubRound, number, rank) {
    // TODO: Change this to a switch statement
    const team = this.props.team;
    if (sourceType) {
      team.sourceType = sourceType;
    }
    if (sourceRound || sourceRound === 0) {
      team.sourceRound = sourceRound;
    }
    if (sourceSubRound || sourceSubRound === 0) {
      team.sourceSubRound = sourceSubRound;
    }
    if (number || number === 0) {
      team.number = number;
    }
    if (rank || rank === 0) {
      team.rank = rank;
    }
    return team;
  }

  roundSelection() {
    const rounds = this.props.game.gameData
      .slice()
      .splice(0, this.props.roundNumber);
    const options = rounds.map((round, index) => {
      return (
        <option key={index} value={index}>
          {index + 1}
        </option>
      );
    });
    return (
      <div className="roundSelection">
        Source round:
        <select
          value={this.props.team.sourceRound}
          onChange={(event) =>
            this.props.onChange(
              this.updateTeam(
                null,
                parseInt(event.target.value),
                null,
                null,
                null
              )
            )
          }
        >
          <option value={undefined}>Select source round</option>
          {options}
        </select>
      </div>
    );
  }

  subRoundSelection() {
    const sourceRound = this.props.team.sourceRound;
    const options = this.props.game.gameData[sourceRound].roundData.map(
      (subRound, index) => {
        return (
          <option key={index} value={index}>
            {index + 1}
          </option>
        );
      }
    );
    return (
      <div className="subRoundSelection">
        Source sub round:
        <select
          value={this.props.team.sourceSubRound}
          onChange={(event) =>
            this.props.onChange(
              this.updateTeam(
                null,
                null,
                parseInt(event.target.value),
                null,
                null
              )
            )
          }
        >
          <option value={undefined}>Select source sub round</option>
          {options}
        </select>
      </div>
    );
  }

  numberSelection() {
    const options = Array.from(
      Array(this.props.game.teams.numberOfTeams).keys()
    ).map((index) => {
      return (
        <option key={index} value={index}>
          {index + 1}
        </option>
      );
    });
    return (
      <div className="numberSelection">
        Number:
        <select
          value={this.props.team.number}
          onChange={(event) =>
            this.props.onChange(
              this.updateTeam(
                null,
                null,
                null,
                parseInt(event.target.value),
                null
              )
            )
          }
        >
          <option value={undefined}>Select team</option>
          {options}
        </select>
      </div>
    );
  }

  rankSelection() {
    const sourceRound = this.props.team.sourceRound;
    const sourceSubRound = this.props.team.sourceSubRound;
    const numberOfRanks = this.props.game.gameData[sourceRound].roundData[
      sourceSubRound
    ].includedTeams.length;
    const options = Array.from(Array(numberOfRanks).keys()).map((index) => {
      return (
        <option key={index} value={index}>
          {index + 1}
        </option>
      );
    });
    return (
      <div className="rankSelection">
        Rank:
        <select
          value={this.props.team.rank}
          onChange={(event) =>
            this.props.onChange(
              this.updateTeam(
                null,
                null,
                null,
                null,
                parseInt(event.target.value)
              )
            )
          }
        >
          <option value={undefined}>Select team</option>
          {options}
        </select>
      </div>
    );
  }

  render() {
    const roundSelection = this.props.team.sourceType === "rank";
    const numberSelection = this.props.team.sourceType === "number";
    const subRoundSelection =
      roundSelection &&
      (this.props.team.sourceRound || this.props.team.sourceRound === 0);
    const rankSelection =
      subRoundSelection &&
      (this.props.team.sourceSubRound || this.props.team.sourceSubRound === 0);
    return (
      <div className="teamSelection">
        <div className="sourceTypeSelection">
          <h5>{`Select Team: ${this.props.teamNumber}`}</h5>
          Team source type:
          <select
            value={this.props.team.sourceType}
            onChange={(event) =>
              this.props.onChange(
                this.updateTeam(event.target.value, null, null, null)
              )
            }
          >
            <option value={undefined}>Select team source type</option>
            <option value="number">Team List</option>
            <option value="rank">Ranking</option>
          </select>
        </div>
        {roundSelection && this.roundSelection()}
        {subRoundSelection && this.subRoundSelection()}
        {numberSelection && this.numberSelection()}
        {rankSelection && this.rankSelection()}
      </div>
    );
  }
}

export default TeamSelection;
