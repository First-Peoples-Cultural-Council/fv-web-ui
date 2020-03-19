describe('registration.js > Register', () => {
  it('Should invalidate and revalidate', () => {
    cy.visit('/register')
    cy.wait(500)

    // trigger validation
    cy.get('#pageContainer')
      .contains('button', 'Register')
      .click()

    cy.get('.error-block')
      .contains('provide your first name')
      .should('exist')
    cy.get('.error-block')
      .contains('provide your last name')
      .should('exist')
    cy.get('.error-block')
      .contains('provide your email')
      .should('exist')
    cy.get('.error-block')
      .contains('let us know or pick')
      .should('exist')
    cy.get('.error-block')
      .contains('choose a community')
      .should('exist')

    // Update input
    cy.get("[name='userinfo:firstName']").type('first-name')
    cy.get("[name='userinfo:email']").type('email@mailinator.com')
    cy.get("[name='userinfo:lastName']").type('last-name')
    cy.get("[name='fvuserinfo:role']").select('learner-1')

    // Re-validate
    cy.get('#pageContainer')
      .contains('button', 'Register')
      .click()

    cy.get('.error-block')
      .contains('provide your first name')
      .should('not.exist')
    cy.get('.error-block')
      .contains('provide your email')
      .should('not.exist')
    cy.get('.error-block')
      .contains('let us know or pick')
      .should('not.exist')
    cy.get('.error-block')
      .contains('provide your last name')
      .should('not.exist')
  })
})
