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
