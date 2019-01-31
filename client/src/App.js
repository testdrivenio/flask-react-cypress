import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      input: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };
  componentDidMount() {
    this.getTodos();
  };
  getTodos() {
    axios.get('http://localhost:5009/todos')
    .then((res) => { this.setState({ todos: res.data.data.todos }); })
    .catch((err) => { });
  };
  handleChange(e) {
    this.setState({ input: e.target.value });
  };
  addTodo() {
    if(this.state.input.length) {
      axios.post('http://localhost:5009/todos', { name: this.state.input })
      .then((res) => { this.getTodos(); })
      .catch((err) => { });
    }
  };
  handleClick(id) {
    this.setState ({
      todos: this.state.todos.map (todo => {
        if (todo.id === id) {
          todo.complete = !todo.complete;
        }
        return todo;
      }),
    });
  };
  render() {
    return (
      <div className="App">
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <h1 className="title is-1">Todo List</h1>
                <hr/>
                <div className="content">
                  <div className="field has-addons">
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Add a todo"
                        onChange={ this.handleChange }
                      />
                    </div>
                    <div className="control" onClick={ this.addTodo }>
                      <button className="button is-info">Submit</button>
                    </div>
                  </div>
                  <ul type="1">
                    {this.state.todos.map(todo =>
                      <li
                        key={ todo.id }
                        style={{
                          textDecoration: todo.complete ? 'line-through' : 'none',
                          fontSize: '1.5rem',
                        }}
                        onClick={() => this.handleClick(todo.id)}
                      >
                        { todo.name }
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
};

export default App;
