// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('Navigation.js > Navigation', () => {
  it('FW-266: Navigation: clicking between "Get Started", "Contribute", & "FirstVoices Apps" loads incorrect page content', () => {
    /*
    Temporary line to force the test to fail until it is updated.
   */
    cy.log('Forcing the test to fail until Site resources files are added.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.visit('/home')
    cy.getByText('menu open', { exact: false }).click({ force: true })
    cy.getByText('get started', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('What is FirstVoices', { exact: false }).should('exist')
    })

    cy.getByText('menu open', { exact: false }).click({ force: true })
    cy.getByText('FirstVoices apps', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('FirstVoices Apps', { exact: false }).should('exist')
    })
  })
  it('FW-280 Workspace switcher not switching from Public to Workspace in word and phrase detail views', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.getByText('Dog').click()
    cy.wait(1500)
    cy.getByTestId('pageContainer').within(() => {
      // should not be color
      cy.getByText('Workspace', { exact: false })
        .should('have.css', 'background-color')
        .and('not.eq', 'rgb(77, 148, 141)')
      cy.getByText('Workspace', { exact: false }).click()
    })
    cy.wait(1500)
    cy.getByTestId('pageContainer').within(() => {
      // should be color
      cy.getByText('Workspace', { exact: false })
        .should('have.css', 'background-color')
        .and('eq', 'rgb(77, 148, 141)')
    })
  })
})
