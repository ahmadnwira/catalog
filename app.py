from flask import Flask, make_response
from catalog.items import items_blueprint
from catalog.auth import auth_blueprint

app = Flask(__name__)
app.secret_key = "dev key"
app.config['UPLOAD_FOLDER'] = "./catalog/static/dist/images"

# register the blueprints
app.register_blueprint(items_blueprint)
app.register_blueprint(auth_blueprint)


if __name__ == "__main__":
    app.run(debug=True, port=8080)
