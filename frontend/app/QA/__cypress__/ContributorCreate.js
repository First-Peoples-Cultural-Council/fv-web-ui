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
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)

    // Fill in Name
    cy.findByLabelText(`${copy.create.name} *`).type('[CY] Contributor name')

    // Resubmit
    cy.findByText(copy.create.submit).click()

    // Should see success
    cy.findByText(copy.create.success.title).should('exist')

    // Visit edit & delete contributor:
    cy.findByText(copy.create.success.linkEdit).click()
    cy.findByText(copy.edit.btnInitiate).click()
    cy.findByText(copy.edit.btnConfirm).click()
    cy.findByText(copy.edit.successDelete.title).should('exist')
  })
})
