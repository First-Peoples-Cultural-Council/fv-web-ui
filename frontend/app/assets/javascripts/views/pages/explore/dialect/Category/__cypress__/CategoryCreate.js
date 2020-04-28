// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Category/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Category/internationalization.js'
describe('CategoryCreate.js > Category', () => {
  it('Create', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGEEIGHT_RECORDER',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageEight/create/category')
    cy.wait(500)
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(copy.create.name).type('[CY] Category name')

    // Resubmit
    cy.getByText(copy.create.submit).click()

    // Should see success
    cy.getByText(copy.create.success.title).should('exist')

    // Create another
    cy.getByText(copy.create.success.linkCreateAnother).click()

    // Confirm
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)
  })
})
