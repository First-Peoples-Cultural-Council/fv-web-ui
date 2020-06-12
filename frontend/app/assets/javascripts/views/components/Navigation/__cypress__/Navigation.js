// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

describe('Navigation.js > Navigation side bar', () => {
  it('FW-266: Navigation: clicking between "Get Started", "Contribute", & "FirstVoices Apps" loads incorrect page content', () => {
    cy.visit('/home')
    cy.wait(1000)
    cy.findByTestId('Navigation__open').click()
    cy.wait(1500)
    cy.findByTestId('LeftNav').within(() => {
      cy.findByText('get started', { exact: false }).click()
    })
    cy.wait(500)
    cy.findByTestId('pageContainer').within(() => {
      cy.findByText('What is FirstVoices', { exact: false }).should('exist')
    })

    cy.findByTestId('Navigation__open').click()
    cy.wait(1500)
    cy.findByTestId('LeftNav').within(() => {
      cy.findByText('FirstVoices apps', { exact: false }).click()
    })
    cy.wait(500)
    cy.findByTestId('pageContainer').within(() => {
      cy.findByText('FirstVoices Apps', { exact: false }).should('exist')
    })
  })
  it('FW-280 Workspace switcher not switching from Public to Workspace in word and phrase detail views', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(3500)
    cy.findByText('Dog').click()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      // should not be color
      cy.findByText('Workspace', { exact: false })
        .should('have.css', 'background-color')
        .and('not.eq', 'rgb(77, 148, 141)')
      cy.findByText('Workspace', { exact: false }).click()
    })
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      // should be color
      cy.get('Header', { exact: false })
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
      cy.findByText('WELCOME', { exact: false }).should('exist')
    })

    // Sign out and check that the user is no longer signed out
    cy.findByTestId('Navigation__open').click()
    cy.wait(500)
    cy.findByTestId('LeftNav').within(() => {
      cy.findByText('Sign Out').click()
    })
    cy.wait(1000)

    // We need to visit the home page, due to fv.disableLoginRedirect when running Nuxeo standalone
    cy.visit('/')
    cy.wait(1000)

    cy.get('[id="pageNavigation"]').within(() => {
      cy.findByText('SIGN IN').should('exist')
    })
  })
})
