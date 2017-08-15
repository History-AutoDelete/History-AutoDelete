import React, {Component} from 'react';
import {connect} from 'react-redux';
import SideBar from './components/SideBar';
import Welcome from './components/Welcome';
import HistorySettings from './components/HistorySettings';
import Expressions from './components/Expressions';
import About from './components/About';

class App extends Component {
  state = {
    activeTab: "tabWelcome"
  }


  switchTabs(newActiveTab) {
    this.setState({activeTab: newActiveTab});
  }

  render() {
    const { activeTab } = this.state;
    const welcomeStyle = activeTab === "tabWelcome" ? styles.visible : styles.invisible;
    const settingsStyle = activeTab === "tabSettings" ? styles.visible : styles.invisible;
    const expressionsStyle = activeTab === "tabExpressionList" ? styles.visible : styles.invisible;
    const aboutStyle = activeTab === "tabAbout" ? styles.visible : styles.invisible;
    return (
      <div id="layout">
        <SideBar switchTabs={(tab) => this.switchTabs(tab)} activeTab={activeTab}/>
        <div className="container">
          <Welcome style={welcomeStyle} />
          <HistorySettings style={settingsStyle} />
          <Expressions style={expressionsStyle} />
          <About style={aboutStyle} />
        </div>
      </div>
    );
  }
}

const styles = {
  visible: {
    display: 'block'
  },
  invisible: {
    display: 'none'
  }
}


export default App;
