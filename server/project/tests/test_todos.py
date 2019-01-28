import json
import unittest

from project import db
from project.api.models import Todo
from project.tests.base import BaseTestCase


def add_todo(name):
    todo = Todo(name=name)
    db.session.add(todo)
    db.session.commit()
    return todo


class TestTodo(BaseTestCase):

    def test_ping(self):
        """Ensure the /ping route behaves correctly."""
        response = self.client.get('/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('pong!', data['message'])
        self.assertIn('success', data['status'])

    def test_add_todo(self):
        """Ensure a new todo can be added to the database."""
        with self.client:
            response = self.client.post(
                '/todos',
                data=json.dumps({'name': 'go to the farm'}),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn('Todo added!', data['message'])
            self.assertIn('success', data['status'])

    def test_add_todo_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty."""
        with self.client:
            response = self.client.post(
                '/todos',
                data=json.dumps({}),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_todo(self):
        """Ensure get single todo behaves correctly."""
        todo = add_todo('run run along')
        with self.client:
            response = self.client.get(f'/todos/{todo.id}')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn('run run along', data['data']['name'])
            self.assertFalse(data['data']['complete'])

    def test_single_todo_no_id(self):
        """Ensure error is thrown if an id is not provided."""
        with self.client:
            response = self.client.get('/todos/blah')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('Todo does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_todo_incorrect_id(self):
        """Ensure error is thrown if the id does not exist."""
        with self.client:
            response = self.client.get('/todos/999')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('Todo does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_all_todos(self):
        """Ensure get all todos behaves correctly."""
        add_todo('get down')
        add_todo('get up')
        with self.client:
            response = self.client.get('/todos')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['todos']), 2)


if __name__ == '__main__':
    unittest.main()
