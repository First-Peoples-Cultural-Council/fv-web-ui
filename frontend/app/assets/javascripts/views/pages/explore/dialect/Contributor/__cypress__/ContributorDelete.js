// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
// import copy from '/views/pages/explore/dialect/Contributor/internationalization'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Contributor/internationalization.js'

describe('ContributorDelete.js > Contributor', () => {
  it('Delete', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.login()
    cy.createContributor().then((response) => {
      const uid = response.body.uid
      cy.log(`--- CONTRIBUTOR ${uid} EXISTS ---`)
      const url = `http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/contributor/${uid}`
      cy.visit(url)
      cy.deleteContributor(uid).then(() => {
        cy.visit(url)
        cy.getByText(copy.detail.isTrashed)
      })
      cy.log('Test complete')
    })
  })
})
