import React from "react";
import Nav from "./Nav";


export default class NotFound extends React.Component {
  render() {
    return (
      <div className="app">
        <Nav />
        <div className="warning">
          <h3> Page Not Found </h3>
        </div>
      </div>
    );
  }
}