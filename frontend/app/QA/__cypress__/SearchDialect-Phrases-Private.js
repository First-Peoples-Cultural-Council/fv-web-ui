// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import '@testing-library/cypress/add-commands'
import testSearchPhrases from './common/testSearchPhrases.js'

describe('SearchDialect-Phrases-Private.js > SearchDialect', () => {
  it('Should redirect with anon user, no redirect with member', () => {
    cy.log('Trying to access private section with anon user')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(500)
    cy.location('pathname').should('eq', '/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.log('Trying to access private section with registered user')
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(500)
    cy.location('pathname').should('eq', '/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/phrases')

    testSearchPhrases()
  })
})
