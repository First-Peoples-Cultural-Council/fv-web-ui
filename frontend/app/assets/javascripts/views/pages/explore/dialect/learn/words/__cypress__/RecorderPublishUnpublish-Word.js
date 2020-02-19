// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderPublishUnpublish-Word.js > RecorderPublishUnpublish-Word', () => {
  it('Test to check the word publish/unpublish functionality for a recorder.', () => {
    cy.exec('bash ./scripts/ResetWordLangFive.sh enabled-true', { env: { TARGET: Cypress.env('TARGET') } })
      .its('stdout')
      .should('contain', 'Reset TestLanguageFive dictionary successfully.')

    /*
      Login as Recorder and check that the publish counter increases after it is clicked.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_RECORDER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.wait(500)
    cy.getByText('TestWord').click()
    cy.wait(1500)
    cy.getByText('Publish (0)', { exact: true }).click()
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.reload()
    cy.wait(1500)
    cy.getByText('Publish (1)').should('have.css', 'cursor', 'pointer')
    cy.logout()

    /*
      Login as Admin and verify/reject task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/')
    cy.wait(1000)
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Reject', { exact: true }).click()
    cy.logout()

    // TODO: verify site user can't see word.

    /*
      Login as recorder and click publish again.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_RECORDER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByText('TestWord').click()
    cy.wait(1500)
    cy.getByText('Publish (0)', { exact: true }).click()
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.reload()
    cy.wait(1500)
    cy.getByText('Publish (1)').should('exist')
    cy.logout()

    /*
      Login as Admin and verify/approve task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Approve', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Published').should('exist')
    })
    cy.logout()

    /*
      Login as recorder and click unpublish.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_RECORDER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByText('TestWord').click()
    cy.wait(1500)
    cy.getByText('Unpublish (0)', { exact: true }).click()
    cy.getByText('Unpublish (1)').should('exist')
    cy.logout()

    /*
      Login as Admin and verify/reject task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/')
    cy.wait(1000)
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Reject', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Published').should('exist')
    })
    cy.logout()

    /*
      Login as recorder and click unpublish again.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_RECORDER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByText('TestWord').click()
    cy.wait(1500)
    cy.getByText('Unpublish (0)', { exact: true }).click()
    cy.getByText('Unpublish (1)').should('exist')
    cy.logout()

    /*
      Login as Admin and verify/approve task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/')
    cy.wait(1000)
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Approve', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.getByTestId('DictionaryList__row').scrollIntoView()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
  })
})
