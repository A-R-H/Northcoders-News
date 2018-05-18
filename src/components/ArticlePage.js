import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  getArticleById,
  getCommentsByArticleId,
  getUserByUsername,
  postComment,
  voteOnArticle,
  voteOnComment
} from "../api";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import Arrow from "react-svg-arrow";
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
      const userVoted = localStorage.getItem(`userVoted${article._id}`);
      comments = comments.map(comment => {
        const commentVoted = localStorage.getItem(
          `comment.userVoted${comment._id}`
        );
        if (commentVoted) {
          comment.userVoted = commentVoted;
        }
        return comment;
      });
      this.setState({
        article: article.article,
        comments,
        currentUser: user.user,
        userVoted
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
    const {
      article,
      comments,
      userComment,
      currentUser,
      userVoted
    } = this.state;
    const rightArrow = React.createElement(Arrow, {
      size: 25,
      color: "white",
      direction: "right",
      borderWidth: 5,
      borderColor: "black"
    });
    const downArrow = React.createElement(Arrow, {
      size: 25,
      color: "white",
      direction: "bottom",
      borderWidth: 5,
      borderColor: "black"
    });
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
            <div id="proparrowbox">
              <div id="joinconv">Join the conversation!</div>
              <div id="rightarrows">
                {rightArrow}
                {rightArrow}
                <div id="articlepageprops">
                  <div>
                    <h1>{article.votes}</h1>
                    <p>Community props passed</p>
                  </div>
                  <div id="articlepagepropbtns">
                    <button
                      onClick={() => this.handleArticleVote("up")}
                      id="plusplus"
                      className={userVoted === "up" ? "votedup" : ""}
                    >
                      ++
                    </button>
                    <span>/</span>
                    <button
                      onClick={() => this.handleArticleVote("down")}
                      id="minusminus"
                      className={userVoted === "down" ? "voteddown" : ""}
                    >
                      --
                    </button>
                  </div>
                </div>
              </div>
              <div id="downarrows">
                {downArrow}
                {downArrow}
              </div>
            </div>
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
                    <div id="commentflex">
                      <div id="commentpropbtns">
                        <div id="commentvotes">{comment.votes}</div>
                        <div>
                          <button
                            onClick={() =>
                              this.handleCommentVote(comment._id, "up")
                            }
                            id="plusplus"
                            className={
                              comment.userVoted === "up" ? "votedup" : ""
                            }
                          >
                            ++
                          </button>
                          <span>/</span>
                          <button
                            onClick={() =>
                              this.handleCommentVote(comment._id, "down")
                            }
                            id="minusminus"
                            className={
                              comment.userVoted === "down" ? "voteddown" : ""
                            }
                          >
                            --
                          </button>
                        </div>
                      </div>
                      <div id="commenttext">
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
                      </div>
                      <ReactTooltip />
                    </div>
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
  handleArticleVote = vote => {
    const { article, userVoted } = this.state;
    if (!userVoted) {
      voteOnArticle(article._id, vote).then(({ data }) => {
        article.votes = data.article.votes;
        localStorage.setItem(`userVoted${article._id}`, vote);
        this.setState({ article, userVoted: vote });
      });
    } else {
      if (vote === userVoted) {
        vote = vote === "up" ? "down" : "up";
        voteOnArticle(article._id, vote).then(({ data }) => {
          article.votes = data.article.votes;
          localStorage.setItem(`userVoted${article._id}`, null);
          this.setState({ article, userVoted: null });
        });
      } else {
        Promise.all([
          voteOnArticle(article._id, vote),
          voteOnArticle(article._id, vote)
        ]).then(([vote1, vote2]) => {
          article.votes =
            vote === "up"
              ? Math.max(vote1.data.article.votes, vote2.data.article.votes)
              : Math.min(vote1.data.article.votes, vote2.data.article.votes);
          localStorage.setItem(`userVoted${article._id}`, vote);
          this.setState({ article, userVoted: vote });
        });
      }
    }
  };

  handleCommentVote = (comment_id, vote) => {
    const { comments } = this.state;
    const comment = comments.find(comment => {
      return comment._id === comment_id;
    });
    if (!comment.userVoted) {
      voteOnComment(comment._id, vote).then(({ data }) => {
        comment.votes = data.comment.votes;
        comment.userVoted = vote;
        localStorage.setItem(`comment.userVoted${comment._id}`, vote);
        this.setState({
          comments: comments.map(oldComment => {
            if (oldComment._id === comment_id) {
              return comment;
            } else return oldComment;
          })
        });
      });
    } else {
      if (vote === comment.userVoted) {
        vote = vote === "up" ? "down" : "up";
        voteOnComment(comment._id, vote).then(({ data }) => {
          comment.votes = data.comment.votes;
          comment.userVoted = null;
          localStorage.setItem(`comment.userVoted${comment._id}`, null);
          this.setState({
            comments: comments.map(oldComment => {
              if (oldComment._id === comment_id) {
                return comment;
              } else return oldComment;
            })
          });
        });
      } else {
        Promise.all([
          voteOnComment(comment._id, vote),
          voteOnComment(comment._id, vote)
        ]).then(([vote1, vote2]) => {
          comment.votes =
            vote === "up"
              ? Math.max(vote1.data.comment.votes, vote2.data.comment.votes)
              : Math.min(vote1.data.comment.votes, vote2.data.comment.votes);
          comment.userVoted = vote;
          localStorage.setItem(`comment.userVoted${comment._id}`, vote);
          this.setState({
            comments: comments.map(oldComment => {
              if (oldComment._id === comment_id) {
                return comment;
              } else return oldComment;
            })
          });
        });
      }
    }
  };
}

export default ArticlePage;
