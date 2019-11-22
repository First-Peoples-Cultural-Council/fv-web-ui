// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('FW-301: Some buttons need to be clicked twice to submit', () => {
  it('Publish button needs to be clicked twice on the confirmation modal for words that have media', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    // Login
    cy.login({ url: 'https://dev.firstvoices.com/nuxeo/startup' })

    cy.visit('/explore/FV/Workspaces/Data/Cypress/Cypress/Cypress/learn/words/e96a4d91-030e-4d5f-9e69-5735e048995f')

    // open
    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('publish changes', { exact: false }).click()
    })
    // cancel
    cy.getByTestId('ViewWithActions__buttonCancel').click()

    // open
    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('publish changes', { exact: false }).click()
    })
    // publish
    cy.getByTestId('ViewWithActions__buttonPublish').click()
    cy.getByText('Word published successfully!', { exact: false })
  })
})
