// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderPublishUnpublish-Word.js > RecorderPublishUnpublish-Word', () => {
  it('Test to check the word publish/unpublish functionality for a recorder.', () => {
    // TODO: Add database setup here.
    // A test word which has been enabled but not published must exist for SENCOTEN.

    /*
      Login as Recorder and check that the publish counter increases after it is clicked.
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
      cy.getByText('Enabled').should('exist')
    })
    cy.wait(500)
    cy.getByText('TestWord', { exact: false }).click()
    cy.getByText('Publish (0)', { exact: true }).click()
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.reload()
    cy.getByText('Publish (1)').should('have.css', 'cursor', 'pointer')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Admin and verify/reject task.
    */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.reload()
    cy.wait(500)
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Reject', { exact: true }).click()
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    // TODO: verify site user can't see word.

    /*
      Login as recorder and click publish again.
    */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByText('TestWord', { exact: false }).click()
    cy.getByText('Publish (0)', { exact: true }).click()
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.reload()
    cy.getByText('Publish (1)').should('exist')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Admin and verify/approve task.
    */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.reload()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Approve', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Published').should('exist')
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as recorder and click unpublish.
    */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.wait(500)
    cy.getByText('TestWord', { exact: false }).click()
    cy.getByText('Unpublish (0)', { exact: true }).click()
    cy.getByText('Unpublish (1)').should('exist')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Admin and verify/reject task.
    */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.reload()
    cy.wait(500)
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Reject', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Published').should('exist')
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as recorder and click unpublish again.
    */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.wait(500)
    cy.getByText('TestWord', { exact: false }).click()
    cy.getByText('Unpublish (0)', { exact: true }).click()
    cy.getByText('Unpublish (1)').should('exist')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Admin and verify/approve task.
    */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.reload()
    cy.wait(500)
    cy.getByText('View My Tasks', { exact: false }).click()
    cy.getByText('Approve', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
  })
})
