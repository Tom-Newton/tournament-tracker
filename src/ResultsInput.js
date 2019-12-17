import React from 'react';
import Tabs from './Tabs.js';
import './ResultsInput.css';
import './App.css';

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
        renderTabContent: (() => {
          return (
            <Round
              game={game}
              players={this.props.players}
              onChange={(game) => this.props.onChange(this.editGames(game, index))}
            >
            </Round>
          );
        }),
      }
    });
    return {
      tabsData: tabsData,
      activeTabIndex: this.state.activeTabIndex,
    }
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
        <Tabs
          tabs={tabs}
          onClick={(index) => this.handleClick(index)}
        >
        </Tabs>
      );
    }
    return (
      <>
        {resultsInput}
      </>
    );
  }
}

export default ResultsInput;


class Round extends React.Component {
  editScore(value, teamIndex, fixtureIndex, subRoundIndex, roundIndex) {
    const game = this.props.game;
    game.gameData[roundIndex].roundData[subRoundIndex].subRoundData.fixtures[fixtureIndex][teamIndex].points = value
    return game
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
            onChange={(value, teamIndex, fixtureIndex) => this.props.onChange(this.editScore(value, teamIndex, fixtureIndex, subRoundIndex, roundIndex))}
          >
          </SubRound>
        );
      });
      return (
        <div
          key={roundIndex}
        >
          <h5>{`Round: ${roundIndex + 1}`}</h5>
          {roundFixtures}
        </div>
      );
    });
    return (
      <div>
        {fixtures}
      </div>
    );
  }
}

class SubRound extends React.Component {
  render() {
    const fixtures = this.props.subRound.subRoundData.fixtures.map((fixture, fixtureIndex) => {
      const teams = fixture.map((team, teamIndex) => {
        let players;
        try {
          if (team.team.sourceType === "number") {
            players = this.props.teams.teamsData[team.team.number].map((player, index) => {
              return (
                <li
                  key={index}
                >
                  {player}
                </li>
              );
            })
          } else if (team.team.sourceType === "rank") {
            // TODO: Implement this after designing subround leaderboard structure
            players = []
          } else {
            throw TypeError("team.sourceType is undefined. Catch and use placeholder")
          }
        } catch (TypeError) {
          players = (
            <li>{`Team Number: ${teamIndex + 1}`}</li>
          );
        }
        return (
          <div
            key={teamIndex}
            className="team"
          >
            <ul
              className="teamList"
            >
              {players}
            </ul>
            <input
              type="number"
              value={team.points}
              onChange={(event) => this.props.onChange(event.target.value, teamIndex, fixtureIndex)}
            >
            </input>
          </div>
        );
      });
      return (
        <div
          key={fixtureIndex}
          className="fixture"
        >
          {teams}
        </div>
      );
    })
    return (
      <div
        className="subRoundFixtures"
      >
        <h5>{`Sub Round: ${this.props.subRoundIndex + 1} ${this.props.subRound.subRoundData.name}`}</h5>
        {fixtures}
      </div>
    );
  }
}
