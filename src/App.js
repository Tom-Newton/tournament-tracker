import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: {
        tabsData: [
          {
            tabName: "Player Input",
            renderTabContent: () => <PlayerInput></PlayerInput>,
          }, {
            tabName: "Game Input",
            renderTabContent: () => <PlayerInput></PlayerInput>,
          }, {
            tabName: "Results Input",
            renderTabContent: () => <PlayerInput></PlayerInput>,
          }, {
            tabName: "Results Table",
            renderTabContent: () => <PlayerInput></PlayerInput>,
          },
        ],
        activeTabIndex: 0,
      },
      players: [],
    };
  }

  handleClick(index) {
    this.setState((previousState, props) => {
      return previousState.tabs.activeTabIndex = index;
    })
  }

  render() {
    return (
      <div className="Apptest1">
        <Tabs
          tabs={this.state.tabs}
          onClick={(index) => this.handleClick(index)}
        >
        </Tabs>
      </div>
    );
  }
}

export default App;

function PlayerInput(props) {
  console.log("render PlayerInputContent")
  const playersList = null;
  return (
    <ol>{playersList}</ol>
  );
}

function Tabs(props) {
  const tabList = props.tabs.tabsData.map((tabData, index) => {
    return (
      <Tab
        key={index}
        tabName={tabData.tabName}
        active={index === props.tabs.activeTabIndex}
        onClick={() => props.onClick(index)}
      >
      </Tab>
    );
  });

  const currentTabContent = props.tabs.tabsData[props.tabs.activeTabIndex].renderTabContent()
  return (
    <div className="tabs">
      <header>
        <div className="tabsBar">
          {tabList}
        </div>
      </header>
      <div className="tabContent">
        {currentTabContent}
      </div>
    </div>
  );
}

function Tab(props) {
  return (
    <button
      className={`tab ${props.active ? "active" : ""}`}
      onClick={() => props.onClick()}
    >
      {props.tabName}
    </button>
  );
}
