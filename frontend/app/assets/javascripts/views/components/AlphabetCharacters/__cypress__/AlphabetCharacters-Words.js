import '@testing-library/cypress/add-commands'
describe('AlphabetCharacters-Words.js > AlphabetCharacters', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words')

    const letter = 't'
    const unselectedColor = 'rgb(60, 52, 52)'

    // No message, button, or selected letters
    cy.findByText(/Showing all words in the dictionary/i).should('exist')
    cy.findByText('AlphabetCharacters').within(() => {
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
    cy.findByText(/showing words that start with the letter/i).should('exist')
    cy.findByText(/stop browsing alphabetically/i).should('exist')

    // Reset
    cy.log('Reset')
    cy.findByText(/stop browsing alphabetically/i).click()

    // Ensure all is back to normal...
    cy.log('Ensure all is back to normal...')
    cy.findByText(/Showing all words in the dictionary/i).should('exist')
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.get('a').each(($el) => {
        cy.wrap($el)
          .should('have.css', 'color')
          .and('eq', unselectedColor)
      })
    })
  })

  it('Direct link: displays message, selected letter, & stop browsing buton', () => {
    cy.log('Direct visit a url with a letter selected')
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words/alphabet/t')
    cy.wait(2000)
    // Message & "Stop Browsing" button displayed; a letter is selected
    cy.log('Ensure message & "Stop Browsing" button is displayed and a letter is selected')
    cy.findByText(/showing words that start with the letter/i).should('exist')
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.findByText('t')
        .should('have.css', 'color')
        .and('eq', 'rgb(130, 0, 0)')
    })
    cy.findByText(/stop browsing alphabetically/i).should('exist')
  })

  it('Clicking on a letter should filter out the words that start with that letter', () => {
    // Visit words page
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words')

    // Filter by the letter r
    cy.wait(500)
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.findByText('r').click()
    })
    cy.wait(500)
    // Check that only words starting with r are shown
    cy.findByText('Dog').should('not.exist')
    cy.findByText('Pig').should('not.exist')
    cy.findByText('Rabbit').should('exist')
    cy.findByText('Rat').should('exist')
    cy.findByText('Rooster').should('exist')
    cy.findByText('Snake').should('not.exist')

    // Filter by the letter t
    cy.findByTestId('AlphabetCharacters').within(() => {
      cy.findByText('t').click()
    })
    cy.wait(500)
    // Check that only words starting with t are shown
    cy.findByText('Dog').should('not.exist')
    cy.findByText('Rabbit').should('not.exist')
    cy.findByText('Tiger').should('exist')

    // Stop filtering and check that different words are now shown
    cy.findByText(/stop browsing alphabetically/i).click()
    cy.findByText('Dog').should('exist')
    cy.findByText('Pig').should('exist')
    cy.findByText('Rabbit').should('exist')
    cy.findByText('Rat').should('exist')
    cy.findByText('Rooster').should('exist')
  })
})
