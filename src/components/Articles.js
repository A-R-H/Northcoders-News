import React, { Component } from "react";
import FilterSortButton from "./FilterSortButton";
import { getAllArticles } from "../api";
import { Link } from "react-router-dom";
import "./Articles.css";

class Articles extends Component {
  state = {
    filtering: "All",
    sorting: "comments",
    articles: []
  };

  componentDidMount() {
    getAllArticles().then(({ data }) => {
      const articles = data.articles;
      if (this.props.location.state) {
        this.setState({
          articles,
          filtering: this.props.location.state.filtering
        });
      } else {
        this.setState({
          articles
        });
      }
    });
  }
  render() {
    const { filtering, articles } = this.state;
    return (
      <div id="articlesunderbox">
        <div id="mainarticles">
          {articles.reduce((acc, article, i) => {
            // eslint-disable-next-line
            filtering === "All" || filtering === article.belongs_to.title
              ? acc.push(
                  <div key={`articlecard${i}`} className="card">
                    <div className="card-header">
                      <div className="articlesheaders">
                        <Link to={`/${article.created_by.username}`}>
                          {article.created_by.username}
                        </Link>{" "}
                        <cite>on {article.belongs_to.title}</cite>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="articlesbodies">
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
                  </div>
                )
              : null;
            return acc;
          }, [])}
        </div>
        <div id="sortbar">
          <div id="filterbuttonbox">
            <FilterSortButton
              whatFilter="All"
              handleFilterSortButton={this.handleFilterSortButton}
              filtering={filtering}
              type={"filtering"}
            />
            <FilterSortButton
              whatFilter="Coding"
              handleFilterSortButton={this.handleFilterSortButton}
              filtering={filtering}
              type={"filtering"}
            />
            <FilterSortButton
              whatFilter="Cooking"
              handleFilterSortButton={this.handleFilterSortButton}
              filtering={filtering}
              type={"filtering"}
            />
            <FilterSortButton
              whatFilter="Football"
              handleFilterSortButton={this.handleFilterSortButton}
              filtering={filtering}
              type={"filtering"}
            />
          </div>
        </div>
      </div>
    );
  }
  handleFilterSortButton = (type, filtering) => {
    this.setState({ [type]: filtering });
  };
}

export default Articles;
