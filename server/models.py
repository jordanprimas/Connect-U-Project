from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from datetime import datetime
import re

# Local imports 
from config import db, bcrypt, generate_password_hash, check_password_hash

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-posts.user', '-user_groups.user', '-password_hash', '-likes.user',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan', foreign_keys='Post.user_id')
    user_groups = db.relationship('UserGroup', back_populates='user', cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='user', cascade='all, delete-orphan')

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    #Creating a setter method called password_hash that takes self and a password
    #Use bcrypt to generate the password hash
    #Set the _password_hash to the hashed password
    @password_hash.setter
    def password_hash(self, password):
        password_hash = generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if not re.fullmatch(email_regex, email):
            raise ValueError("Please enter a valid email address")
        return email

    @validates('username')
    def validate_username(self, key, username):
        if not (3 <= len(username) <= 20):
            raise ValueError("Username must be between 3 and 20 characters")
        return username

    
    def __repr__(self):
        return f'<User {self.username}, {self.email}>'


class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ( '-users.post', '-likes.post',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    content = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='posts')
    likes = db.relationship('Like', back_populates='post', cascade='all, delete-orphan')

    @validates('title')
    def validate_title(self, key, title):
        if not (0 <= len(title) <= 30):
            raise ValueError("Title must be no more than 30 characters")
        return title
    
    @validates('content')
    def validate_content(self, key, content):
        if not (0 < len(content) <= 280):
            raise ValueError("Post content must be no more than 280 characters")
        return content

    def __repr__(self):
        return f'<Post {self.title}>'

class Group(db.Model, SerializerMixin):
    __tablename__ = 'groups'

    serialize_rules = ('-user_groups.group',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    user_groups = db.relationship('UserGroup', back_populates='group', cascade='all, delete-orphan')

     #Association proxy to get all users for this group through user_groups
    users = association_proxy('user_groups', 'user',
                                creator=lambda user_obj: UserGroup(user = user_obj))

    @validates('name')
    def validate_name(self, key, name):
        if not (3 <= len(name) <= 30 ):
            raise ValueError("Failed name validation")
        return name


    def __repr__(self):
        return f'<Group: {self.name}>'

class UserGroup(db.Model, SerializerMixin):
    __tablename__ = 'user_groups'

    serialize_rules = ('-user.user_groups', '-group.user_groups',)

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))

    user = db.relationship('User', back_populates='user_groups')
    group = db.relationship('Group', back_populates='user_groups')

    @validates('message')
    def validate_message(self, key, message):
        if not (0 <= len(message) <= 100):
            raise ValueError('Failed message validation')
        return message 


    def __repr__(self):
        return f'<User: {self.user} Group:{self.group}>'

class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'

    serialize_rules = ('-user', '-post',)

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))

    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')

    def __repr__(self):
        return f'<User: {self.user} Post: {self.post}'






