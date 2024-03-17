#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, jsonify, abort, url_for, redirect
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, api, db, oauth, secrets
from models import User, Post, UserGroup, Group, Like


google = oauth.register(
    name='google',
    client_id='876300808012-jl6se3g2i8qrk3f20gmg765ia8tcgq1m.apps.googleusercontent.com',
    client_secret='',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'email profile'},
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)


@app.route('/google')
def google_login():
    google = oauth.create_client('google')
    state = secrets.token_urlsafe(16)
    print("Generated state token:", state)
    session['oauth_state'] = state
    print("Session dictionary:", session)
    print("Session state:", session['oauth_state'])
    redirect_uri = url_for('google_auth', _external=True)
    return google.authorize_redirect(redirect_uri, state=state)



@app.route('/google/auth')
def google_auth():
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()

    try:
        
        existing_user = User.query.filter_by(email=user_info['email']).first()

        if existing_user:
            session['user_id'] = existing_user.id
            return redirect('http://localhost:3000') 
        else:
            new_user = User(
                username=user_info['email'],
                email=user_info['email'],
            )
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return redirect('http://localhost:3000') 
    except Exception as e:
        print("Exception during Google OAuth:", e)
        abort(401, "Unauthorized")



class Login(Resource):
    def post(self):
        try:
            user = User.query.filter_by(username=request.json['username']).first()
            if user.authenticate(request.json['password']):
                session['user_id'] = user.id
                response = make_response(user.to_dict(), 200)
                return response
            else:
                abort(401, "Incorrect Username or Password")
        except Exception as e:
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

class LikeByID(Resource):
    def delete(self, id):
        like = Like.query.filter_by(id=id).first()
        if not like:
            abort(404, "The like you are trying to delete can't be found!")

        db.session.delete(like)
        db.session.commit()

        response_body = {
            "delete_successful": True,
            "message": "Like deleted",
            "id": id
        }
        response = make_response(
            response_body,
            200
        )
        return response

api.add_resource(LikeByID, '/api/likes/<int:id>')








if __name__ == '__main__':
    app.run(port=5555, debug=True)
