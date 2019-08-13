// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import 'cypress-testing-library/add-commands'
import testSearchPhrases from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearchPhrases.js'

describe('SearchDialectPhrases-Private.js > SearchDialect', () => {
  it('Should redirect with anon user, no redirect with member', () => {
    cy.log('Trying to access private section with anon user')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/phrases')
    cy.wait(500)
    cy.location('pathname').should('eq', '/nuxeo/app/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases')
    cy.log('Trying to access private section with registered user')
    cy.login()
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/phrases')
    cy.wait(500)
    cy.location('pathname').should('eq', '/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/phrases')

    testSearchPhrases()
  })
})
