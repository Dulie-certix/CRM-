describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('shows the login form with all fields', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Sign in');
    cy.contains('Welcome back').should('be.visible');
  });

  it('redirects to dashboard on valid credentials', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('shows an error banner on invalid credentials', () => {
    cy.get('input[type="email"]').type('nobody@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.get('[class*="bg-red"]').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('navigates to register page via link', () => {
    cy.contains('Create one free').click();
    cy.url().should('include', '/register');
  });
});
