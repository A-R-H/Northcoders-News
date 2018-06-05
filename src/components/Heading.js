import React from "react";
import PT from "prop-types";
import { Link } from "react-router-dom";
import "./Heading.css";

const Heading = ({ currentUser }) => (
  <div id="headingbox">
    <div id="newslogo" className="container">
      <div id="ncnewstext">Northcoders News</div>
    </div>
    <div id="headunderlinks">
      <div id="topicnavs">
        <div id="navtext">View Articles</div>
        <div id="innernavs">
          <p>
            <Link to={{ pathname: "/articles", state: { filtering: "All" } }}>
              All
            </Link>
          </p>
          <p>|</p>
          <p>
            <Link
              to={{ pathname: "/articles", state: { filtering: "Coding" } }}
            >
              Coding
            </Link>
          </p>
          <p>|</p>
          <p>
            <Link
              to={{ pathname: "/articles", state: { filtering: "Cooking" } }}
            >
              Cooking
            </Link>
          </p>
          <p>|</p>
          <p>
            <Link
              to={{ pathname: "/articles", state: { filtering: "Football" } }}
            >
              Football
            </Link>
          </p>
        </div>
      </div>
      <div id="space" />
      <div id="headprofile">
        <Link className="activebtn" to="/post">
          <button>Post article</button>
        </Link>
        <Link className="activebtn" to={`/${currentUser}`}>
          <button>View profile</button>
        </Link>
      </div>
    </div>
  </div>
);

Heading.propTypes = {
  currentUser: PT.string
};

export default Heading;
