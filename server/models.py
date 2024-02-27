from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-posts','-user_groups.user',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)

    #Relationship mapping user to related instance attributes
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan', foreign_keys='Post.user_id')
    user_groups = db.relationship('UserGroup', back_populates='user', cascade='all, delete-orphan')

    #Association proxy to get all groups for this user through user_groups
    groups = association_proxy('user_groups', 'group',
                                creator=lambda group_obj: UserGroup(group = group_obj))


    def __repr__(self):
        return f'<User {self.username}, {self.email}>'

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    content = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='posts')

    def __repr__(self):
        return f'<Post {self.title}>'

class Group(db.Model, SerializerMixin):
    __tablename__ = 'groups'

    serialize_rules = ('-user_groups.group',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    user_groups = db.relationship('UserGroup', back_populates='group', cascade='all, delete-orphan')

     #Association proxy to get all users for this group through user_groups
    users = association_proxy('user_groups', 'user',
                                creator=lambda user_obj: UserGroup(user = user_obj))


    def __repr__(self):
        return f'<Group: {self.name}>'

class UserGroup(db.Model, SerializerMixin):
    __tablename__ = 'user_groups'

    serialize_rules = ('-user.user_groups', '-group.user_groups',)

    id = db.Column(db.Integer, primary_key=True)
    member_count = db.Column(db.Integer, default=1)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))

    user = db.relationship('User', back_populates='user_groups')
    group = db.relationship('Group', back_populates='user_groups')


    def __repr__(self):
        return f'<Members: {self.member_count}>'




