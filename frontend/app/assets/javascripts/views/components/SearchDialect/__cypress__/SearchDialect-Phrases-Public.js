// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import '@testing-library/cypress/add-commands'
import testSearchPhrases from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearchPhrases.js'

describe('SearchDialect-Phrases-Public.js > SearchDialect', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/phrases')
    testSearchPhrases()
  })
})

function verifyDefaults() {
  cy.findByLabelText('Phrase').should('be.checked')
  cy.findByLabelText('Definitions').should('be.checked')
  cy.findByLabelText('Cultural notes').should('not.be.checked')
}
describe('SearchDialect-Phrases-Public.js > FW-936', () => {
  it('Resetting search should set to initial settings', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageTwo/learn/phrases')

    cy.findByText('Showing all phrases', { exact: false }).should('exist')

    // Verify Load
    verifyDefaults()

    // Change & verify
    cy.findByLabelText('Phrase')
      .uncheck()
      .should('not.be.checked')
    cy.findByLabelText('Definitions')
      .check()
      .should('be.checked')
    cy.findByLabelText('Cultural notes')
      .check()
      .should('be.checked')

    // Reset
    cy.findByText('reset search', { exact: false }).click()

    cy.wait(1000)

    // Verify Reset
    verifyDefaults()
  })
})
