import random
import string
import httplib2
import json
import requests
from flask import (render_template, Blueprint, request, session,
                   abort, jsonify, make_response, redirect)
from oauth2client.client import flow_from_clientsecrets, FlowExchangeError
from models import engine, User
from sqlalchemy.orm import sessionmaker

auth_blueprint = Blueprint('auth', __name__, static_folder="./static/dist",
                           template_folder='./templates')

dbsession = sessionmaker(bind=engine)
db = dbsession()

CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']


def protected_route(view):
    def check_user():
        if is_signed():
            return view()
        return False
    return check_user


def create_user(session):
    newUser = User(user_name=session['user_name'],
                   user_email=session['user_email'],
                   user_img=session['user_img'])
    db.add(newUser)
    db.commit()
    user = db.query(User).filter_by(user_email=session['user_email']).one()
    return user.user_id


def user(user_id):
    user = session.query(User).filter_by(user_id=user_id).one()
    return user


def get_userId(email):
    try:
        user = db.query(User).filter_by(user_email=email).one()
        return user.user_id
    except:
        return False


@auth_blueprint.route('/signed')
def is_signed():
    try:
        return str(session['user'])
    except KeyError:
        return "false"


#  auth system login , saves user email and img logout
@auth_blueprint.route('/gconnect', methods=('POST',))
def gconnect():
    # Validate state token
    # if request.form('csrf') != session['csrf']:
    if False:
        response = make_response(json.dumps('Invalid state parameter.'), 401)
        print('invalid state paramter')
        response.headers['Content-Type'] = 'application/json'
        return response
    # Obtain authorization code
    code = request.data
    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps('Failed to upgrade the authorization code.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps("Token's user ID doesn't match given user ID."), 401)
        print('token don match user')
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps("Token's client ID does not match app's."), 401)
        print('app dont match token')
        response.headers['Content-Type'] = 'application/json'
        return response

    stored_access_token = session.get('access_token')
    stored_gplus_id = session.get('gplus_id')
    # check if user already loged in.
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        response = make_response(json.dumps('logedin'),
                                 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later use.
    session['access_token'] = credentials.access_token
    session['gplus_id'] = gplus_id

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    session['user_name'] = data['name']
    session['user_email'] = data['email']
    session['user_img'] = data['picture']

    userId = get_userId(session['user_email'])
    if not userId:
        userId = create_user(session)

    session['user'] = userId
    return 'logedin'


@auth_blueprint.route('/gdisconnect')
def gdisconnect():
        # Only disconnect a connected user.
    access_token = session.get('access_token')
    if access_token is None:
        response = make_response(
            json.dumps('Current user not connected.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % access_token
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]

    if result:
        # Reset the user's sesson.

        del session['access_token']
        del session['gplus_id']
        del session['user_name']
        del session['user_email']
        del session['user_img']
        del session['user']

        return redirect('/')
    else:
        # For whatever reason, the given token was invalid.
        response = make_response(
            json.dumps('Failed to revoke token for given user.'), 400)
        response.headers['Content-Type'] = 'application/json'
        return response
