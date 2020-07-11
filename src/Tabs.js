import React from "react";
import "./Tabs.css";

function Tabs(props) {
  const tabList = props.tabs.tabsData.map((tabData, index) => {
    return (
      <Tab
        key={index}
        tabName={tabData.tabName}
        active={index === props.tabs.activeTabIndex}
        onClick={() => props.onClick(index)}
      ></Tab>
    );
  });

  const currentTabContent = props.tabs.tabsData[
    props.tabs.activeTabIndex
  ].renderTabContent();
  return (
    <div className="tabs">
      <header>
        <div className="tabsBar">{tabList}</div>
      </header>
      <div className="tabContent">{currentTabContent}</div>
    </div>
  );
}

export default Tabs;

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
