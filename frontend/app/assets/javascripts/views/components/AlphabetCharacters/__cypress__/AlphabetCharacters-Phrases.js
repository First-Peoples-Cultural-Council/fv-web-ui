import '@testing-library/cypress/add-commands'
describe('AlphabetCharacters-Phrases.js > AlphabetCharacters', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/phrases')
    cy.wait(3000)

    const letter = 't'
    const unselectedColor = 'rgb(60, 52, 52)'

    // No message, button, or selected letters
    cy.log('No message, button, or selected letters')
    cy.findByText(/showing phrases that start with the letter/i).should('not.exist')
    cy.findByText(/stop browsing alphabetically/i).should('not.exist')
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.get('a').each(($el) => {
        cy.wrap($el)
          .should('have.css', 'color')
          .and('eq', unselectedColor)
      })
    })

    cy.AlphabetCharacters({
      letter,
      confirmData: true,
      shouldPaginate: true,
      clearFilter: false,
    })

    // Is it highlighted?
    cy.log('Is it highlighted?')
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.findByText(letter)
        .should('have.css', 'color')
        .and('not.eq', unselectedColor)
    })

    // Is the message and clear button displayed?
    cy.log('Is the message and clear button displayed?')
    cy.findByText(/showing phrases that start with the letter/i).should('exist')
    cy.findByText(/stop browsing alphabetically/i).should('exist')

    // Reset
    cy.log('Reset')
    cy.findByText(/stop browsing alphabetically/i).click()

    // Ensure all is back to normal...
    cy.log('Ensure all is back to normal...')
    cy.findByText(/showing phrases that start with the letter/i).should('not.exist')
    cy.findByText(/stop browsing alphabetically/i).should('not.exist')
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.get('a').each(($el) => {
        cy.wrap($el)
          .should('have.css', 'color')
          .and('eq', unselectedColor)
      })
    })
  })

  it('Direct link', () => {
    cy.log('Direct visit a url with a letter selected')
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/phrases/alphabet/t')
    cy.wait(2000)
    // Message & "Stop Browsing" button displayed; a letter is selected
    cy.log('Ensure message & "Stop Browsing" button is displayed and a letter is selected')
    cy.findByText(/showing phrases that start with the letter/i).should('exist')
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.findByText('t')
        .should('have.css', 'color')
        .and('eq', 'rgb(130, 0, 0)')
    })
    cy.findByText(/stop browsing alphabetically/i).should('exist')
  })
})
