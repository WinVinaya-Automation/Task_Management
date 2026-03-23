from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from db import db
from models.models import Task, TaskStatus, TaskPriority

tasks_bp = Blueprint('tasks', __name__)

# ✅ Get all tasks
@tasks_bp.route('/get', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks])

# ✅ Get a single task
@tasks_bp.route('/get/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

# ✅ Get tasks by project
@tasks_bp.route('/get/project/<int:project_id>', methods=['GET'])
def get_tasks_by_project(project_id):
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify([t.to_dict() for t in tasks])

# ✅ Create a new task
@tasks_bp.route('/post', methods=['POST'])
def create_task():
    data = request.get_json()

    if not data.get('title'):
        return jsonify({'error': 'title is required'}), 400
    if not data.get('project_id'):
        return jsonify({'error': 'project_id is required'}), 400

    status_value = data.get('status', 'todo')
    try:
        status = TaskStatus(status_value)
    except ValueError:
        return jsonify({'error': f"Invalid status '{status_value}'. Must be todo, in_progress, or done"}), 400

    priority_value = data.get('priority', 'medium')
    try:
        priority = TaskPriority(priority_value)
    except ValueError:
        return jsonify({'error': f"Invalid priority '{priority_value}'. Must be low, medium, or high"}), 400

    completed_at = None
    if status == TaskStatus.done:
        completed_at = datetime.now(timezone.utc)

    new_task = Task(
        project_id=data['project_id'],
        title=data['title'],
        description=data.get('description'),
        status=status,
        priority=priority,
        due_date=data.get('due_date'),
        tags=data.get('tags', []),
        completed_at=completed_at
    )

    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

# ✅ Update a task
@tasks_bp.route('/put/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'due_date' in data:
        task.due_date = data['due_date']
    if 'project_id' in data:
        task.project_id = data['project_id']
    if 'tags' in data:
        task.tags = data['tags']
    if 'priority' in data:
        try:
            task.priority = TaskPriority(data['priority'])
        except ValueError:
            return jsonify({'error': f"Invalid priority '{data['priority']}'. Must be low, medium, or high"}), 400
    if 'status' in data:
        try:
            new_status = TaskStatus(data['status'])
            task.status = new_status
            if new_status == TaskStatus.done and not task.completed_at:
                task.completed_at = datetime.now(timezone.utc)
            elif new_status != TaskStatus.done:
                task.completed_at = None
        except ValueError:
            return jsonify({'error': f"Invalid status '{data['status']}'. Must be todo, in_progress, or done"}), 400

    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})

# ✅ Delete a task
@tasks_bp.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

# ✅ PATCH only the status of a task
@tasks_bp.route('/update-status/<int:task_id>', methods=['PATCH'])
def update_task_status(task_id):
    data = request.get_json()
    new_status = data.get('status')

    try:
        task_status = TaskStatus(new_status)
    except ValueError:
        return jsonify({'error': f"Invalid status '{new_status}'. Must be todo, in_progress, or done"}), 400

    task = Task.query.get_or_404(task_id)
    task.status = task_status
    if task_status == TaskStatus.done and not task.completed_at:
        task.completed_at = datetime.now(timezone.utc)
    elif task_status != TaskStatus.done:
        task.completed_at = None

    db.session.commit()
    return jsonify({'message': 'Status updated successfully'}), 200

# ✅ PATCH only the priority of a task
@tasks_bp.route('/update-priority/<int:task_id>', methods=['PATCH'])
def update_task_priority(task_id):
    data = request.get_json()
    new_priority = data.get('priority')

    try:
        task_priority = TaskPriority(new_priority)
    except ValueError:
        return jsonify({'error': f"Invalid priority '{new_priority}'. Must be low, medium, or high"}), 400

    task = Task.query.get_or_404(task_id)
    task.priority = task_priority
    db.session.commit()
    return jsonify({'message': 'Priority updated successfully'}), 200