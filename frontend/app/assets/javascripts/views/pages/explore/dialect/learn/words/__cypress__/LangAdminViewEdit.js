// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('LangAdminViewEdit.js > LangAdminViewEdit', () => {
  it('Test to check language admin viewing and editing of words permissions.', () => {
    // TODO: Add database setup here.
    // A test word that is not published or enabled must exist for SENCOTEN.

    /*
            Login as Site Member and check that the word is not visible when not enabled.
        */
    cy.login({
      userName: 'SITE_MEMBER_USERNAME',
      userPassword: 'SITE_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByText('No results found.', { exact: true }).should('exist')
    cy.queryByText('TestWord').should('not.exist')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Login as Admin, check that edit functionality works, and enable word.
        */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByText('Workspace', { exact: true }).click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord')
        .should('exist')
        .click()
    })
    cy.getByText('Edit word')
      .should('exist')
      .click()
    cy.get('div.form-horizontal').within(() => {
      cy.getByText('Word', { exact: true }).should('exist')
      cy.getByText('Part of speech', { exact: true }).should('exist')
      cy.getByText('Pronunciation', { exact: true }).should('exist')
    })
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Cancel').click()
    })
    cy.get('div.hidden-xs.clearfix').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Login as Site Member and check that the word is now visible.
        */
    cy.login({
      userName: 'SITE_MEMBER_USERNAME',
      userPassword: 'SITE_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Login as Admin and publish the word.
        */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByText('Workspace', { exact: true }).click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord')
        .should('exist')
        .click()
    })
    cy.get('div.hidden-xs.clearfix').within(() => {
      cy.get('input[type=checkbox]')
        .eq(1)
        .click()
    })
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    // TODO: Add test for public view here. Public view not currently working so can't implement test.
  })
})
