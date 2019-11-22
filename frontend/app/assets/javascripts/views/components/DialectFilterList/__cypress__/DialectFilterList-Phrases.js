import 'cypress-testing-library/add-commands'
describe('DialectFilterList-Phrases.js > DialectFilterList', () => {
  it('Select category with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    /*
      Temporary line to force the test to fail until it is updated.
   */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.visit('/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases')

    const category = 'Animals, Birds, Plants'
    cy.DialectFilterList({
      category,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
      clearFilterText: 'stop browsing by phrase book',
    })
  })
  it('FW-255: ‘Create’ button is not working after filtering by Category (Navigate to a category, click Create Phrase)', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.login()
    cy.visit('/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/phrases')

    const category = 'Animals, Birds, Plants'

    cy.DialectFilterList({
      category,
      confirmData: false,
      shouldPaginate: false,
      clearFilter: false,
    })

    cy.getByText('Create new phrase', {
      exact: false,
    }).click()

    cy.getByText('Add New Phrase to', {
      exact: false,
    }).should('exist')

    cy.log('Test complete')
  })
})
