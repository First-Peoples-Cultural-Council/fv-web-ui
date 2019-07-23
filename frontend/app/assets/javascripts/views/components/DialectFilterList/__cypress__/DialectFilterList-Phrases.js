import 'cypress-testing-library/add-commands'
describe('DialectFilterListPhrases', () => {
  it('Select category with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases')

    const category = 'Animals, Birds, Plants'
    cy.DialectFilterList({
      category,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
      clearFilterText: 'stop browsing by phrase book',
    })
    cy.log('Test complete')
  })
})
