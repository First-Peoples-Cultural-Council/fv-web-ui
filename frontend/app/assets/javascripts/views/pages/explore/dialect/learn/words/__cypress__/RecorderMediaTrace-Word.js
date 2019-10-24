// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderMediaTrace-Word.js > RecorderMediaTrace-Word', () => {
  it('Test to check that media added to a word traces back to the word properly.', () => {
    // Note: Media is currently not deleted when a word is deleted and this test
    // will fail if leftover media exists.

    /*
                Login as Recorder and check that a test word exists and click it.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER_USERNAME',
      userPassword: 'TESTLANGUAGETWO_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo')

    /*
            Go to media browser and check that each media item has the
            proper word show up under linked words.
         */
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.getByText('Media Browser', { exact: true }).click()
    cy.getByText('TestWordAudio').click()
    cy.getByText('Linked Words').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo/media')
    cy.getByText('TestWordImage').click()
    cy.getByText('Linked Words').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageTwo/media')
    cy.getByText('TestWordVideo').click()
    cy.getByText('Linked Words').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
  })
})
