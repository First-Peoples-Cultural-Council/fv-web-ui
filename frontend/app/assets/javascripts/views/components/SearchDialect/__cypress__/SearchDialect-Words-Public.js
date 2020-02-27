// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import 'cypress-testing-library/add-commands'
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
  cy.getByLabelText('Word').should('be.checked')
  cy.getByLabelText('Definitions').should('not.be.checked')
  cy.getByLabelText('Literal translations').should('not.be.checked')
  cy.getByLabelText('Parts of speech', { exact: false }).should('have.value', 'Any')
}
describe('SearchDialect-Words-Public.js > FW-936', () => {
  it('Resetting search should set to initial settings', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageTwo/learn/words')

    cy.getByText('Showing all words in the dictionary listed alphabetically').should('exist')

    // Verify Load
    verifyDefaults()

    // Change & verify
    cy.getByLabelText('Word')
      .uncheck()
      .should('not.be.checked')
    cy.getByLabelText('Definitions')
      .check()
      .should('be.checked')
    cy.getByLabelText('Literal translations')
      .check()
      .should('be.checked')
    cy.getByLabelText('Parts of speech', { exact: false })
      .select('adjective')
      .should('have.value', 'adjective')

    // Reset
    cy.getByText('reset search', { exact: false }).click()

    cy.wait(1000)

    // Verify Reset
    verifyDefaults()
  })
})
