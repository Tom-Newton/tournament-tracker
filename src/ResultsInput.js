import React from "react";
import Tabs from "./Tabs.js";
import displayTeamMembers from "./displayTeamMembers.js";
import SubRoundLeaderboard from "./SubRoundLeaderboard.js";
import "./ResultsInput.css";
import "./App.css";
import { isEqual } from "lodash";

class ResultsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  buildTabs() {
    const tabsData = this.props.games.map((game, index) => {
      return {
        tabName: game.gameName,
        renderTabContent: () => {
          return (
            <Round
              game={game}
              players={this.props.players}
              onChange={(game) =>
                this.props.onChange(this.editGames(game, index))
              }
            ></Round>
          );
        },
      };
    });
    return {
      tabsData: tabsData,
      activeTabIndex: this.state.activeTabIndex,
    };
  }

  handleClick(index) {
    this.setState({ activeTabIndex: index });
  }

  editGames(game, index) {
    const games = this.props.games.slice();
    games[index] = game;
    return games;
  }

  render() {
    let resultsInput;
    let tabs = this.buildTabs(this.props.games);
    if (tabs.tabsData.length === 0) {
      resultsInput = (
        <div>
          <h3>No games have been added. Add a game in the Game Input tab</h3>
        </div>
      );
    } else {
      resultsInput = (
        <Tabs tabs={tabs} onClick={(index) => this.handleClick(index)}></Tabs>
      );
    }
    return <>{resultsInput}</>;
  }
}

export default ResultsInput;

class Round extends React.Component {
  getEntry(subRoundData, team) {
    return subRoundData.leaderboard.find((entry) =>
      isEqual(entry.teamReference, team.teamReference)
    );
  }

  editScore(value, teamIndex, fixtureIndex, subRoundIndex, roundIndex) {
    const game = this.props.game;
    const subRoundData =
      game.gameData[roundIndex].roundData[subRoundIndex].subRoundData;
    const teams = subRoundData.fixtures[fixtureIndex];

    teams[teamIndex].points = value;

    // Update subRound leaderboard
    if (subRoundData.type === "roundRobin") {
      const entry0 = this.getEntry(subRoundData, teams[0]);
      const entry1 = this.getEntry(subRoundData, teams[1]);

      entry0.points -= entry0.fixtures[fixtureIndex].points;
      entry0.pointDifference -= entry0.fixtures[fixtureIndex].pointDifference;
      entry1.points -= entry1.fixtures[fixtureIndex].points;
      entry1.pointDifference -= entry1.fixtures[fixtureIndex].pointDifference;

      const pointDifference = teams[0].points - teams[1].points;
      entry0.pointDifference += pointDifference;
      entry0.fixtures[fixtureIndex].pointDifference = pointDifference;
      entry1.pointDifference -= pointDifference;
      entry1.fixtures[fixtureIndex].pointDifference = -pointDifference;

      if (pointDifference > 0) {
        entry0.points += 3;
        entry0.fixtures[fixtureIndex].points = 3;
        entry1.fixtures[fixtureIndex].points = 0;
      } else if (pointDifference === 0) {
        entry0.points += 1;
        entry0.fixtures[fixtureIndex].points = 1;
        entry1.points += 1;
        entry1.fixtures[fixtureIndex].points = 1;
      } else {
        entry0.fixtures[fixtureIndex].points = 0;
        entry1.points += 3;
        entry1.fixtures[fixtureIndex].points = 3;
      }
    } else if (subRoundData.type === "headToHead") {
      subRoundData.leaderboard = subRoundData.fixtures[0].slice();
    }
    subRoundData.leaderboard.sort((sort_entry0, sort_entry1) => {
      const pointsDifference = sort_entry0.points - sort_entry1.points;
      if (pointsDifference === 0) {
        const pointDifferenceDifference =
          sort_entry0.pointDifference - sort_entry1.pointDifference;
        return -pointDifferenceDifference;
      } else {
        return -pointsDifference;
      }
    });
    return game;
  }

  render() {
    const fixtures = this.props.game.gameData.map((round, roundIndex) => {
      const roundFixtures = round.roundData.map((subRound, subRoundIndex) => {
        return (
          <SubRound
            key={subRoundIndex}
            subRoundIndex={subRoundIndex}
            subRound={subRound}
            teams={this.props.game.teams}
            gameData={this.props.game.gameData}
            onChange={(value, teamIndex, fixtureIndex) =>
              this.props.onChange(
                this.editScore(
                  value,
                  teamIndex,
                  fixtureIndex,
                  subRoundIndex,
                  roundIndex
                )
              )
            }
          ></SubRound>
        );
      });
      return (
        <div key={roundIndex}>
          <h5>{`Round: ${roundIndex + 1}`}</h5>
          {roundFixtures}
        </div>
      );
    });
    return <div>{fixtures}</div>;
  }
}

class SubRound extends React.Component {
  render() {
    const fixtures = this.props.subRound.subRoundData.fixtures.map(
      (fixture, fixtureIndex) => {
        const teams = fixture.map((fixtureTeam, teamIndex) => {
          return (
            <div key={teamIndex} className="team">
              {displayTeamMembers(
                fixtureTeam.teamReference,
                this.props.gameData,
                this.props.teams.teamsData,
                teamIndex
              )}
              <input
                type="number"
                value={fixtureTeam.points}
                onChange={(event) =>
                  this.props.onChange(
                    parseInt(event.target.value),
                    teamIndex,
                    fixtureIndex
                  )
                }
              ></input>
            </div>
          );
        });
        return (
          <div key={fixtureIndex} className="fixture">
            {teams}
          </div>
        );
      }
    );
    return (
      <div className="subRoundFixtures">
        <h5>{`Sub Round: ${this.props.subRoundIndex + 1} ${
          this.props.subRound.subRoundData.name
        }`}</h5>
        {fixtures}
        <SubRoundLeaderboard
          subRoundData={this.props.subRound.subRoundData}
          gameData={this.props.gameData}
          teamsData={this.props.teams.teamsData}
        ></SubRoundLeaderboard>
      </div>
    );
  }
}
