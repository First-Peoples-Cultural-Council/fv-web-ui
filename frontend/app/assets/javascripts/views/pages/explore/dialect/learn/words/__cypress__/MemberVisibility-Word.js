// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('MemberVisibility-Word.js > MemberVisibility-Word', () => {
  it('Test to check the word visibility for a member.', () => {
    /*
      Reset words for language
     */
    cy.exec('bash ./scripts/ResetWordLangFive.sh enabled-true', { env: { TARGET: Cypress.env('TARGET') } })
      .its('stdout')
      .should('contain', 'Reset TestLanguageFive dictionary successfully.')

    /*
            Login as Member
        */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_MEMBER',
    })
    /*
            Check that edit button does not exist and go to reports page
        */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive')
    cy.wait(500)
    cy.queryByText('Edit Portal').should('not.exist')
    cy.get('[title="More Options"]').click()
    cy.wait(500)
    cy.getByText('Reports', { exact: true }).click({ force: true })
    /*
            Check that no results exist in "Words in New Status" page
        */
    cy.getByText('Words in New Status', { exact: true }).click()
    cy.getByText('No results found.', { exact: false }).should('exist')
    /*
            Check that the word exists in "Words in Enabled Status" page and make sure it has "Enabled" status
        */
    cy.getByText('reports', { exact: true }).click()
    cy.getByText('Words in Enabled Status', { exact: true }).click()
    cy.wait(3000)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
      cy.queryByText('New').should('not.exist')
    })
  })
})
