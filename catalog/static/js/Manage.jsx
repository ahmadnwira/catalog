import React from "react";
import Nav from "./generics/Nav";
import ManageItem from './items/ManageItem';

export default class Manage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Nav is_signed={this.props.isAuthenticated}/>
        <ManageItem id={this.props.match.params.id}/>
      </div>
    );
  }
}