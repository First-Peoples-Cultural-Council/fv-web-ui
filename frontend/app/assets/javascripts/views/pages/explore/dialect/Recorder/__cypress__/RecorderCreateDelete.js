// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Recorder/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Recorder/internationalization.js'

describe('RecorderCreateDelete.js > RecorderCreate', () => {
  it('Create', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')

    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/recorder')
    cy.queryByText(copy.errorBoundary.title).should('exist')

    // Login
    cy.login()

    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/recorder')
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(`${copy.create.name} *`).type('[CY] Recorder Name')

    // Resubmit
    cy.getByText(copy.create.submit).click()

    // Should see success
    cy.getByText(copy.create.success.title).should('exist')

    // Visit Edit, then delete
    cy.getByText(copy.create.success.linkEdit).click()
    cy.getByText(copy.edit.btnInitiate).click()
    cy.getByText(copy.edit.btnConfirm).click()
    cy.getByText(copy.edit.successDelete.title).should('exist')

    cy.log('Test complete')
  })
})
