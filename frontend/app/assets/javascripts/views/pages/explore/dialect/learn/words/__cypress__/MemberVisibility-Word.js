// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('MemberVisibility-Word.js > MemberVisibility-Word', () => {
  it('Test to check the word visibility for a member.', () => {
    /*
      Reset words for language
     */
    cy.exec('bash ./scripts/ResetWordLangFive.sh enabled-true')
      .its('stdout')
      .should('contain', 'Reset TestLanguageFive dictionary successfully.')

    /*
            Login as Member
        */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_MEMBER_USERNAME',
      userPassword: 'TESTLANGUAGEFIVE_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    /*
            Check that edit button does not exist and go to reports page
        */
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageFive')
    cy.wait(500)
    cy.queryByText('Edit Portal').should('not.exist')
    cy.get('[title="More Options"]').click()
    cy.getByText('Reports', { exact: true }).click()
    /*
            Check that no results exist in "Words in New Status" page
        */
    cy.getByText('Words in New Status', { exact: true }).click()
    cy.getByText('No results found.', { exact: true }).should('exist')
    /*
            Check that the word exists in "Words in Enabled Status" page and make sure it has "Enabled" status
        */
    cy.getByText('reports', { exact: true }).click()
    cy.getByText('Words in Enabled Status', { exact: true }).click()
    cy.wait(500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
      cy.queryByText('New').should('not.exist')
    })
  })
})
