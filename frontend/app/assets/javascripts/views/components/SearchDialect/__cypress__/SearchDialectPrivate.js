// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import 'cypress-testing-library/add-commands'
import testSearch from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearch.js'

describe('SearchDialectPrivate', () => {
  it('Should redirect with anon user, no redirect with member', () => {
    cy.log('Trying to access private section with anon user')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')
    cy.location('pathname').should('eq', '/nuxeo/app/explore/FV/sections/Data/Haisla/Haisla/Haisla/learn/words')
    cy.log('Trying to access private section with registered user')
    cy.login(
      'https://preprod.firstvoices.com/nuxeo/login.jsp?nxtimeout=true&forceAnonymousLogin=true&requestedUrl=nxstartup.faces'
    )
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')
    cy.location('pathname').should('eq', '/nuxeo/app/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')

    testSearch()
  })
})
