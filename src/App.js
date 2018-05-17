import React, { Component } from "react";
import "./App.css";
import Heading from "./components/Heading";
import { Route, Switch } from "react-router-dom";
import UserPage from "./components/UserPage";
import Articles from "./components/Articles";
import ArticlePage from "./components/ArticlePage";

class App extends Component {
  state = {
    currentUser: "tickle122"
  };
  render() {
    const { currentUser } = this.state;
    return (
      <div id="appbox">
        <Heading currentUser={currentUser} />
        <Switch>
          <Route
            exact
            path="/articles/:id"
            render={props => (
              <ArticlePage {...props} currentUser={currentUser} />
            )}
          />
          <Route exact path="/articles" component={Articles} />
          <Route
            exact
            path="/:username"
            render={props => <UserPage {...props} />}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
