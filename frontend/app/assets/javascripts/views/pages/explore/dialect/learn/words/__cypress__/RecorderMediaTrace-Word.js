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
      userName: 'TESTLANGUAGETWO_RECORDER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(2000)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(1000)

    /*
            Go to media browser and check that each media item has the
            proper word show up under linked words.
         */
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.wait(1000)
    cy.getByText('Media Browser', { exact: true }).click()
    cy.getByText('TestWordAudio').click()
    cy.getByText('Linked Words').click()
    cy.wait(500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/media')
    cy.wait(500)
    cy.getByText('TestWordImage').click()
    cy.getByText('Linked Words').click()
    cy.wait(500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/media')
    cy.wait(1000)
    cy.getByText('TestWordVideo').click()
    cy.getByText('Linked Words').click()
    cy.wait(500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
  })
})
