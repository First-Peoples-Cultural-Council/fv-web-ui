// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Phrasebook/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Phrasebook/internationalization.js'
describe('Phrase book', () => {
  it('Create', () => {
    // Should see error page
    cy.visit('http://0.0.0.0:3001/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/phrasebook')
    cy.queryByText(copy.errorBoundary.title).should('exist')

    // Login
    cy.login()

    cy.visit('http://0.0.0.0:3001/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/phrasebook')
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(copy.create.name).type('[CY] Phrase book name')

    // Resubmit
    cy.getByText(copy.create.submit).click()

    // Should see success
    cy.getByText(copy.create.success.title).should('exist')

    // Create another
    cy.getByText(copy.create.success.editView).click()
    cy.getByText(copy.edit.btnInitiate).click()
    cy.getByText(copy.edit.btnConfirm).click()
    cy.getByText(copy.edit.successDelete.title).should('exist')
  })
})
