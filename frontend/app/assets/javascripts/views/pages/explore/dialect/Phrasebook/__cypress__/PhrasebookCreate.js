// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Phrasebook/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Phrasebook/internationalization.js'
describe('PhrasebookCreate.js > Phrasebook', () => {
  it('Create', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/create/phrasebook')
    cy.wait(500)
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)

    // Fill in required field
    cy.findByLabelText(copy.create.name).type('[CY] Phrase book name')

    // Resubmit
    cy.findByText(copy.create.submit).click()

    // Should see success
    cy.findByText(copy.create.success.title).should('exist')

    // Create another
    cy.findByText(copy.create.success.linkCreateAnother).click()

    // Confirm
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)
  })
})
