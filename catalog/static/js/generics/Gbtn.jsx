import React from "react";
import $ from "jquery";

export default class Gbtn extends React.Component{
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        (function() {
            var e = document.createElement("script");
            e.type = "text/javascript";
            e.async = true;
            e.src = "https://apis.google.com/js/client:platform.js?onload=gPOnLoad";
            var t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(e, t)
        })();    
    }

    googleLogin(){
        window.gapi.auth.signIn({
            callback: function(authResponse) {
                this.signInCallback(authResponse);
            }.bind(this),
            clientid: "236143958470-1a7ok19o5uaid0k16j4j9nss51knkgl3.apps.googleusercontent.com",
            cookiepolicy: "single_host_origin",
            scope: "openid email",
            redirecturi: "postmessage",
            accesstype: "offline",
            approvalprompt:"force"
        });
    }
    
    signInCallback(result){
        if (result['code']) {
            $.ajax({
                url: '/gconnect?csrf={{CSRF}}',
                type: 'POST',
                processData: false,
                contentType: 'application/octet-stream; charset=utf-8',
                data : result['code'],
                success: function (response) {
                    console.log(response);
                    window.location.replace('/profile');   
                }
            });
        }
    }

    
    render(){
        return(
            <a className="btn" onClick={ () => this.googleLogin() }>
                login
            </a>
        )
    }
}