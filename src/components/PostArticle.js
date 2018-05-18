import React, { Component } from "react";
import { postArticle, getUserByUsername } from "../api";
import "./PostArticle.css";

class PostArticle extends Component {
  state = {
    title: "",
    body: "",
    topic: "coding",
    postSuccess: false,
    currentUser: null
  };

  componentDidMount() {
    let { currentUser } = this.props;
    getUserByUsername(currentUser).then(userDB => {
      currentUser = userDB.data.user;
      this.setState({ currentUser });
    });
  }

  render() {
    const { topic, title, body } = this.state;
    return (
      <div id="postpagebox">
        <div id="formbox">
          <div className="form-group row">
            <label htmlFor="inputTitle3" className="col-sm-2 col-form-label">
              Title
            </label>
            <div className="col-sm-10">
              <input
                value={title}
                onChange={event => this.handleFormInput(event, "title")}
                type="text"
                className="form-control"
                id="inputTitle3"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="exampleFormControlTextarea1">Content</label>
            <textarea
              value={body}
              onChange={event => this.handleFormInput(event, "body")}
              className="form-control bodyinput"
              id="exampleFormControlTextarea1"
              rows="3"
            />
          </div>
          <fieldset className="form-group">
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Topic</label>
              <select
                value={topic.slice(0, 1).toUpperCase() + topic.slice(1)}
                onChange={this.handleTopicSelect}
                className="form-control"
                id="exampleFormControlSelect1"
              >
                <option>Coding</option>
                <option>Cooking</option>
                <option>Football</option>
              </select>
            </div>
          </fieldset>

          <div className="form-group row">
            <div className="col-sm-10">
              <button
                ref="submit"
                onClick={this.handleSubmit}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleFormInput = (event, form) => {
    this.setState({ [form]: event.target.value });
  };

  handleTopicSelect = event => {
    this.setState({ topic: event.target.value.toLowerCase() });
  };

  handleSubmit = () => {
    const { title, body, topic, currentUser } = this.state;
    if (title && body) {
      this.refs.submit.setAttribute("disabled", "disabled");
      postArticle(title, body, topic, currentUser._id).then(({ data }) => {
        this.props.history.push(`/articles/${data.article._id}`);
      });
    }
  };
}

export default PostArticle;
