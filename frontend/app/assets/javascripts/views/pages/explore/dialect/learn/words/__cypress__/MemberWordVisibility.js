// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('MemberWordVisibility.js > MemberWordVisibility', () => {
  it('Test to check the publish/unpublish functionality for a recorder.', () => {
    // TODO: Add database setup here.
    // A test word which has been enabled but not published must exist for SENCOTEN.

    /*
            Login as Member
        */
    cy.login({
      userName: 'SENCOTEN_MEMBER_USERNAME',
      userPassword: 'SENCOTEN_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    /*
            Check that edit button does not exist and go to reports page
        */
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.queryByText('Edit Portal').should('not.exist')
    cy.get('div.clearfix.page-toolbar').within(() => {
      cy.get('button.hidden-xs', { exact: true }).click()
    })
    cy.getByText('Reports', { exact: true }).click()
    /*
            Check that no results exist in "Words in New Status" page
        */
    cy.getByText('Words in New Status', { exact: true }).click()
    cy.getByText('No results found.', { exact: true }).should('exist')
    cy.get('div.col-md-5.col-xs-12 > div').within(() => {
      cy.get('span:nth-child(6)')
        .contains('0')
        .should('exist')
    })
    /*
            Check that the word exists in "Words in Enabled Status" page and make sure it has "Enabled" status
        */
    cy.getByText('reports', { exact: true }).click()
    cy.getByText('Words in Enabled Status', { exact: true }).click()
    cy.wait(500)
    cy.get('div.col-md-5.col-xs-12 > div').within(() => {
      cy.get('span:nth-child(6)')
        .contains('1')
        .should('exist')
    })
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
      cy.queryByText('New').should('not.exist')
    })
  })
})
