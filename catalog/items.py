import os
from flask import (render_template, Blueprint, request, session,
                   abort, jsonify)
from werkzeug.utils import secure_filename
from models import engine, Item, Category
from sqlalchemy.orm import sessionmaker
from catalog.auth import protected_route

items_blueprint = Blueprint('items', __name__, static_folder="/static",
                            template_folder='./templates')

dbsession = sessionmaker(bind=engine)
db = dbsession()


@items_blueprint.route('/items')
def items():
    try:
        items = db.query(Item).all()
        return jsonify(items_list=[item.serialize_item for item in items])
    except:
        abort(404)
    finally:
        db.close()


@items_blueprint.route('/user/<int:id>/items')
def user_items(id):
    try:
        items = db.query(Item).filter_by(user_id=id)
        return jsonify(items_list=[item.serialize_item for item in items])
    except:
        abort(404)
    finally:
        db.close()


@items_blueprint.route('/item/<int:id>')
def item(id):
    try:
        item = db.query(Item).filter_by(item_id=id).one()
        return jsonify(item.serialize_item)
    except:
        abort(404)
    finally:
        db.close()


@items_blueprint.route('/item/description/<int:id>')
def item_description(id):
    try:
        return db.query(Item.item_description).filter_by(item_id=id).first()
    except:
        abort(404)
    finally:
        db.close()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg']


@protected_route
@items_blueprint.route('/item/add', methods=('POST', ))
def create_item():
    file = request.files['img']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        file.save(os.path.join(
            "../catalog/catalog/static/dist/images",
            filename))
    else:
        return 'image format is not spporte'

    categoryId = get_categoryId(request.form['category'])
    if not categoryId:
        newCategory = Category(category_name=request.form['category'],
                               user_id=session['user'])
        db.add(newCategory)
        db.commit()
        categoryId = get_categoryId(request.form['category'])

    newItem = Item(item_name=request.form['item'],
                   item_description=request.form['description'],
                   item_img='/dist/images/'+filename, user_id=session['user'],
                   category_id=categoryId)

    db.add(newItem)
    db.commit()

    return 'success'


@protected_route
@items_blueprint.route('/item/edit', methods=('POST', ))
def edit_item():
    try:
        item = db.query(Item).filter_by(item_id=request.form['id']).one()
        item.item_name = request.form['item']
        item.item_description = request.form['description']
        item.category_id = request.form['category']
        db.add(item)
        db.commit()
        return 'success'
    except:
        abort(404)
    finally:
        db.close()


@protected_route
@items_blueprint.route('/item/delete', methods=('POST', ))
def delete_item():
    # check for login and if user own this item
    try:
        item = db.query(Item).filter_by(item_id=request.form['id']).one()
        db.delete(item)
        db.commit()
        return 'success'
    except:
        abort(404)
    finally:
        db.close()


@items_blueprint.route('/categories')
def categories():
    try:
        categories = db.query(Category).all()
        return jsonify(categories_list=[category.serialize_category
                                        for category in categories])
    except:
        abort(404)
    finally:
        db.close()


def get_categoryId(category_name):
    try:
        return db.query(Category.category_id).filter_by(
            category_name=category_name).one()[0]
    except:
        return False


@items_blueprint.route('/', defaults={'path': ''})
@items_blueprint.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')
