#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, jsonify, abort
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError



# Local imports
from config import app, db, api
# Add your model imports
from models import User, Post, UserGroup, Group, Like


# Views go here!


class Login(Resource):
    def post(self):
        try:
            user = User.query.filter_by(username=request.get_json()['username']).first()
            if user.authenticate(request.get_json()['password']):
                session['user_id'] = user.id
                response = make_response(
                user.to_dict(),
                200
            )
            return response
        except:
            abort(401, "Incorrect Username or Password")

api.add_resource(Login, '/api/login')

class AuthorizedSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session.get('user_id')).first()
            if user:
                response = make_response(
                    user.to_dict(),
                    200
                )
            return response
        except:
            abort(401, "Unauthorized")

api.add_resource(AuthorizedSession, '/api/authorized')
            

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204

api.add_resource(Logout, '/api/logout')

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username=data.get('username')
        new_user = User(username=username, email=data.get('email'))
        new_user.password_hash = data.get('password')
        db.session.add(new_user)
        db.session.commit()

        user = User.query.filter_by(username=username).first()
        session['user_id'] = user.id


        response = make_response(
            new_user.to_dict(),
            201
        )
        return response

api.add_resource(Signup, '/api/signup')

class UserResource(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        if not users:
            abort(404, "No users were found!")

        response = make_response(
            users,
            200
        )

        return response

    def post(self):
        data = request.get_json()

        try:
            new_user = User(
                username=data.get('username'),
                password=data.get('password'),
                email=data.get('email')
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
        except IntegrityError as e:
            db.session.rollback()
            return {'error': 'Username already exists'}, 400

api.add_resource(UserResource, '/api/users')

class AllPost(Resource):
    def get(self):
        posts = [post.to_dict() for post in Post.query.all()]

        if not posts:
            abort(404, "No posts were found!")
        
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
        post = Post.query.filter_by(id=id).first().to_dict()
        if not post:
            abort(404, "The post you are looking for could not be found!")

        response = make_response(
            post,
            200
        )

        return response

    def patch(self, id):
        post = Post.query.filter_by(id=id).first()
        if not post:
            abort(404, "The post you are trying to update for could not be found!")

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
        if not post:
            abort(404, "The post you are trying to delete can't be found!")

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
        groups = [group.to_dict() for group in Group.query.all()]
        if not groups:
            abort(404, "No groups were found!")

        response = make_response(
            groups,
            200
        )

        return response
    
    def post(self):
        data = request.get_json()

        new_group = Group(
            name=data.get("name"),
        )


        db.session.add(new_group)
        db.session.commit()

        new_group_dict = new_group.to_dict()

        response = make_response(
            new_group_dict,
            201
        )
        return response

api.add_resource(GroupResource, "/api/groups")  


class UserGroupResource(Resource):
    def get(self):
        user_groups = [user_group.to_dict() for user_group in UserGroup.query.all()]

        if not user_groups:
            abort(404, "No user groups were found!")
        
        response = make_response(
            user_groups, 
            200
        )

        return response

    def post(self):
        user_id = session['user_id']

        data = request.get_json()
        group_id = data.get("group_id")

        existing_user_group = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
        if existing_user_group:
            response_body = {
                "error": "User already in this group",
            }
            response = make_response(
                response_body,
                400
            )
            return response

        new_user_group = UserGroup(
            message=data.get("message"),
            user_id=user_id,
            group_id=group_id
        )

        db.session.add(new_user_group)
        db.session.commit()

        user_group_dict = new_user_group.to_dict()

        response = make_response(
            user_group_dict,
            201
        )

        return response

api.add_resource(UserGroupResource, "/api/user_groups")


class LikeResource(Resource):
    def get(self):
        likes = [like.to_dict() for like in Like.query.all()]
        if not likes: 
            abort(404, "No likes were found")
            
        response = make_response(
                likes, 
                200
            )
        return response
    
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        post_id = data.get('post_id')

        existing_like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
        if existing_like:
            response_body = {
                "error":"User already liked this post",
            }
            response = make_response(
                response_body,
                400
            )
            return response 

        new_like = Like(
            user_id=user_id, 
            post_id=post_id 
        )

        db.session.add(new_like)
        db.session.commit()

        new_like_dict = new_like.to_dict()

        response = make_response(
            new_like_dict,
            200
        )

        return response
api.add_resource(LikeResource, "/api/likes")






if __name__ == '__main__':
    app.run(port=5555, debug=True)
