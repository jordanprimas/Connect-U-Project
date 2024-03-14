#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Post, Group, UserGroup, Like

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        User.query.delete()
        Post.query.delete()
        Group.query.delete()
        UserGroup.query.delete()
        Like.query.delete()

        u1 = User(username = "jordan1234", email = "email", password_hash = "12345")
        u2 = User(username = "cashew1234", email = "email two", password_hash = "23456")
        u3 = User(username = "arya1234", email = "email three", password_hash = "password")
        u4 = User(username = "username", email = "email four", password_hash = "hello world")

        db.session.add_all([u1, u2, u3, u4])
        db.session.commit()

        p1 = Post(title = "title one", content = "This is my first post...", user_id = u1.id)
        p2 = Post(title = "title two", content = "This is my first post...", user_id = u2.id)
        p3 = Post(title = "title three", content = "This is my first post...", user_id = u3.id)
        p4 = Post(title = "title four", content = "This is my first post...", user_id = u4.id)

        db.session.add_all([p1, p2, p3, p4])
        db.session.commit()

        g1 = Group(name="Animal Lovers")
        g2 = Group(name="Travelers Guide")
        g3 = Group(name="Culinary Connoisseurs")

        db.session.add_all([g1, g2, g3])
        db.session.commit()

        ug1 = UserGroup(user=u1, group=g1, message="I'm so excited to be joining the group")
        ug2 = UserGroup(user=u2, group=g3, message="Hello everyone!")
        ug3 = UserGroup(user=u4, group=g2, message="I just joined!!")
        ug4 = UserGroup(user=u4, group=g1, message="Hi everyone!")

        db.session.add_all([ug1, ug2, ug3, ug4])
        db.session.commit()

        l1 = Like(user_id=1, post_id=2)
        l2 = Like(user_id=1, post_id=3)
        l3 = Like(user_id=2, post_id=1)
        l4 = Like(user_id=3, post_id=2)
        l5 = Like(user_id=4, post_id=2)

        db.session.add_all([l1, l2, l3, l4, l5])
        db.session.commit()




