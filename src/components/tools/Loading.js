import React from "react";
import ReactLoading from "react-loading";
import "./Loading.css";

const Loading = () => (
  <div id="loadingbox">
    <div>
      <ReactLoading type={"bars"} color="#c7002f" />
    </div>
  </div>
);

export default Loading;
