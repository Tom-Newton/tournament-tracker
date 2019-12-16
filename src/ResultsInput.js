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
  render() {
    const fixtures = this.props.game.gameData.map((round, roundIndex) => {
      const roundFixtures = round.roundData.map((subRound, subRoundIndex) => {
        return (
          <SubRound
            key={subRoundIndex}
            subRoundIndex={subRoundIndex}
            subRound={subRound}
            teams={this.props.game.teams}
            onChange={() => console.log("onChange")}
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
    const fixtures = this.props.subRound.subRoundData.fixtures.map((fixture, index) => {
      const teams = fixture.map((team, index) => {
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
        } catch(TypeError) {
          players = (
            <li>{`Team Number: ${index + 1}`}</li>
          );
        }
        return (
          <div
            key={index}
            className="team"
          >
            <ul
              className="teamList"
            >
              {players}
            </ul>
            <input>
            </input>
          </div>
        );
      });
      return (
        <div
          key={index}
          className="fixture"
        >
          <h5>{`Sub Round: ${this.props.subRoundIndex + 1} ${this.props.subRound.subRoundData.name}`}</h5>
          {teams}
        </div>
      );
    })
    return (
      <div>
        {fixtures}
      </div>
    );
  }
}
