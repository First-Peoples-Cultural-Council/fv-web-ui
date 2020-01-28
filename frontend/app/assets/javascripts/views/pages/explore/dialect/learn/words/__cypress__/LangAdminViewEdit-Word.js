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
    cy.getByText('No results found.').should('exist')
    cy.queryByText('TestWord').should('not.exist')
    cy.getByTestId('Navigation__open').click()
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('Sign Out').click()
    })

    /*
                Login as Language Admin, navigate to words and check that a word exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Words', { exact: true }).click()
    })
    cy.wait(800)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('New').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestWord').click()
    })

    /*
            Check for edit word button and then enable the word.
         */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(800)
    cy.getByText('TestWord').click()
    cy.queryByText('Edit word', { exact: true }).should('exist')
    cy.wait(500)
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('Sign Out').click()
    })

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
    cy.wait(800)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('Sign Out').click()
    })

    /*
            Login as Admin and publish the word.
        */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(800)
    cy.getByText('TestWord', { exact: true }).click()
    cy.wait(500)
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
    cy.wait(1000)
    cy.get('div.row.Navigation__dialectContainer')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(58, 104, 128)')
    cy.getByText('TestWord').should('exist')
    cy.getByText('TestTranslation').should('exist')
    cy.getByText('TestCulturalNote').should('exist')
    cy.getByText('TestLiteralTranslation').should('exist')
    cy.getByText('TestPronunciation').should('exist')
    cy.getByText('TestWordImage').should('exist')
    cy.getByText('TestWordVideo').should('exist')
    cy.getByText('TestAcknowledgement').should('exist')
  })
})
