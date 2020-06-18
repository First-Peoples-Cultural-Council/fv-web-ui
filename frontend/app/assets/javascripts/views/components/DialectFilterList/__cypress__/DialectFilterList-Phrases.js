describe('DialectFilterList-Phrases.js > DialectFilterList', () => {
  it('Select category with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(2000)

    const category = 'TestPhraseBook'
    cy.DialectFilterList({
      category,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
      clearFilterText: 'stop browsing by phrase book',
    })
  })
  it('FW-255: ‘Create’ button is not working after filtering by Category (Navigate to a category, click Create Phrase)', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(1000)

    const category = 'TestPhraseBook'

    cy.DialectFilterList({
      category,
      confirmData: false,
      shouldPaginate: false,
      clearFilter: false,
    })

    cy.findByText('Create new phrase', {
      exact: false,
    }).click()
    cy.wait(500)

    cy.findByText('Add New Phrase to', {
      exact: false,
    }).should('exist')

    cy.log('Test complete')
  })

  it('FW-1106: After clearing a `filter by category`, clicking on sort re-enables filtering by category', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(1000)

    const category = 'TestPhraseBook'

    cy.DialectFilterList({
      category,
      confirmData: false,
      confirmActiveClass: true,
      activeClassName: 'DialectFilterListLink--active',
      shouldPaginate: false,
      clearFilter: true,
      clearFilterText: 'stop browsing by',
    })

    cy.get('.DictionaryList__data--title .DictionaryList__colSort').click()
    cy.wait(500)
    cy.findByTestId('DialectFilterList').within(() => {
      cy.findByText(category).should('not.have.class', 'DialectFilterListLink--active')
    })
  })

  it("FW-1105: When filtering by category, sorting doesn't work", () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(1000)

    const category = 'TestPhraseBook'

    cy.DialectFilterList({
      category,
      confirmData: false,
      shouldPaginate: false,
      clearFilter: false,
    })

    cy.queryAllByTestId('DictionaryList__row')
      .eq(0)
      .within(() => {
        cy.findByText('TestPhraseEight').should('exist')
      })
    cy.get('.DictionaryList__data--title .DictionaryList__colSort').click()
    cy.wait(500)
    cy.queryAllByTestId('DictionaryList__row')
      .eq(0)
      .within(() => {
        cy.findByText('TestPhraseTwo').should('exist')
      })
  })
})
