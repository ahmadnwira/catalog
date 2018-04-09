import React from "react";
import Nav from "./generics/Nav";
import Items from "./items/Items";
import CreateItem from "./items/CreateItem";

export default class Profile extends React.Component {
  constructor() {
    super();
    this.state= {showCreateForm: false} ;
  }
  
  loadCreateForm(e){
    this.setState({showCreateForm: true});
  }

  closeModal(e){
    this.setState({showCreateForm: false});
  }

  render() {
    return (
      <div id="profile">
        <Nav is_signed={this.props.isAuthenticated}/>
        <div className="header">
          <h1 className="header_title">Your Items.</h1>
          <a className="btn btn_primary"
          onClick={this.loadCreateForm.bind(this)}> New Item </a>
        </div>
        <Items is_signed={this.props.isAuthenticated} user={this.props.user_id}/>
        {
          this.state.showCreateForm  ? 
          <CreateItem closeModal={this.closeModal.bind(this)}/> : ''
        } 
      </div>
    );
  }
}