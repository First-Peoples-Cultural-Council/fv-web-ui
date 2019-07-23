// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Recorder/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Recorder/internationalization.js'

describe('Recorder', () => {
  it('Create', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    // Login
    cy.login()

    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/recorder')
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(`${copy.create.name} *`).type('[CY] Contributor Name')

    // Resubmit
    cy.getByText(copy.create.submit).click()

    // Should see success
    cy.getByText(copy.create.success.title).should('exist')

    // Create another
    cy.getByText(copy.create.success.createAnother).click()

    // Confirm
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)
    cy.log('Test complete')
  })
})
