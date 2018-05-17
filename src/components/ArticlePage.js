import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  getArticleById,
  getCommentsByArticleId,
  getUserByUsername,
  postComment
} from "../api";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import "./ArticlePage.css";

class ArticlePage extends Component {
  state = {
    currentUser: null,
    article: null,
    comments: [],
    userComment: "",
    userVoted: null
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    const { currentUser } = this.props;
    return Promise.all([
      getArticleById(id),
      getCommentsByArticleId(id),
      getUserByUsername(currentUser)
    ]).then(([{ data: article }, { data: comments }, { data: user }]) => {
      comments = comments.comments.sort((a, b) => {
        return +b.created_at - +a.created_at;
      });
      this.setState({
        article: article.article,
        comments,
        currentUser: user.user
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { id } = this.props.match.params;
    if (prevState.userComment) {
      getCommentsByArticleId(id).then(({ data }) => {
        const comments = data.comments.sort((a, b) => {
          return +b.created_at - +a.created_at;
        });
        this.setState({ comments });
      });
    }
  }

  render() {
    const { article, comments, userComment, currentUser } = this.state;
    return (
      <div id="articlepagebox">
        {article && (
          <div id="articlepage">
            <div id="avatarbox">
              <img src={article.created_by.avatar_url} alt="Author" />
            </div>
            <h3>
              {article.created_by.username} <cite>presents:</cite>
            </h3>
            <h1>{article.title}</h1>
            <p>{article.body}</p>
            <div id="joinconv">Join the conversation!</div>
            <div id="commentsbox">
              <div id="sendcommentbox" className="input-group mb-3">
                <div className="input-group-prepend">
                  <div>
                    {currentUser && (
                      <img id="thumb" alt="You!" src={currentUser.avatar_url} />
                    )}
                    <button
                      onClick={this.handleSendBtnClick}
                      className="btn btn-outline-secondary"
                      type="button"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <input
                  value={userComment}
                  onChange={this.handleFormInput}
                  onKeyUp={this.handleFormEnter}
                  type="text"
                  className="form-control"
                  placeholder="Have your say..."
                  aria-label=""
                  aria-describedby="basic-addon1"
                />
              </div>
              {!comments.length && (
                <div>No comments yet, why not share your thoughts...</div>
              )}
              {comments.map((comment, i) => {
                return (
                  <div
                    key={`comment${i}`}
                    className={`singlecomment ${
                      i % 2 === 0 ? "oddcomment" : "evencomment"
                    }`}
                  >
                    <p>
                      <cite>
                        Posted by{" "}
                        <Link to={`/${comment.created_by.username}`}>
                          {comment.created_by.username}
                        </Link>
                      </cite>{" "}
                      -{" "}
                      <span
                        data-tip={moment(comment.created_at).format(
                          "Do MMMM, h:mm:ss a"
                        )}
                      >
                        {moment(comment.created_at).fromNow()}
                      </span>
                    </p>
                    <p>{comment.body}</p>
                    <ReactTooltip />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  handleFormEnter = event => {
    if (event.key === "Enter") {
      const { userComment, article, currentUser } = this.state;
      if (userComment) {
        postComment(userComment, article._id, currentUser._id).then(res => {
          this.setState({ userComment: "" });
        });
      }
    }
  };

  handleFormInput = event => {
    this.setState({ userComment: event.target.value });
  };

  handleSendBtnClick = event => {
    const { userComment, article, currentUser } = this.state;
    if (userComment) {
      postComment(userComment, article._id, currentUser._id).then(res => {
        this.setState({ userComment: "" });
      });
    }
  };
}

export default ArticlePage;
