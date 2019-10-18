// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('LangAdminViewEdit-Phrase.js > LangAdminViewEdit-Phrase', () => {
  it('Test to check that a language admin can view, edit, enable, and publish phrases.', () => {
    /*
            Login as member and check that the phrase is not visible.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER_USERNAME',
      userPassword: 'TESTLANGUAGETWO_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.getByText('No results found.').should('exist')
    cy.queryByText('TestPhrase').should('not.exist')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
                Login as Language Admin, navigate to phrases and check that a phrase exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN_USERNAME',
      userPassword: 'TESTLANGUAGETWO_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('New').should('exist')
      cy.getByText('TestPhrase')
        .should('exist')
        .click()
    })

    /*
            Check for edit phrase button and then enable the phrase.
         */
    cy.log('Check for edit phrase button and then enable the phrase.')
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo/learn/phrases')
    cy.wait(800)
    cy.getByText('TestPhrase', { exact: false }).click()
    cy.queryByText('Edit phrase', { exact: true }).should('exist')
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Login as member and check that the phrase is now visible and enabled.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER_USERNAME',
      userPassword: 'TESTLANGUAGETWO_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Login as Language Admin and publish the phrase.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN_USERNAME',
      userPassword: 'TESTLANGUAGETWO_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo/learn/phrases')
    cy.wait(800)
    cy.getByText('TestPhrase', { exact: false }).click()
    cy.get('div.hidden-xs').within(() => {
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
