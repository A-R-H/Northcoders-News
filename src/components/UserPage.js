import React, { Component } from "react";
import "./UserPage.css";
import axios from "axios";

class UserPage extends Component {
  state = {
    user: {
      _id: "",
      username: "",
      name: "",
      avatar_url: ""
    },
    usersArticles: []
  };

  componentDidMount() {
    const user = this.props.match.params.username;
    axios
      .get(`https://northcoders-news-back.herokuapp.com/api/users/${user}`)
      .then(userDB => {
        return Promise.all([
          axios.get("https://northcoders-news-back.herokuapp.com/api/articles"),
          userDB.data.user
        ]).then(([{ data: articles }, user]) => {
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
        });
      });
  }

  render() {
    const { username, name, avatar_url } = this.state.user;
    const { usersArticles } = this.state;
    const userProps = usersArticles.reduce((props, article) => {
      props += article.votes;
      return props;
    }, 0);
    const interestString = this.findInterests(usersArticles);
    return (
      <div id="userpagebox">
        <div id="otherusers">Other Users</div>
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
        <div id="userarticles">User Articles</div>
      </div>
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
