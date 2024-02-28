#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, jsonify
from flask_restful import Resource


# Local imports
from config import app, db, api
# Add your model imports
from models import User, Post, UserGroup, Group


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Login(Resource):
    def post(self):
        user = User.query.filter_by(username = request.get_json()['username']).first()

        session['user_id'] = user.id
        response = make_response(
            user.to_dict(),
            200
        )
        return response

api.add_resource(Login, '/api/login')

class AuthorizedSession(Resource):
    def get(self):
        user = User.query.filter_by(id=session.get('user_id')).first()
        if user:
            response = make_response(
                user.to_dict(),
                200
            )
            return response
api.add_resource(AuthorizedSession, '/api/authorized')
            

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

class UserResource(Resource):
    def post(self):
        data = request.get_json()
        new_user = User(
            username=data['username'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id

        response_dict = new_user.to_dict()
        response = make_response(
            response_dict,
            201
        )
        return response
api.add_resource(UserResource, '/api/users')

class AllPost(Resource):
    def get(self):
        posts = [post.to_dict() for post in Post.query.all()]
        
        response = make_response(
            posts, 
            200
        )

        return response

    def post(self):
        user_id = session['user_id']
        data = request.get_json()
        new_post = Post(
        title = data.get('title'),
        content = data.get('content'),
        user_id = user_id
        )

        db.session.add(new_post)
        db.session.commit()

        response_dict = new_post.to_dict()

        response = make_response(
            response_dict,
            201
        )

        return response

api.add_resource(AllPost, "/api/posts")

class PostByID(Resource):
    def get(self, id):
        response_dict = Post.query.filter_by(id=id).first().to_dict()

        response = make_response(
            response_dict,
            200
        )

        return response

    def patch(self, id):
        post = Post.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(post, attr, data[attr])

        db.session.add(post)
        db.session.commit()

        response_dict = post.to_dict()

        response = make_response(
            response_dict,
            200
        )
        return response

    def delete(self, id):
        post = Post.query.filter_by(id=id).first()
        db.session.delete(post)
        db.session.commit()

        response_body = {
            "delete_successful": True,
            "message": "Post deleted",
            "id": id
        }
        response = make_response(
            response_body,
            200
        )
        return response

api.add_resource(PostByID, '/api/posts/<int:id>')



class GroupResource(Resource): 
    def get(self):
        groups = Group.query.all()
        user_groups = []

        for group in groups:
            user_group = group.to_dict()
            user_group['users'] = [user.to_dict() for user in group.users]
            user_groups.append(user_group)
        
        response = make_response(
            jsonify(user_groups),
            200
        )
        return response
api.add_resource(GroupResource, "/api/groups")  


if __name__ == '__main__':
    app.run(port=5555, debug=True)
