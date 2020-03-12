describe('DialectFilterList-Words.js > DialectFilterList', () => {
  it('Select category with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words')
    cy.wait(500)

    const category = 'TestCategory'
    cy.DialectFilterList({
      category,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
    })
  })
  it('FW-255: ‘Create’ button is not working after filtering by Category (Navigate to a category, click Create Word)', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words')
    cy.wait(500)

    const category = 'TestCategory'
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
