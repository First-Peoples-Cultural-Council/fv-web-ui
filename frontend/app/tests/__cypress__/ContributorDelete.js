// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
import copy from '../../../app/components/Contributor/copy.js'

describe('ContributorDelete.js > Contributor', () => {
  it('Delete', () => {
    cy.login({
      userName: 'TestDialectPublic_language_administrators',
      userPassword: 'TestDialectPublic_language_administrators',
    })
    cy.createContributor('TestDialectPublic').then((response) => {
      const uid = response.body.uid
      cy.log(`--- CONTRIBUTOR ${uid} EXISTS ---`)
      const url = Cypress.env('FRONTEND') + `/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/contributor/${uid}`
      cy.visit(url)
      cy.deleteContributor(uid).then(() => {
        cy.visit(url)
        cy.findByText(copy.detail.isTrashed)
      })
    })
  })
})
