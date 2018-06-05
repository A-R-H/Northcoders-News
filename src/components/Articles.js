import React, { Component } from "react";
import FilterSortButton from "./FilterSortButton";
import { getAllArticles } from "../api";
import { Link } from "react-router-dom";
import "./Articles.css";
import Loading from "./tools/Loading";

class Articles extends Component {
  state = {
    filtering: "",
    sorting: "Comments",
    articles: []
  };

  componentDidMount() {
    getAllArticles().then(({ data }) => {
      const articles = data.articles;
      const headPath = this.props.location.state;
      if (headPath) {
        const { filtering } = this.props.location.state;
        this.props.location.state = null;
        this.setState({
          articles,
          filtering
        });
      } else {
        this.setState({
          articles,
          filtering: "All"
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const headPath = this.props.location.state;
    if (headPath) {
      const headSlice = this.props.location.state.filtering.slice();
      this.props.location.state = null;
      this.setState({
        filtering: headSlice
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.location.state) {
      if (nextProps.location.state.filtering === this.state.filtering)
        return false;
      else return true;
    }
    if (
      nextState.filtering === this.state.filtering &&
      nextState.sorting === this.state.sorting
    )
      return false;
    return true;
  }

  render() {
    const { filtering, articles, sorting } = this.state;
    articles.sort((a, b) => {
      return sorting === "Comments"
        ? +b.comments - +a.comments
        : sorting === "Props"
          ? +b.votes - +a.votes
          : sorting === "User"
            ? a.created_by.username.charCodeAt(0) -
              b.created_by.username.charCodeAt(0)
            : 0;
    });
    return (
      <React.Fragment>
        {articles.length > 0 && (
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
              <p>Filter by:</p>
              <div id="filterbuttonbox">
                <FilterSortButton
                  whatFilter="All"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={filtering}
                  type="filtering"
                />
                <FilterSortButton
                  whatFilter="Coding"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={filtering}
                  type="filtering"
                />
                <FilterSortButton
                  whatFilter="Cooking"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={filtering}
                  type="filtering"
                />
                <FilterSortButton
                  whatFilter="Football"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={filtering}
                  type="filtering"
                />
              </div>
              <div id="sortbuttonbox">
                <p>Sort by:</p>
                <FilterSortButton
                  whatFilter="Comments"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={sorting}
                  type={"sorting"}
                />
                <FilterSortButton
                  whatFilter="Props"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={sorting}
                  type={"sorting"}
                />
                <FilterSortButton
                  whatFilter="User"
                  handleFilterSortButton={this.handleFilterSortButton}
                  filtering={sorting}
                  type={"sorting"}
                />
              </div>
            </div>
          </div>
        )}
        {articles.length === 0 && <Loading />}
      </React.Fragment>
    );
  }
  handleFilterSortButton = (type, filtering) => {
    this.setState({ [type]: filtering });
  };
}

export default Articles;
