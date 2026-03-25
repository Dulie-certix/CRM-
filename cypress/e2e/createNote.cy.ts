const login = () => {
  cy.visit('/login');
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('password123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
};

describe('Create Note Flow', () => {
  beforeEach(login);

  it('navigates to the Add Note page', () => {
    cy.visit('/notes/add');
    cy.get('h1').should('contain.text', 'New Note');
  });

  it('creates a new note and shows it in the list', () => {
    cy.visit('/notes/add');
    cy.get('input[placeholder*="title"]').type('Cypress Test Note');
    cy.get('textarea').type('Created by Cypress E2E test suite');
    cy.get('select').select('pending');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/notes');
    cy.contains('Cypress Test Note').should('be.visible');
  });

  it('shows validation errors when submitting empty form', () => {
    cy.visit('/notes/add');
    cy.get('button[type="submit"]').click();
    cy.contains('Title is required').should('be.visible');
    cy.contains('Description is required').should('be.visible');
  });
});
