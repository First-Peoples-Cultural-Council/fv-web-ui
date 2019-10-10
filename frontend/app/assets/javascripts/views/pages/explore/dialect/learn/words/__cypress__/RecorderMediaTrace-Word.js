// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderMediaTrace-Word.js > RecorderMediaTrace-Word', () => {
  it('Test to check that media added to a word traces back to the word properly.', () => {
    // TODO: Add database setup here.
    // A single test word that has a photo, audio, and a video must exist for SENCOTEN.
    // Notes: Media is currently not deleted when a word is deleted and this test
    // will fail if leftover media exists.

    /*
                Login as Recorder and check that a test word exists and click it.
            */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')

    /*
            Go to media browser and check that each media item has the
            proper word show up under linked words.
         */
    cy.get('div.clearfix.page-toolbar').within(() => {
      cy.get('button.hidden-xs', { exact: true }).click()
    })
    cy.getByText('Media Browser', { exact: true }).click()
    cy.getByText('TestAudio').click()
    cy.getByText('Linked Words').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/media')
    cy.getByText('TestImage').click()
    cy.getByText('Linked Words').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/media')
    cy.getByText('TestVideo').click()
    cy.getByText('Linked Words').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
  })
})
