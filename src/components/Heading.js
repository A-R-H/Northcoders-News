import React from "react";
import { Link } from "react-router-dom";
import "./Heading.css";

const Heading = ({ currentUser }) => (
  <div id="headingbox">
    <div id="newslogo">
      <div id="ncnewstext">Northcoders News</div>
    </div>
    <div id="headunderlinks">
      <div id="topicnavs">
        <div id="navtext">View Articles</div>
        <div id="innernavs">
          <p>
            <Link to="/articles">All</Link>
          </p>
          <p>|</p>
          <p>
            <Link
              to={{ pathname: "/articles", state: { filtering: "coding" } }}
            >
              Coding
            </Link>
          </p>
          <p>|</p>
          <p>
            <Link to="/articles">Cooking</Link>
          </p>
          <p>|</p>
          <p>
            <Link to="/articles">Football</Link>
          </p>
        </div>
      </div>
      <div id="space" />
      <div id="headprofile">
        <Link to={`/${currentUser}`}>
          <button>View Profile</button>
        </Link>
        <button>Log out</button>
      </div>
    </div>
  </div>
);

export default Heading;
