from flask import Blueprint, jsonify, request

from project import db
from project.api.models import Todo


todo_blueprint = Blueprint('todos', __name__)


@todo_blueprint.route('/ping', methods=['GET'])
def ping():
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })


@todo_blueprint.route('/todos', methods=['GET'])
def get_all_todos():
    response_object = {
        'status': 'success',
        'data': {
            'todos': [todo.to_json() for todo in Todo.query.all()]
        }
    }
    return jsonify(response_object), 200


@todo_blueprint.route('/todos', methods=['POST'])
def add_todo():
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response_object), 400
    try:
        db.session.add(Todo(name=post_data.get('name')))
        db.session.commit()
        response_object['status'] = 'success'
        response_object['message'] = f'Todo added!'
        return jsonify(response_object), 201
    except Exception:
        db.session.rollback()
        return jsonify(response_object), 400


@todo_blueprint.route('/todos/<todo_id>', methods=['GET'])
def get_single_todo(todo_id):
    response_object = {
        'status': 'fail',
        'message': 'Todo does not exist'
    }
    try:
        todo = Todo.query.filter_by(id=int(todo_id)).first()
        if not todo:
            return jsonify(response_object), 404
        else:
            response_object = {
                'status': 'success',
                'data': todo.to_json()
            }
            return jsonify(response_object), 200
    except ValueError:
        return jsonify(response_object), 404
