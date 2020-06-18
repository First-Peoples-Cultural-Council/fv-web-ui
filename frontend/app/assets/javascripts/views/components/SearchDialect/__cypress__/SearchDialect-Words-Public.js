// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import '@testing-library/cypress/add-commands'
import testSearch from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearch.js'
import testSearchWords from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearchWords.js'
describe('SearchDialect-Words-Public.js > SearchDialect', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words')
    testSearch()
    testSearchWords()
  })
})
function verifyDefaults() {
  cy.findByLabelText('Word').should('be.checked')
  cy.findByLabelText('Definitions').should('be.checked')
  cy.findByLabelText('Literal translations').should('not.be.checked')
  cy.findByLabelText('Parts of speech', { exact: false }).should('have.value', 'Any')
}
describe('SearchDialect-Words-Public.js > FW-936', () => {
  it('Resetting search should set to initial settings', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageTwo/learn/words')

    cy.findByText('Showing all words in the dictionary listed alphabetically').should('exist')

    // Verify Load
    verifyDefaults()

    // Change & verify
    cy.findByLabelText('Word')
      .uncheck()
      .should('not.be.checked')
    cy.findByLabelText('Definitions')
      .check()
      .should('be.checked')
    cy.findByLabelText('Literal translations')
      .check()
      .should('be.checked')
    cy.findByLabelText('Parts of speech', { exact: false })
      .select('adjective')
      .should('have.value', 'adjective')

    // Reset
    cy.findByText('reset search', { exact: false }).click()

    cy.wait(1000)

    // Verify Reset
    verifyDefaults()
  })
})
