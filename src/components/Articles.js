import React, { Component } from "react";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import "./Articles.css";

class Articles extends Component {
  state = {
    filtering: "all"
  };
  render() {
    const { filtering } = this.state;
    return (
      <div id="articlesunderbox">
        <div id="mainarticles">Main View</div>
        <div id="sortbar">
          <RadioGroup value={filtering} horizontal>
            <RadioButton value="all">All Articles</RadioButton>
            <RadioButton value="coding">Coding</RadioButton>
            <RadioButton value="cooking">Cooking</RadioButton>
            <RadioButton value="football">Football</RadioButton>
          </RadioGroup>
        </div>
      </div>
    );
  }
}

export default Articles;
