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
  it('FW-255: ‘Create’ button is not working after filtering by Category (Navigate to a category, click Create Word)', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.login()
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Haisla/Haisla/Haisla/learn/words')

    const category = 'Animals'
    cy.DialectFilterList({
      category,
      confirmData: false,
      shouldPaginate: false,
      clearFilter: false,
    })
    cy.getByText('Create new word', {
      exact: false,
    }).click()
    cy.wait(500)
    cy.getByText('Add New Word to', {
      exact: false,
    }).should('exist')

    cy.log('Test complete')
  })
})
