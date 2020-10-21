// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('MemberVisibility-Word.js > MemberVisibility-Word', () => {
  it('Test to check the word visibility for a member.', () => {
    /*
      Reset words for language
     */
    cy.exec('bash ./cypress/scripts/ResetWordLangFive.sh enabled-true', { env: { TARGET: Cypress.env('TARGET') } })
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
    cy.findByText('Edit').should('not.exist')
    cy.get('[title="More Options"]').click()
    cy.wait(500)
    cy.findByText('Reports', { exact: true }).click({ force: true })
    /*
            Check that no results exist in "Words in New Status" page
        */
    cy.findByText('Words in New Status', { exact: true }).click()
    cy.findByText('No Results Found', { exact: false }).should('exist')
    /*
            Check that the word exists in "Words in Enabled Status" page and make sure it has "Enabled" status
        */
    cy.findByText('reports', { exact: true }).click()
    cy.findByText('Words in Enabled Status', { exact: true }).click()
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Enabled').should('exist')
      cy.findByText('New').should('not.exist')
    })
  })
})
