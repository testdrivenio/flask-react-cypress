const serverUrl = Cypress.env('serverUrl');

describe('todo app', () => {
  beforeEach(() => {
    // fixtures
    cy.fixture('todos/all_before.json').as('todosJSON');
    cy.fixture('todos/add.json').as('addTodoJSON');
    cy.fixture('todos/all_after.json').as('updatedJSON');

    // network stub
    cy.server();
    cy.route('GET', `${serverUrl}/todos`, '@todosJSON').as('getAllTodos');


    cy.visit('/');
    cy.wait('@getAllTodos');
    cy.get('h1').contains('Todo List');
  });

  it('should display the todo list', () => {
    cy.get('li').its('length').should('eq', 3);
    cy.get('li').eq(0).contains('go for a walk');
  });

  it('should add a new todo to the list', () => {
    // network stubs
    cy.server();
    cy.route('GET', 'http://localhost:5009/todos', '@updatedJSON').as('getAllTodos');
    cy.route('POST', 'http://localhost:5009/todos', '@addTodoJSON').as('addTodo');

    // asserts
    cy.get('.input').type('drink a beverage');
    cy.get('.button').contains('Submit').click();
    cy.wait('@addTodo');
    cy.wait('@getAllTodos');
    cy.get('li').its('length').should('eq', 4);
    cy.get('li').eq(0).contains('go for a walk');
    cy.get('li').eq(3).contains('drink a beverage');
  });

  it('should toggle a todo correctly', () => {
    cy
      .get('li')
      .eq(0)
      .contains('go for a walk')
      .should('have.css', 'text-decoration', 'none solid rgb(74, 74, 74)');
    cy.get('li').eq(0).contains('go for a walk').click();
    cy
      .get('li')
      .eq(0).contains('go for a walk')
      .should('have.css', 'text-decoration', 'line-through solid rgb(74, 74, 74)');
  });
});
