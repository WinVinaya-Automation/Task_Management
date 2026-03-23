from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.models import User
from db import db
from config import Config
import jwt, datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username is already registered'}), 400

    hashed_pw = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=8)
    new_user = User(username=data['username'], password=hashed_pw, role=data['role'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = jwt.encode({
        'id': user.id,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({'token': token, 'role': user.role})

@auth_bp.route('/verify', methods=['GET'])
def verify():
    token = request.headers.get('Authorization', None)
    if not token:
        return jsonify({'valid': False}), 401
    try:
        token = token.replace('Bearer ', '')
        decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return jsonify({'valid': True, 'user_id': decoded['id']})
    except:
        return jsonify({'valid': False}), 401
    
@auth_bp.route('/check-user', methods=['GET'])
def check_user():
    identifier = request.args.get('identifier')
    if not identifier:
        return jsonify({'error': 'Identifier is required'}), 400

    # Check if user exists by username or email
    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    return jsonify({'exists': bool(user)}), 200


@auth_bp.route('/reset-password', methods=['PATCH'])
def reset_password():
    data = request.json
    identifier = data.get('identifier')
    new_password = data.get('new_password')

    if not identifier or not new_password:
        return jsonify({'error': 'Missing required data'}), 400

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    hashed_pw = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=8)
    user.password = hashed_pw
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200