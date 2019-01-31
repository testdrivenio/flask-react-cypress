const serverUrl = Cypress.env('serverUrl');

describe('todo app - e2e', () => {
  beforeEach(() => {
    // network call
    cy.server();
    cy.route('GET', `${serverUrl}/todos`).as('getAllTodos');

    cy.visit('/');
    cy.wait('@getAllTodos');
    cy.get('h1').contains('Todo List');
  });

  it('should display the todo list', () => {
    cy.get('li').its('length').should('eq', 2);
    cy.get('li').eq(0).contains('walk');
  });

  it('should toggle a todo correctly', () => {
    cy
      .get('li')
      .eq(0)
      .contains('walk')
      .should('have.css', 'text-decoration', 'none solid rgb(74, 74, 74)');
    cy.get('li').eq(0).contains('walk').click();
    cy
      .get('li')
      .eq(0).contains('walk')
      .should('have.css', 'text-decoration', 'line-through solid rgb(74, 74, 74)');
  });
});
