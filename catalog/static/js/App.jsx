import React from "react";
import Nav from "./generics/Nav";
import Items from './items/Items';

export default class App extends React.Component {
  constructor() {
    super();
  }  

  render() {
    return (
      <div>
        <Nav is_signed={this.props.isAuthenticated}/>
        <div className="header">
          <h1 className="header_title">Items.</h1>
        </div>
        <Items />
      </div>
    );
  }
}