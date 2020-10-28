// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
import copy from '../../../app/components/Recorder/copy.js'

describe('RecorderCreate.js > RecorderCreate', () => {
  it('Create', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/create/recorder')
    cy.wait(500)
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)

    // Fill in required field
    cy.findByLabelText(`${copy.create.name} *`).type('[CY] Contributor Name')

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
