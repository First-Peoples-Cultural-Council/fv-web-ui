// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Contributor/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Contributor/internationalization.js'

describe('ContributorCreateDelete.js > Contributor', () => {
  it('Create', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/create/contributor')
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in Name
    cy.getByLabelText(`${copy.create.name} *`).type('[CY] Contributor name')

    // Resubmit
    cy.getByText(copy.create.submit).click()

    // Should see success
    cy.getByText(copy.create.success.title).should('exist')

    // Visit edit & delete contributor:
    cy.getByText(copy.create.success.linkEdit).click()
    cy.getByText(copy.edit.btnInitiate).click()
    cy.getByText(copy.edit.btnConfirm).click()
    cy.getByText(copy.edit.successDelete.title).should('exist')
  })
})
