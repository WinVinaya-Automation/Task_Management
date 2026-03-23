from flask import Blueprint, request, jsonify
from db import db
from models.models import Project
from datetime import datetime

projects_bp = Blueprint('projects', __name__)

# Get all projects
@projects_bp.route('/get', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        "id": str(p.id),
        "type": p.type,
        "title": p.title,
        "description": p.description,
        "status": p.status.value,
        "priority": p.priority.value,
        "tags": p.tags or [],
        "due_date": p.due_date.isoformat() if p.due_date else None,
        "owner_name": p.owner_name,
        "created_at": p.created_at.isoformat()
    } for p in projects])

# Get a single project
@projects_bp.route('/get/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify({
        "id": str(project.id),
        "type": project.type,
        "title": project.title,
        "description": project.description,
        "status": project.status.value,
        "priority": project.priority.value,
        "tags": project.tags or [],
        "due_date": project.due_date.isoformat() if project.due_date else None,
        "owner_name": project.owner_name,
        "created_at": project.created_at.isoformat()
    })

# Create a new project
@projects_bp.route('/post', methods=['POST'])
def create_project():
    data = request.get_json()

    if not data.get('type'):
        return jsonify({'error': 'type is required'}), 400
    if not data.get('title'):
        return jsonify({'error': 'title is required'}), 400
    if not data.get('owner_name'):
        return jsonify({'error': 'owner_name is required'}), 400

    due_date = data.get('due_date')
    if due_date:
        due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))

    new_project = Project(
        type=data['type'],
        title=data['title'],
        description=data.get('description'),
        status=data.get('status', 'todo'),
        priority=data.get('priority', 'medium'),
        tags=data.get('tags', []),
        due_date=due_date,
        owner_name=data['owner_name']
    )

    db.session.add(new_project)
    db.session.commit()
    return jsonify({
        "id": str(new_project.id),
        "type": new_project.type,
        "title": new_project.title,
        "description": new_project.description,
        "status": new_project.status.value,
        "priority": new_project.priority.value,
        "tags": new_project.tags or [],
        "due_date": new_project.due_date.isoformat() if new_project.due_date else None,
        "owner_name": new_project.owner_name,
        "created_at": new_project.created_at.isoformat()
    }), 201

# Update a project
@projects_bp.route('/put/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()

    if 'type' in data:
        project.type = data['type']
    if 'title' in data:
        project.title = data['title']
    if 'description' in data:
        project.description = data['description']
    if 'status' in data:
        project.status = data['status']
    if 'priority' in data:
        project.priority = data['priority']
    if 'tags' in data:
        project.tags = data['tags']
    if 'due_date' in data:
        if data['due_date']:
            project.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        else:
            project.due_date = None
    if 'owner_name' in data:
        project.owner_name = data['owner_name']

    db.session.commit()
    return jsonify({
        "id": str(project.id),
        "type": project.type,
        "title": project.title,
        "description": project.description,
        "status": project.status.value,
        "priority": project.priority.value,
        "tags": project.tags or [],
        "due_date": project.due_date.isoformat() if project.due_date else None,
        "owner_name": project.owner_name,
        "created_at": project.created_at.isoformat()
    })

# Delete a project
@projects_bp.route('/delete/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully'})