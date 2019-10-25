import 'cypress-testing-library/add-commands'
describe('AlphabetListView-Phrases.js > AlphabetListView', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    /*
    Temporary line to force the test to fail until it is updated.
   */
    cy.log('Forcing the test to fail until it is updated for dev.')
    cy.expect(true).to.equal(false)

    cy.visit('/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases')

    const letter = 'b'
    const unselectedColor = 'rgb(60, 52, 52)'

    // No message, button, or selected letters
    cy.log('No message, button, or selected letters')
    cy.queryByText(/showing phrases that start with the letter/i).should('not.exist')
    cy.queryByText(/stop browsing alphabetically/i).should('not.exist')
    cy.getByTestId('AlphabetListView').within(() => {
      cy.get('a').each(($el) => {
        cy.wrap($el)
          .should('have.css', 'color')
          .and('eq', unselectedColor)
      })
    })

    cy.AlphabetListView({
      letter,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: false,
    })

    // Is it highlighted?
    cy.log('Is it highlighted?')
    cy.getByTestId('AlphabetListView').within(() => {
      cy.getByText(letter)
        .should('have.css', 'color')
        .and('not.eq', unselectedColor)
    })

    // Is the message and clear button displayed?
    cy.log('Is the message and clear button displayed?')
    cy.queryByText(/showing phrases that start with the letter/i).should('exist')
    cy.queryByText(/stop browsing alphabetically/i).should('exist')

    // Reset
    cy.log('Reset')
    cy.queryByText(/stop browsing alphabetically/i).click()

    // Ensure all is back to normal...
    cy.log('Ensure all is back to normal...')
    cy.queryByText(/showing phrases that start with the letter/i).should('not.exist')
    cy.queryByText(/stop browsing alphabetically/i).should('not.exist')
    cy.getByTestId('AlphabetListView').within(() => {
      cy.get('a').each(($el) => {
        cy.wrap($el)
          .should('have.css', 'color')
          .and('eq', unselectedColor)
      })
    })
  })

  it('Direct link', () => {
    /*
      Temporary line to force the test to fail until it is updated.
     */
    cy.log('Forcing the test to fail until it is updated for dev.')
    cy.expect(true).to.equal(false)

    cy.log('Direct visit a url with a letter selected')
    cy.visit('/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases/alphabet/b')
    // Message & "Stop Browsing" button displayed; a letter is selected
    cy.log('Ensure message & "Stop Browsing" button is displayed and a letter is selected')
    cy.getByText(/showing phrases that start with the letter/i).should('exist')
    cy.getByTestId('AlphabetListView').within(() => {
      cy.getByText('b')
        .should('have.css', 'color')
        .and('eq', 'rgb(130, 0, 0)')
    })
    cy.getByText(/stop browsing alphabetically/i).should('exist')
  })
})
