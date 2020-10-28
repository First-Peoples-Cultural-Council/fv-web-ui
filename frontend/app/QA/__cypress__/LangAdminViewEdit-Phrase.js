// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
const click = ($el) => $el.click()

describe('LangAdminViewEdit-Phrase.js > LangAdminViewEdit-Phrase', () => {
  it('Test to check that a language admin can view, edit, enable, and publish phrases.', () => {
    /*
            Login as member and check that the phrase is not visible.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(1000)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.findByText('Phrases', { exact: true }).click()
    })
    cy.findByText('No Results Found', { exact: false }).should('exist')
    cy.findByText('TestPhrase').should('not.exist')
    cy.logout()

    /*
                Login as Language Admin, navigate to phrases and check that a phrase exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.findByText('Phrases', { exact: true }).click()
    })
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('New').should('exist')
      cy.findByText('TestPhrase').should('exist')
      cy.findByText('TestPhrase').click()
    })

    /*
            Check for edit phrase button and then enable the phrase.
         */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/phrases')
    cy.wait(2000)
    cy.findByText('TestPhrase', { exact: false }).clickandwait()
    cy.findByText('Edit', { exact: true }).should('exist')
    cy.wait(500)
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.logout()

    /*
            Login as member and check that the phrase is now visible and enabled.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.findByText('Phrases', { exact: true }).click()
    })
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestPhrase').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Enabled').should('exist')
    })
    cy.logout()

    /*
            Login as Language Admin and publish the phrase.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/phrases')
    cy.wait(2500)
    cy.findByText('TestPhrase', { exact: false }).click()
    cy.wait(1500)
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(1)
        .click()
    })
    cy.findByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.findByText('Publish', { exact: true }).click()
    })
    cy.wait(1000)

    /*
    Check that the phrase is now visible to the public.
   */
    cy.findByText('Public View')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.wait(1000)
    cy.get('div.row.Navigation__dialectContainer')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(58, 104, 128)')
    cy.findByText('TestPhrase').should('exist')
    cy.findByText('TestTranslation').should('exist')
    cy.findByText('TestCulturalNote').should('exist')
    cy.findByText('TestPhraseImage').should('exist')
    cy.findByText('TestPhraseVideo').should('exist')
    cy.findByText('TestAcknowledgement').should('exist')
  })
})
