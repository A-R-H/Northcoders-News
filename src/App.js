import React, { Component } from "react";
import Heading from "./components/Heading";
import { Route, Switch, Redirect } from "react-router-dom";
import UserPage from "./components/UserPage";
import Articles from "./components/Articles";
import ArticlePage from "./components/ArticlePage";
import PostArticle from "./components/PostArticle";
import BadRoute from "./components/tools/BadRoute";
import "./App.css";

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
            path="/post"
            render={props => (
              <PostArticle {...props} currentUser={currentUser} />
            )}
          />
          <Route
            exact
            path="/articles/:id"
            render={props => (
              <ArticlePage {...props} currentUser={currentUser} />
            )}
          />
          <Route
            exact
            path="/articles"
            render={props => <Articles {...props} />}
          />
          <Route
            exact
            path="/:username"
            render={props => <UserPage {...props} />}
          />
          <Route exact path="/" render={() => <Redirect to="/articles" />} />
          <Route path="/" component={BadRoute} />
        </Switch>
      </div>
    );
  }
}

export default App;
