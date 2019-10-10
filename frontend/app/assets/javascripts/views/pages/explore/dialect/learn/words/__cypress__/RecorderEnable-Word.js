// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderEnable-Word.js > RecorderEnable-Word', () => {
  it('Test to check that when a recorder enables a word the request to the language admin is received.', () => {
    // TODO: Add database setup here.
    // A test word that is not enabled or published must exist for SENCOTEN.

    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })

    /*
      Checking to make sure a word currently exists.
    */
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
    })
    cy.wait(500)

    /*
      Click enable as Recorder and check that publish is not clickable.
    */
    cy.getByText('TestWord', { exact: false }).click()
    cy.getByText('Enable (0)', { exact: true }).click()
    cy.getByText('Request to enable word successfully submitted!', { exact: true }).should('exist')
    cy.getByText('Enable (1)', { exact: true }).should('exist')
    cy.getByText('Publish (0)').should('have.css', 'color', 'rgba(0, 0, 0, 0.3)')
    cy.getByText('Publish (0)').should('have.css', 'cursor', 'default')

    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Admin and verify task exists / reject task.
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

    /*
      Login as Recorder and click enable again.
    */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })

    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByText('TestWord', { exact: false }).click()
    cy.wait(500)
    cy.getByText('Enable (0)', { exact: true }).click()
    cy.getByText('Request to enable word successfully submitted!', { exact: true }).should('exist')
    cy.getByText('Enable (1)', { exact: true }).should('exist')
    cy.getByText('Publish (0)').should('have.css', 'color', 'rgba(0, 0, 0, 0.3)')
    cy.getByText('Publish (0)').should('have.css', 'cursor', 'default')
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Admin and verify task exists / approve task.
    */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.reload()
    cy.wait(500)
    cy.getByText('View My Tasks', { exact: true }).click()
    cy.getByText('Approve', { exact: true }).click()

    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Site Member and check that the word is visible once enabled.
     */
    cy.login({
      userName: 'SITE_MEMBER_USERNAME',
      userPassword: 'SITE_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
      Login as Recorder and verify that publish is now clickable.
     */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })

    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/words')
    cy.getByText('TestWord', { exact: false }).click()
    cy.wait(500)
    cy.getByText('Enable (0)').should('have.css', 'color', 'rgba(0, 0, 0, 0.3)')
    cy.getByText('Enable (0)').should('have.css', 'cursor', 'default')
    cy.getByText('Publish (0)').should('have.css', 'cursor', 'pointer')
  })
})
