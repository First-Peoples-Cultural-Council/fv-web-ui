// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Contributor/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Contributor/internationalization.js'

describe('ContributorDelete.js > Contributor', () => {
  it('Delete', () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.createContributor().then((response) => {
      const uid = response.body.uid
      cy.log(`--- CONTRIBUTOR ${uid} EXISTS ---`)
      const url = Cypress.env('FRONTEND') + `/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/contributor/${uid}`
      cy.visit(url)
      cy.deleteContributor(uid).then(() => {
        cy.visit(url)
        cy.findByText(copy.detail.isTrashed)
      })
    })
  })
})
