from sqlalchemy import and_
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates, foreign
from datetime import datetime
import re

# Local imports 
from config import db, bcrypt, generate_password_hash, check_password_hash


# ==============================
# USER
# ==============================
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-_password_hash',
        '-posts.user', 
        '-likes.user',
        '-messages.user',
        '-groups.users',
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False)
    _password_hash = db.Column(db.String)

    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan', foreign_keys='Post.user_id')
    likes = db.relationship('Like', back_populates='user', cascade='all, delete-orphan')
    messages = db.relationship('Message', back_populates='user', cascade='all, delete-orphan')
    groups = db.relationship('Group', secondary='user_groups', back_populates='users')


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
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if not re.fullmatch(pattern, email):
            raise ValueError('Invalid email address')
        return email

    @validates('username')
    def validate_username(self, key, username):
        if not (3 <= len(username) <= 20):
            raise ValueError("Username must be between 3 and 20 characters")
        return username

    
    def __repr__(self):
        return f'<User {self.username}>'



# ==============================
# GROUP
# ==============================
class Group(db.Model, SerializerMixin):
    __tablename__ = 'groups'

    serialize_rules = (
        '-users.groups',
        '-messages.group'
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255))
    cover_image = db.Column(db.String(255))

    users = db.relationship('User', secondary='user_groups', back_populates='groups')
    messages = db.relationship(
        'Message', 
        primaryjoin=lambda: and_(
            foreign(Message.parent_id) == Group.id,
            Message.parent_type == "group"
        ),
        back_populates='group', 
        cascade='all, delete-orphan',
        overlaps="post"
    )


    @validates('name')
    def validate_name(self, key, name):
        if not (3 <= len(name) <= 50 ):
            raise ValueError('Group name must be between 3 and 50 characters')
        return name


    def __repr__(self):
        return f'<Group: {self.name}>'


# ==============================
# USER-GROUP ASSOCIATION TABLE
# ==============================
class UserGroup(db.Model):
    __tablename__ = 'user_groups'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))


    def __repr__(self):
        return f'<User: {self.user} Group:{self.group}>'


# ==============================
# POST
# ==============================
class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ( 
        '-users.post', 
        '-likes.post',
        '-messages.post',
    )

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text)
    image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='posts')

    likes = db.relationship('Like', back_populates='post', cascade='all, delete-orphan')
    messages = db.relationship(
        'Message', 
        primaryjoin=lambda: and_(
            foreign(Message.parent_id) == Post.id,
            Message.parent_type == 'post'
        ),
        back_populates='post', 
        cascade='all, delete-orphan',
        overlaps="group"
    )

    @validates('title')
    def validate_title(self, key, title):
        if not (0 <= len(title) <= 100):
            raise ValueError('Title must be between 1 and 100 characters')
        return title
    
    @validates('content')
    def validate_content(self, key, content):
        if not (0 < len(content) <= 500):
            raise ValueError('Post content must be 500 characters or less')
        return content

    def __repr__(self):
        return f'<Post {self.title}>'


# ==============================
# MESSAGE
# ==============================
class Message(db.Model, SerializerMixin):
    __tablename__ = "messages"

    serialize_rules = (
        '-user.messages',
    )

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parent_id = db.Column(db.Integer, nullable=False)
    parent_type = db.Column(db.String(50), nullable=False)

    user = db.relationship('User', back_populates="messages")
    group = db.relationship(
        'Group',
        primaryjoin=lambda: and_(
            foreign(Message.parent_id) == Group.id,
            Message.parent_type == "group"
        ),
        back_populates='messages',
        overlaps="messages,post"
    )
    post = db.relationship(
        'Post',
        primaryjoin=lambda: and_(
            foreign(Message.parent_id) == Post.id,
            Message.parent_type == 'post'
        ),
        back_populates='messages',
        overlaps="messages,group"
    )


    __mapper_args__ = {
        "polymorphic_on": parent_type,
        "polymorphic_identity": "message"
    }

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id,
            "user": self.user.username if self.user else None,
            "parent_id": self.parent_id,
            "parent_type": self.parent_type
        }


# ==============================
# LIKE
# ==============================
class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))

    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')

    def to_dict(self):
        return{
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }

    def __repr__(self):
        return f'<User: {self.user} Post: {self.post}'









