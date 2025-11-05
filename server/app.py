#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, abort, url_for, redirect
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, api, db, oauth, secrets, google
from models import User, Post, UserGroup, Group, Like, Message



@app.route('/google')
def google_login():
    google = oauth.create_client('google')
    state = secrets.token_urlsafe(16)
    
    session['oauth_state'] = state
    
    redirect_uri = url_for('google_auth', _external=True)
    return google.authorize_redirect(redirect_uri, state=state)


@app.route('/google/auth')
def google_auth():
    state = request.args.get('state')
    print("Google auth state:", state)
    google = oauth.create_client('google') #
    print("google", google)
    token = google.authorize_access_token()
    print("token", token)
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
        except:
            return {"error": "Incorrect Username or Password"}, 401

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
        try:
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
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 400
        except IntegrityError as e:
            db.session.rollback()
            return {'error': 'Please choose another username'}, 400
    

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
        except ValueError as e:
            return {'error': str(e)}, 400
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
        try:
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
        except ValueError as e:
            return {'error': str(e)}, 400

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
            abort(404, "Post not found.")

        user_id = session.get("user_id")
        if post.user_id != user_id:
            abort(403, "You can only edit your own posts.")

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

class AllGroupResource(Resource): 
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
        try:
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
        except ValueError as e:
            return {'error': str(e)}, 400

api.add_resource(AllGroupResource, "/api/groups")  

class GroupByID(Resource):
    def get(self, id):
        group = Group.query.filter_by(id=id).first().to_dict()
        if not group:
            abort(404, "The group you are looking for could not be found!")
        
        response = make_response(
            group,
            200
        )
        return response

    def patch(self, id):
        group = Group.query.filter_by(id=id).first()
        if not group:
            abort(404, "The group you are trying to update could not be found!") 
        data = request.get_json()
        for attr in ["name", "description", "cover_image"]:
            if attr in data:
                setattr(group, attr, data[attr])
        db.session.add(group)
        db.session.commit()

        response_dict = group.to_dict()
        response = make_response(
            group,
            200
        )
        return response
    
    def delete(self, id):
        group = Group.query.filter_by(id=id).first()
        if not group:
            abort(404, "The group you are trying to delete could not be found!") 

        db.session.delete(group)
        db.session.commit()
        return {}, 204

api.add_resource(GroupByID, "/api/groups/<int:id>")




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
        data = request.get_json()
        user_id = session['user_id']
        group_id = data.get('group_id')

        existing_user_group = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()

        if existing_user_group:
            response_body = {
                "error": "User already in this group"
            }
            response = make_response(
                response_body,
                400
            )
            return response

        else:
            try:
                new_user_group = UserGroup(
                    user_id=user_id,
                    group_id=group_id
                )

                db.session.add(new_user_group)
                db.session.commit()

                return make_response(new_user_group.to_dict(), 201)

            except ValueError as e:
                return {'error': str(e)}, 400

api.add_resource(UserGroupResource, "/api/user_groups")

class UserGroupById(Resource):
    def delete(self, id):
        user_group = UserGroup.query.filter_by(id=id).first()

        if not user_group:
            abort(404, "The user group you are trying to delete can't be found")
        
        db.session.delete(user_group)
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

api.add_resource(UserGroupById, "/api/user_groups/<int:id>")


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

class MessageResource(Resource):
    def get(self):
        parent_type = request.args.get('parent_type')
        parent_id = request.args.get('parent_id')

        query = Message.query
        if parent_type and parent_id:
            query = query.filter_by(parent_type=parent_type, parent_id=parent_id)

        messages = [m.to_dict() for m in query.order_by(Message.created_at.desc()).all()]
        return make_response(message, 200)

    def post(self):
        data = request.get_json()

        parent_type = data.get('parent-type')
        parent_id = data.get('parent_id')

        if parent_type not in ('post', 'group'):
            abort(400, "Invalid parent_type. Must be 'post' or 'group'.")
        
        if not parent_id:
            abort(400, "Missing parent_id.")

        new_message = Message(
            content=data.get('content'),
            user_id=user_id,
            parent_type=parent_type,
            parent_id=parent_id
        )

        db.session.add(new_message)
        db.session.commit()

        return make_response(new_message.to_dict(), 201)

api.add_resource(MessageResource, "/api/messages")

class MessageById(Resource):
    def patch(self, id):
        message = Message.query.filter_by(id=id).first()
        if not message:
            abort(404, "Message not found.")

        user_id = session.get("user_id")
        if message.user_id != user_id:
            abort(401, "You can only edit your own messages.")

        data = request.get_json()
        content = data.get("content")

        if not content:
            abort(400, "Message content cannot be empty.")

        message.content = content 
        db.session.commit()

        return make_response(message.to_dict(), 200)

    def delete(self, id):
        message = Message.query.filter_by(id=id).first()
        if not message:
            abort(404, "Message not found.")

        db.session.delete(message)
        db.session.commit()
        return {"message": "Message deleted"}, 200

api.add_resource(MessageById, "/api/messages/<int:id>")






# app.run() method to run development server treating application as a script 
if __name__ == '__main__':
    app.run(port=5555, debug=True)
