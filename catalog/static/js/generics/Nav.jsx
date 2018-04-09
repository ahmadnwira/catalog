import React from "react";
import Gbtn from './Gbtn';

class Nav extends React.Component {

  render() {
    return (
        <nav className="nav">
            <a href="/" className="title"> Catalog </a>
            { 
              this.props.is_signed ? <span>
                <a href="/profile" className="btn">profile</a>
                <a href="/gdisconnect" className="btn">logout</a>
              </span>
              : <Gbtn  />
            }
        </nav>
    );
  }
}
export default Nav;