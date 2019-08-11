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

  buildTabs () {
    const tabsData = this.props.games.map((game, index) => {
      return {
        tabName: game.gameName,
        renderTabContent: (() => {
          return (
            <Fixtures
              game={game}
              players={this.props.players}
              onChange={(game) => this.props.onChange(this.editGames(game, index))}
            >
            </Fixtures>
          );
        }),
      }
    });
    return {
      tabsData: tabsData,
      activeTabIndex: this.state.activeTabIndex,
    }
  }

  handleClick (index) {
    this.setState({activeTabIndex: index});
  }

  editGames (game, index) {
    const games = this.props.games.slice();
    games[index] = game;
    return games;
  }

  render () {
    return (
      <Tabs
        tabs={this.buildTabs(this.props.games)}
        onClick={(index) => this.handleClick(index)}
      >
      </Tabs>
    );
  }
}

export default ResultsInput;


class Fixtures extends React.Component {
  render () {
    const fixtures = this.props.game.gameData.map((round, roundIndex) => {
      const roundFixtures = round.roundData.map((subRound, subRoundIndex) => {
        return (
          <Fixture
            key={subRoundIndex}
            subRound={subRound}
            onChange={() => console.log("onChange")}
          >
          </Fixture>
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
        {`Enter results for: ${this.props.game.gameName}`}
        {fixtures}
      </div>
    );
  }
}

class Fixture extends React.Component {
  render () {
    return (
      <div>
        fixture
      </div>
    );
  }
}
