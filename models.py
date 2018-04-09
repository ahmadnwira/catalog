from sqlalchemy import (Column, Integer, String, Boolean, Text, ForeignKey,
                        create_engine)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True)
    user_name = Column(String(250), nullable=False)
    user_email = Column(String(250), nullable=False)
    user_img = Column(String(255), nullable=False)

    @property
    def serialize(self):
        return {'name': self.name, 'email': self.user_email}


class Item(Base):
    __tablename__ = "items"
    item_id = Column(Integer, primary_key=True)
    item_name = Column(String(250), nullable=False)
    item_description = Column(Text, nullable=False)
    item_img = Column(String(140))
    user_id = Column(Integer, ForeignKey("users.user_id"))
    category_id = Column(Integer, ForeignKey("categories.category_id"))

    item_owner = relationship("User")
    item_category = relationship('Category')

    @property
    def serialize(self):
        return {
            'item_name': self.item_name,
            'description': self.item_description,
            'owner': self.user_id,
            'category': self.item_category.category_name,
            'id': self.item_id
        }

    @property
    def serialize_item(self):
        return {
            'item_name': self.item_name,
            'category': self.item_category.category_name,
            'description': self.item_description,
            'image': self.item_img,
            'id': self.item_id
        }


class Category(Base):
    __tablename__ = "categories"
    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(250), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    @property
    def serialize_category(self):
        return {
            'category': self.category_name,
            'id': self.category_id
        }

engine = create_engine('mysql+oursql://root:pass@localhost/catalog')
Base.metadata.create_all(engine)
