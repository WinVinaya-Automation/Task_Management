from flask import Blueprint, request, jsonify
from db import db
from models.models import User

users_bp = Blueprint('users', __name__)

# ✅ Get all users
@users_bp.route('/get', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "password": u.password  # ⚠️ For testing only; do not send plain passwords in production
    } for u in users])

# ✅ Create a new user
@users_bp.route('/post', methods=['POST'])
def create_user():
    data = request.get_json()

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400

    new_user = User(
        username=data['username'],
        password=data['password'],  # ⚠️ Insecure: use hashing (e.g., bcrypt) in production
        email=data['email'],
        role=data.get('role', 'employee')
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role
    }), 201

# ✅ Update user (password and/or role)
@users_bp.route('/put/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'password' in data:
        user.password = data['password']
    if 'role' in data:
        user.role = data['role']

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

# ✅ Delete a user
@users_bp.route('/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

# ✅ PATCH only the role of a user
@users_bp.route('/update-role/<int:user_id>', methods=['PATCH'])
def update_user_role(user_id):
    data = request.get_json()
    new_role = data.get("role")

    if new_role not in ["admin", "employee"]:
        return jsonify({"error": "Invalid role provided"}), 400

    user = User.query.get_or_404(user_id)
    user.role = new_role
    db.session.commit()
    return jsonify({"message": "Role updated successfully"}), 200
