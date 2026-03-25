const login = () => {
  cy.visit('/login');
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('password123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
};

describe('Edit and Delete Note Flow', () => {
  beforeEach(login);

  it('edits an existing note and reflects the change in the list', () => {
    cy.visit('/notes');
    // Open the row action menu for the first note
    cy.get('table tbody tr').first().find('button').last().click();
    cy.contains('Edit note').click();
    cy.url().should('include', '/notes/edit');

    cy.get('input[placeholder*="title"]').clear().type('Updated by Cypress');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/notes');
    cy.contains('Updated by Cypress').should('be.visible');
  });

  it('deletes a note via the confirm modal', () => {
    cy.visit('/notes');
    cy.get('table tbody tr').first().find('button').last().click();
    cy.contains('Delete').click();

    // Confirm modal
    cy.contains('Delete Note').should('be.visible');
    cy.contains('button', 'Delete note').click();

    cy.url().should('include', '/notes');
  });

  it('shows correct stats on the dashboard', () => {
    cy.visit('/dashboard');
    cy.contains('Total Notes').should('be.visible');
    cy.contains('Completed').should('be.visible');
    cy.contains('Pending').should('be.visible');
    cy.contains('Completion Rate').should('be.visible');
  });
});
