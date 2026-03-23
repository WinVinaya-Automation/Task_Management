from flask import Flask
from flask_cors import CORS
from config import Config
from db import db

# Blueprints
from routes.auth import auth_bp
from routes.user_routes import users_bp
from routes.project_routes import projects_bp
from routes.task_routers import tasks_bp
from flask_migrate import Migrate


app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(users_bp, url_prefix="/user-api")
app.register_blueprint(projects_bp, url_prefix="/project-api")
app.register_blueprint(tasks_bp, url_prefix="/task-api")

@app.route('/')
def index():
    return {'message': 'API running!'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
