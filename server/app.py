#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource


# Local imports
from config import app, db, api
# Add your model imports
from models import User, Post, UserGroup, Group


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

"""class Login(Resource):
    def post(self):
        user = User.query.filter(
            User.username == request.get_json()['username']
        ).first()

        session['user_id'] = user.id
        return user.to_dict()

api.add_resource(Login, '/login')"""

class Logout(Resource):

    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204

api.add_resource(Logout, '/api/logout')

class CheckSession(Resource):
     def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

api.add_resource(CheckSession, '/check_session')

class Users(Resource):
    def post(self):
        data = request.get_json()
        new_user = User(
            username=data['username'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
api.add_resource(Users, '/api/users')

class AllPosts(Resource):
    def get(self):
        posts = [post.to_dict() for post in Post.query.all()]
        
        response = make_response(
            posts, 
            200
        )

        return response

class UserPosts(Resource):
    def get(self, user_id):
        posts = [post.to_dict() for post in Post.query.filter_by(user_id=user_id)].all()

        response = make_response(
            posts,
            200
        )

        return response

    def post(self):
        data = request.get_json()
        new_post = Post(
        title = data.get('title'),
        content = data.get('content'),
        user_id = data.get('user_id')
        )

        db.session.add(new_post)
        db.session.commit()

        response_dict = new_post.to_dict()

        response = make_response(
            response_dict,
            201
        )

        return response

api.add_resource(AllPosts, "/api/posts")
api.add_resource(UserPosts, "/api/posts/user/<int:user_id>")


if __name__ == '__main__':
    app.run(port=5555, debug=True)
