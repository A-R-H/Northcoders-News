import React from "react";
import "./BadRoute.css";

const BadRoute = ({ missing }) => (
  <div id="badroutebox">
    <h1>404</h1>
    <p>The {`${missing || "page"}`} you were looking for does not exist</p>
  </div>
);

export default BadRoute;
