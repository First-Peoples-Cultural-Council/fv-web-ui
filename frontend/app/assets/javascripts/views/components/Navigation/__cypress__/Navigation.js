// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('Navigation.js > Navigation side bar', () => {
  it('FW-266: Navigation: clicking between "Get Started", "Contribute", & "FirstVoices Apps" loads incorrect page content', () => {
    cy.visit('/home')
    cy.wait(1000)
    cy.getByTestId('Navigation__open').click()
    cy.wait(1500)
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('get started', { exact: false }).click()
    })
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('What is FirstVoices', { exact: false }).should('exist')
    })

    cy.getByTestId('Navigation__open').click()
    cy.wait(1500)
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('FirstVoices apps', { exact: false }).click()
    })
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('FirstVoices Apps', { exact: false }).should('exist')
    })
  })
  it('FW-280 Workspace switcher not switching from Public to Workspace in word and phrase detail views', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(2000)
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
  it('Testing "Sign Out" button', () => {
    // Sign in and check that the user is actually signed in
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix')
    cy.wait(1000)
    cy.get('[id="pageNavigation"]').within(() => {
      cy.getByText('WELCOME', { exact: false }).should('exist')
    })

    // Sign out and check that the user is no longer signed out
    cy.getByTestId('Navigation__open').click()
    cy.wait(500)
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('Sign Out').click()
    })
    cy.wait(1000)

    // We need to visit the home page, due to fv.disableLoginRedirect when running Nuxeo standalone
    cy.visit('/')
    cy.wait(1000)

    cy.get('[id="pageNavigation"]').within(() => {
      cy.getByText('SIGN IN').should('exist')
    })
  })
})
