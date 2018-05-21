import React, { Component } from "react";
import { getAllArticles, getUserByUsername } from "../api";
import { Link } from "react-router-dom";
import BadRoute from "./tools/BadRoute";
import Loading from "./tools/Loading";
import "./UserPage.css";

class UserPage extends Component {
  state = {
    user: {
      _id: "",
      username: "",
      name: "",
      avatar_url: ""
    },
    usersArticles: [],
    userNotFound: false
  };

  componentDidMount() {
    const user = this.props.match.params.username;
    getUserByUsername(user)
      .then(userDB => {
        return Promise.all([getAllArticles(), userDB.data.user]).then(
          ([{ data: articles }, user]) => {
            const { _id, username, name, avatar_url } = user;
            const usersArticles = articles.articles.filter(article => {
              return article.created_by._id === _id;
            });
            this.setState({
              user: {
                _id,
                username,
                name,
                avatar_url
              },
              usersArticles
            });
          }
        );
      })
      .catch(err => {
        this.setState({ userNotFound: true });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const user = this.props.location.pathname;
    if (prevProps.location.pathname !== user) {
      getUserByUsername(user)
        .then(userDB => {
          return Promise.all([getAllArticles(), userDB.data.user]).then(
            ([{ data: articles }, user]) => {
              const { _id, username, name, avatar_url } = user;
              const usersArticles = articles.articles.filter(article => {
                return article.created_by._id === _id;
              });
              this.setState({
                user: {
                  _id,
                  username,
                  name,
                  avatar_url
                },
                usersArticles
              });
            }
          );
        })
        .catch(err => {
          this.setState({ userNotFound: true });
        });
    }
  }

  render() {
    const { username, name, avatar_url } = this.state.user;
    const { usersArticles, userNotFound } = this.state;
    const userProps = usersArticles.reduce((props, article) => {
      props += article.votes;
      return props;
    }, 0);
    const interestString = this.findInterests(usersArticles);
    return (
      <React.Fragment>
        {!userNotFound &&
          name && (
            <div id="userpagebox">
              <div id="userinfobox">
                <div id="userpicinfo">
                  <div id="userpicinfopicbox">
                    <img alt="profile pic" src={avatar_url} />
                  </div>
                  <div id="communityprops">Community Props : {userProps}</div>
                </div>
                <div id="usertextinfo">
                  <h1>{username}</h1>
                  <p>{name}</p>
                  <p>Articles Written: {usersArticles.length}</p>
                  <h3>Interests</h3>
                  <p>{interestString}</p>
                </div>
              </div>
              <div id="userarticles">
                <div id="userarticlesheader">
                  <h2>Articles Written</h2>
                </div>
                {usersArticles.map((article, i) => {
                  return (
                    <div key={`articlecard${i}`} className="card">
                      <div className="card-header">
                        {" "}
                        <Link
                          to={{
                            pathname: "/articles",
                            state: { filtering: article.belongs_to.title }
                          }}
                        >
                          {article.belongs_to.title}
                        </Link>
                      </div>
                      <div className="card-body">
                        <blockquote className="blockquote mb-0">
                          <Link to={`/articles/${article._id}`}>
                            {" "}
                            <p>{article.title}</p>
                          </Link>
                          <footer className="blockquote-footer">
                            <cite>Comments:</cite> {article.comments}
                            <cite> Props:</cite> {article.votes}
                          </footer>
                        </blockquote>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        {!userNotFound && !name && <Loading />}
        {userNotFound && <BadRoute missing={"user"} />}
      </React.Fragment>
    );
  }

  findInterests = articles => {
    const interests = articles.reduce((topics, article) => {
      const interest = article.belongs_to.title;
      !topics[interest] ? (topics[interest] = 1) : topics[interest]++;
      return topics;
    }, {});
    const interestArr = [];
    for (let interest in interests) {
      interestArr.push([interest, interests[interest]]);
    }
    interestArr.sort((a, b) => {
      return +b[1] - +a[1];
    });
    return interestArr.reduce((string, interest, i) => {
      string +=
        i !== interestArr.length - 1
          ? `${interest[0]} (${interest[1]} articles written), `
          : `${interest[0]} (${interest[1]} articles written)`;
      return string;
    }, "");
  };
}

export default UserPage;
