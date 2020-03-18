// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('SearchStrategy.js', () => {
  //TODO uncomment the following approximate search test once FW-1117 is completed.

  // it('Approximate search', () => {
  //   cy.login({
  //     userName: 'TESTLANGUAGESIX_ADMIN',
  //   })
  //   cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words/')
  //   cy.wait(1000)
  //   cy.get('.SearchDialectFormSelectSearchType').select('approx')
  //   cy.getByTestId('SearchDialectFormPrimaryInput').type('Dob')
  //   cy.getByText('Search Words').click()
  //   cy.wait(2000)
  //   cy.queryAllByTestId('DictionaryList__row')
  //     .eq(0)
  //     .within(() => {
  //       cy.getByText('Dog').should('exist')
  //     })
  // })
  it('Exact search', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(1000)
    cy.get('.SearchDialectFormSelectSearchType').select('exact')
    cy.getByTestId('SearchDialectFormPrimaryInput').type('Ox')
    cy.getByText('Search Words').click()
    cy.wait(2000)
    cy.queryAllByTestId('DictionaryList__row')
      .eq(0)
      .within(() => {
        cy.getByText('Ox').should('exist')
      })
  })
  it('Contains search', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(1000)
    cy.get('.SearchDialectFormSelectSearchType').select('contains')
    cy.getByTestId('SearchDialectFormPrimaryInput').type('rago')
    cy.getByText('Search Words').click()
    cy.queryByText('Dragon').should('exist')
  })
  it('Starts with search', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(1000)
    cy.get('.SearchDialectFormSelectSearchType').select('starts_with')
    cy.getByTestId('SearchDialectFormPrimaryInput').type('Ra')
    cy.getByText('Search Words').click()
    cy.wait(2000)
    cy.queryAllByTestId('DictionaryList__row')
      .eq(0)
      .within(() => {
        cy.getByText('Rabbit').should('exist')
      })
    cy.queryAllByTestId('DictionaryList__row')
      .eq(1)
      .within(() => {
        cy.getByText('Rat').should('exist')
      })
  })
  it('Ends with search', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(1000)
    cy.get('.SearchDialectFormSelectSearchType').select('ends_with')
    cy.getByTestId('SearchDialectFormPrimaryInput').type('er')
    cy.getByText('Search Words').click()
    cy.wait(2000)
    cy.queryAllByTestId('DictionaryList__row')
      .eq(0)
      .within(() => {
        cy.getByText('Rooster').should('exist')
      })
    cy.queryAllByTestId('DictionaryList__row')
      .eq(1)
      .within(() => {
        cy.getByText('Tiger').should('exist')
      })
  })
  it('Wildcard search', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/words/')
    cy.wait(1000)
    cy.get('.SearchDialectFormSelectSearchType').select('wildcard')
    cy.getByTestId('SearchDialectFormPrimaryInput').type('R*t')
    cy.getByText('Search Words').click()
    cy.wait(2000)
    cy.queryAllByTestId('DictionaryList__row')
      .eq(0)
      .within(() => {
        cy.getByText('Rabbit').should('exist')
      })
    cy.queryAllByTestId('DictionaryList__row')
      .eq(1)
      .within(() => {
        cy.getByText('Rat').should('exist')
      })
  })
})
