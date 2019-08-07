// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import 'cypress-testing-library/add-commands'
import testSearchPhrases from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearchPhrases.js'

describe('SearchDialectPhrases-Public.js > SearchDialect', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases')
    testSearchPhrases()
    cy.log('Test complete')
  })
})
