from flask import request, jsonify
import jwt
from config import Config
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            token = token.replace('Bearer ', '')
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(*args, **kwargs)
    return decorated
