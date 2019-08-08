import 'cypress-testing-library/add-commands'
describe('DialectFilterList-Words.js > DialectFilterList', () => {
  it('Select category with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/sections/Data/Haisla/Haisla/Haisla/learn/words')

    const category = 'Animals'
    cy.DialectFilterList({
      category,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
    })
  })
})
