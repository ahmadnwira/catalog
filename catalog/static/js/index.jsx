import React from "react";
import $ from 'jquery';
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import App from './App';
import Manage from './Manage';
import Profile from './Profile';
import NotFound from './generics/NotFound';

require('../css/normalize.css');
require('../css/style.css');

var isAuthenticated = false;
var user_id = 0;

$.ajax({
    url: '/signed',
    async:false,
    success: function(result){
        if(result != 'false'){
            isAuthenticated = true;
            user_id = result;
        }
    }
});

ReactDOM.render(
<Router>
    <Switch>
        <Route path="/" exact
            render={() => <App isAuthenticated={isAuthenticated}
                user_id={user_id}/> } />

        <Route path="/items/:id/manage" exact
            render={(props) => isAuthenticated ? 
                    <Manage user_id={user_id} 
                    isAuthenticated={isAuthenticated}  {...props}/>
                    : window.location.replace('/')
            }/>

        <Route path="/profile"exact
            render={() => isAuthenticated ?
                        <Profile user_id={user_id}
                        isAuthenticated={isAuthenticated} />
                        : window.location.replace('/')
            }/>

        <Route component={NotFound} />
    </Switch>
</Router>, document.getElementById("app"));