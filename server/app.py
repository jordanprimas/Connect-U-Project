#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Post


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Posts(Resource):
    def get(self):
        posts = [post.to_dict() for post in Post.query.all()]
        
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

api.add_resource(Posts, "/api/posts")


if __name__ == '__main__':
    app.run(port=5555, debug=True)
