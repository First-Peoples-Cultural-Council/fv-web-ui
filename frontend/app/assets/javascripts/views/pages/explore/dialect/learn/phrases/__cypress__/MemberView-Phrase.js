// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('MemberView-Phrase.js > MemberView-Phrase', () => {
  it('Test to check the word visibility for a member.', () => {
    // TODO: Add database setup here.
    // Requires a new phrase that is enabled and not published called TestPhrase exist in database for SENCOTEN.

    /*
            Login as Language Member, navigate to phrases and check that a phrase exists.
        */
    cy.login({
      userName: 'SENCOTEN_MEMBER_USERNAME',
      userPassword: 'SENCOTEN_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
      cy.getByText('TestPhrase')
        .should('exist')
        .click()
    })

    /*
            Check that the edit button does not exists
        */
    cy.queryByText('Edit phrase').should('not.exist')
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')

    /*
            Check that the phrase does not exist in "Phrases in New Status" page.
        */
    cy.get('div.clearfix.page-toolbar').within(() => {
      cy.get('button.hidden-xs', { exact: true }).click()
    })
    cy.getByText('Reports', { exact: true }).click()
    cy.getByText('Phrases in New Status', { exact: true }).click()
    cy.wait(500)
    cy.getByText('No results found.', { exact: true }).should('exist')
    cy.queryByText('TestPhrase').should('not.exist')

    /*
            Check that the phrase exists in "Phrases in Enabled Status" page and make sure it has "Enabled" status
        */
    cy.getByText('reports', { exact: true }).click()
    cy.getByText('Phrases in Enabled Status', { exact: true }).click()
    cy.wait(500)
    cy.queryByText('No results found').should('not.exist')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
      cy.queryByText('New').should('not.exist')
    })
  })
})
