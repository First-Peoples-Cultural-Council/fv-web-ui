// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('MemberView-Phrase.js > MemberView-Phrase', () => {
  it('Test to check the word visibility for a member.', () => {
    /*
    Reset words for language
   */
    cy.exec('bash ./scripts/ResetWordLangFive.sh enabled-true', { env: { TARGET: Cypress.env('TARGET') } })
      .its('stdout')
      .should('contain', 'Reset TestLanguageFive dictionary successfully.')

    /*
            Login as Language Member, navigate to phrases and check that a phrase exists.
        */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.wait(500)
    cy.get('div.Header.row').within(() => {
      cy.findByText('Phrases', { exact: true }).click()
    })
    cy.wait(3500)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Enabled').should('exist')
      cy.findByText('TestPhrase').should('exist')
      cy.findByText('TestPhrase').click()
    })

    /*
            Check that the edit button does not exists
        */
    cy.findByText('Edit').should('not.exist')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive')

    /*
            Check that the phrase does not exist in "Phrases in New Status" page.
        */
    cy.wait(500)
    cy.get('[title="More Options"]').click()
    cy.wait(500)
    cy.findByText('Reports', { exact: true }).click({ force: true })
    cy.findByText('Phrases in New Status', { exact: true }).click()
    cy.wait(500)
    cy.findByText('No Results Found', { exact: false }).should('exist')
    cy.findByText('TestPhrase').should('not.exist')

    /*
            Check that the phrase exists in "Phrases in Enabled Status" page and make sure it has "Enabled" status
        */
    cy.findByText('reports', { exact: true }).click()
    cy.findByText('Phrases in Enabled Status', { exact: true }).click()
    cy.wait(3000)
    cy.findByText('No Results Found').should('not.exist')
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestPhrase').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Enabled').should('exist')
      cy.findByText('New').should('not.exist')
    })
  })
})
