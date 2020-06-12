// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

describe('FW-301: Some buttons need to be clicked twice to submit', () => {
  it('Publish button needs to be clicked twice on the confirmation modal for words that have media', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words')
    cy.wait(2500)
    cy.findByText('Dog', { exact: false }).clickandwait(500)

    // open
    cy.findByTestId('pageContainer').within(() => {
      cy.findByText('publish changes', { exact: false }).click()
    })
    // cancel
    cy.findByTestId('ViewWithActions__buttonCancel').click()

    // open
    cy.findByTestId('pageContainer').within(() => {
      cy.findByText('publish changes', { exact: false }).click()
    })
    // publish
    cy.findByTestId('ViewWithActions__buttonPublish').click()
    cy.findByText('Word published successfully!', { exact: false })
  })
})
