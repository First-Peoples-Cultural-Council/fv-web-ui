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
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageTwo/Portal').as('pathOneXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait('@pathOneXHR')

    cy.getByText('Learn our Language', { exact: true }).click()

    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechXHR')
    cy.route('POST', '/nuxeo/api/v1/automation/Document.EnrichedQuery').as('enrichedQueryOneXHR')
    cy.getByText('Words', { exact: true }).click()
    cy.wait(['@enrichedQueryOneXHR', '@enrichedQueryOneXHR', '@partsOfSpeechXHR'])
    cy.getByText('No results found.').should('exist')
    cy.queryByText('TestWord').should('not.exist')
    cy.logout()

    /*
                Login as Language Admin, navigate to words and check that a word exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.route('POST', '/nuxeo/api/v1/automation/Workflow.GetOpenTasks').as('getOpenTasksXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait('@getOpenTasksXHR')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.wait('@getOpenTasksXHR')
    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechTwoXHR')
    cy.get('div.Header.row').within(() => {
      cy.getByText('Words', { exact: true }).click()
    })
    cy.wait('@partsOfSpeechTwoXHR')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.queryByText('New').should('exist')
      cy.queryByText('TestTranslation').should('exist')
      cy.queryByText('TestWord').should('exist')
    })

    /*
            Check for edit word button and then enable the word.
         */
    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechThreeXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait('@partsOfSpeechThreeXHR')

    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageTwo').as('pathTwoXHR')
    cy.queryByText('TestWord').click()
    cy.wait('@pathTwoXHR')
    cy.queryByText('Edit word', { exact: true }).should('exist')
    cy.route('POST', '/nuxeo/api/v1/automation/FVEnableDocument').as('enableXHR')
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.wait('@enableXHR')
    cy.logout()

    /*
            Login as member and check that the word is now visible and enabled.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.route('POST', '/nuxeo/api/v1/automation/Workflow.GetOpenTasks').as('getOpenTasksTwoXHR')
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageTwo/Portal').as('pathThreeXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(['@pathThreeXHR', '@getOpenTasksTwoXHR'])
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechFourXHR')
    cy.get('div.Header.row').within(() => {
      cy.getByText('Words', { exact: true }).click()
    })
    cy.wait('@partsOfSpeechFourXHR')
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
    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechFiveXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait('@partsOfSpeechFiveXHR')

    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageTwo').as('pathFourXHR')
    cy.getByText('TestWord', { exact: true }).click()
    cy.wait('@pathFourXHR')
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(1)
        .click()
    })
    cy.route('POST', '/nuxeo/api/v1/automation/Workflow.GetOpenTasks').as('getOpenTasksThreeXHR')
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.wait('@getOpenTasksThreeXHR')

    /*
      Check that the word is now visible to the public.
     */
    cy.route('/nuxeo/api/v1/path/FV/sections/Data/Test/Test/TestLanguageTwo').as('pathFiveXHR')
    cy.getByText('Public View')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.wait('@pathFiveXHR')
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
