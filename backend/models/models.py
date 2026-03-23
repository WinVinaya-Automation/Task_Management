import enum
from datetime import datetime, timezone

from db import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='employee')

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,  
            "email": self.email,
            "role": self.role,
        }


class ProjectStatus(enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"
    overdue = "overdue"
    hold = "hold"


class ProjectPriority(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.Enum(ProjectStatus),
        nullable=False,
        default=ProjectStatus.todo
    )
    priority = db.Column(
        db.Enum(ProjectPriority),
        nullable=False,
        default=ProjectPriority.medium
    )
    tags = db.Column(db.JSON, nullable=True, default=list)
    due_date = db.Column(db.Date, nullable=True)
    owner_name = db.Column(
        db.String(80),
        # db.ForeignKey("users.username"),
        nullable=False
    )   
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,  
            "title": self.title,
            "description": self.description,
            "status": self.status.value,
            "priority": self.priority.value,
            "tags": self.tags or [],
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "owner_name": self.owner_name,
            "created_at": self.created_at.isoformat(),
        }


class TaskStatus(enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"
    overdue = "overdue"
    hold = "hold"


class TaskPriority(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.Enum(TaskStatus),
        nullable=False,
        default=TaskStatus.todo
    )
    priority = db.Column(
        db.Enum(TaskPriority),
        nullable=False,
        default=TaskPriority.medium
    )
    due_date = db.Column(db.Date, nullable=True)
    tags = db.Column(db.JSON, nullable=True, default=list)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
    completed_at = db.Column(db.DateTime(timezone=True), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "title": self.title,
            "description": self.description,
            "status": self.status.value,
            "priority": self.priority.value,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "tags": self.tags or [],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }