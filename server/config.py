# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_bcrypt import Bcrypt, generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_session import Session
import secrets
import os
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv


# Local imports

# Instantiate app, set attributes
app = Flask(__name__)


#Generate and set secret key
app.secret_key = secrets.token_hex(24)

bcrypt = Bcrypt(app)
oauth = OAuth(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SERVER_NAME'] = 'localhost:5555'

app.config['SESSION_PERMANENT'] = True

Session(app)



# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

# Configure oauth
load_dotenv()
google = oauth.register(
    name='google',
    client_id= os.getenv('CLIENT_ID'),
    client_secret= os.getenv('CLIENT_SECRET'),
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'email profile'},
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)

print(google.client_id)