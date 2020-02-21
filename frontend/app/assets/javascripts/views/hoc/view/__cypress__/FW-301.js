// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('FW-301: Some buttons need to be clicked twice to submit', () => {
  it('Publish button needs to be clicked twice on the confirmation modal for words that have media', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words')
    cy.wait(2500)
    cy.getByText('Dog', { exact: false }).clickandwait(500)

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
