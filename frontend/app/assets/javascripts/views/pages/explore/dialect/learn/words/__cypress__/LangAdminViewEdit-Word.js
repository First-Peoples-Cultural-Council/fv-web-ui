// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
const click = ($el) => $el.click()

describe('LangAdminViewEdit-Word.js > LangAdminViewEdit-Word', () => {
  it('Test to check language admin viewing and editing of words permissions.', () => {
    /*
            Login as Language Member and check that the word is not visible when not enabled.
        */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.getByText('Words', { exact: true }).click()
    cy.wait(500)
    cy.getByText('No results found.', { exact: false }).should('exist')
    cy.queryByText('TestWord').should('not.exist')
    cy.logout()

    /*
                Login as Language Admin, navigate to words and check that a word exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.wait(500)
    cy.get('div.Header.row').within(() => {
      cy.getByText('Words', { exact: true }).click()
    })
    cy.wait(3500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('New').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.queryByText('TestWord').should('exist')
      cy.getByText('TestWord').click()
    })

    /*
            Check for edit word button and then enable the word.
         */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(2500)
    cy.queryByText('TestWord').click()
    cy.wait(1500)
    cy.queryByText('Edit word', { exact: true }).should('exist')
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.logout()

    /*
            Login as member and check that the word is now visible and enabled.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Words', { exact: true }).click()
    })
    cy.wait(3500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.queryByText('TestWord').should('exist')
      cy.queryByText('TestTranslation').should('exist')
      cy.queryByText('Enabled').should('exist')
    })
    cy.logout()

    /*
            Login as Admin and publish the word.
        */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(2500)
    cy.getByText('TestWord', { exact: true }).click()
    cy.wait(1500)
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(1)
        .click()
    })
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.wait(1000)

    /*
      Check that the word is now visible to the public.
     */
    cy.getByText('Public View')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.wait(1500)
    cy.get('div.row.Navigation__dialectContainer')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(58, 104, 128)')
    cy.queryByText('TestWord').should('exist')
    cy.queryByText('TestTranslation').should('exist')
    cy.queryByText('TestCulturalNote').should('exist')
    cy.queryByText('TestLiteralTranslation').should('exist')
    cy.queryByText('TestPronunciation').should('exist')
    cy.queryByText('TestWordImage').should('exist')
    cy.queryByText('TestWordVideo').should('exist')
    cy.queryByText('TestAcknowledgement').should('exist')
  })
})
