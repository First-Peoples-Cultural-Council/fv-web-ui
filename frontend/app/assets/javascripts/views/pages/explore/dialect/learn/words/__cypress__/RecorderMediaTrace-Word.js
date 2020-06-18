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
    cy.wait(3500)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(1000)

    /*
            Go to media browser and check that each media item has the
            proper word show up under linked words.
         */
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.wait(1000)
    cy.findByText('Media Browser', { exact: false }).click({ force: true })
    cy.findByText('TestWordAudio').click()
    cy.findByText('Linked Words').click()
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/media')
    cy.wait(500)
    cy.findByText('TestWordImage').click()
    cy.findByText('Linked Words').click()
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/media')
    cy.wait(1000)
    cy.findByText('TestWordVideo').click()
    cy.findByText('Linked Words').click()
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
    })
  })
})
