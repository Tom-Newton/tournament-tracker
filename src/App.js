import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: {
        tabNames: [
          "Player Input",
          "Round Input",
          "Results Input",
          "Results Table",
        ],
        activeTabIndex: 0,
      }
    };
  }

  handleClick(index) {
    this.setState((previousState, props) => {
      return previousState.tabs.activeTabIndex = index;
    })
  }

  render() {
    return (
      <div className="App3">
        <header className="App-header">

        <TabsBar tabs={this.state.tabs} onClick={(index) => this.handleClick(index)}>
        </TabsBar>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          test
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

function TabsBar(props) {
  const tabs = props.tabs;
  const tabsBar = tabs.tabNames.map((tabName, index) => {
    return (
      <Tab
        key={tabName}
        tabName={tabName}
        active={index === tabs.activeTabIndex}
        onClick={() => props.onClick(index)}
      >
      </Tab>
    );
  });
  return (
    <div className="tabsBar">
      {tabsBar}
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
