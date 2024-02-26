#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Post, Group, UserGroup

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        User.query.delete()
        Post.query.delete()

        u1 = User(username = "username one", email = "email", password = "12345")
        u2 = User(username = "username two", email = "email two", password = "23456")
        u3 = User(username = "username three", email = "email three", password = "password")
        u4 = User(username = "username four", email = "email four", password = "hello world")

        db.session.add_all([u1, u2, u3, u4])
        db.session.commit()

        p1 = Post(title = "title one", content = "This is my first post and I would like to say that...", user_id = u1.id)
        p2 = Post(title = "title two", content = "This is my first post and I would like to say that...", user_id = u2.id)
        p3 = Post(title = "title three", content = "This is my first post and I would like to say that...", user_id = u3.id)
        p4 = Post(title = "title four", content = "This is my first post and I would like to say that...", user_id = u4.id)

        db.session.add_all([p1, p2, p3, p4])
        db.session.commit()

        g1 = Group(name="Animal Lovers")
        g2 = Group(name="Travelers Guide")
        g3 = Group(name="Culinary Connoisseurs")

        db.session.add_all([g1, g2, g3])
        db.session.commit()

        ug1 = UserGroup(user=u1, group=g1)
        ug2 = UserGroup(user=u2, group=g3)
        ug3 = UserGroup(user=u4, group=g2)

        db.session.add_all([ug1, ug2, ug3])
        db.session.commit()


