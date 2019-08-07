// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('Navigation', () => {
  it('FW-266: Navigation: clicking between "Get Started", "Contribute", & "FirstVoices Apps" loads incorrect page content', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/')
    cy.getByText('menu open', { exact: false }).click({ force: true })
    cy.getByText('get started', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('About FirstVoices', { exact: false }).should('exist')
    })

    cy.getByText('menu open', { exact: false }).click({ force: true })
    cy.getByText('FirstVoices apps', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.queryByText('FirstVoices Apps', { exact: false }).should('exist')
    })

    cy.log('Test complete')
  })
})
