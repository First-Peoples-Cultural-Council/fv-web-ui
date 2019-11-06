// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import 'cypress-testing-library/add-commands'
import testSearch from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearch.js'
import testSearchWords from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearchWords.js'

describe('SearchDialect-Words-Private.js > SearchDialect', () => {
  it('Should redirect with anon user, no redirect with member', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.')
    cy.expect(true).to.equal(false)

    cy.log('Trying to access private section with anon user')
    cy.visit('/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')
    cy.wait(500)
    cy.location('pathname').should('eq', '/nuxeo/app/explore/FV/sections/Data/Haisla/Haisla/Haisla/learn/words')
    cy.log('Trying to access private section with registered user')
    cy.login()
    cy.visit('/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')
    cy.wait(500)
    cy.location('pathname').should('eq', '/nuxeo/app/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')

    testSearch()
    testSearchWords()
  })
})
