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
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
      cy.findByText('Enabled').should('exist')
    })
    cy.wait(500)
    cy.findByText('TestWord').click()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(2)
          .within(() => {
            cy.findByText('Publish').should('exist')
            cy.findByText('(0)').click()
          })
      })
    })
    cy.findByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.findByText('Publish', { exact: true }).click()
    })
    cy.reload()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(2)
          .within(() => {
            cy.findByText('Publish')
            cy.findByText('(1)').should('have.css', 'cursor', 'pointer')
          })
      })
    })
    cy.logout()

    /*
      Login as Admin and verify/reject task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/')
    cy.wait(1000)
    cy.findByText('View My Tasks', { exact: false }).click()
    cy.wait(1000)
    cy.findByText('Reject', { exact: true }).click()
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
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByText('TestWord').click()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(2)
          .within(() => {
            cy.findByText('Publish')
            cy.findByText('(0)').click()
          })
      })
    })
    cy.findByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.findByText('Publish', { exact: true }).click()
    })
    cy.reload()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(2)
          .within(() => {
            cy.findByText('Publish')
            cy.findByText('(1)').should('exist')
          })
      })
    })
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
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
      cy.findByText('Enabled').should('exist')
    })
    cy.findByText('View My Tasks', { exact: false }).click()
    cy.wait(1000)
    cy.findByText('Approve', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
      cy.findByText('Published').should('exist')
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
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByText('TestWord').click()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(3)
          .within(() => {
            cy.findByText('Unpublish')
            cy.findByText('(0)').click()
          })
      })
    })
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(3)
          .within(() => {
            cy.findByText('Unpublish').should('exist')
            cy.findByText('(1)').should('exist')
          })
      })
    })
    cy.logout()

    /*
      Login as Admin and verify/reject task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/')
    cy.wait(1000)
    cy.findByText('View My Tasks', { exact: false }).click()
    cy.wait(1000)
    cy.findByText('Reject', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
      cy.findByText('Published').should('exist')
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
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByText('TestWord').click()
    cy.wait(1500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(3)
          .within(() => {
            cy.findByText('Unpublish')
            cy.findByText('(0)').click()
          })
      })
    })
    cy.findByTestId('pageContainer').within(() => {
      cy.get('.PageToolbar__request').within(() => {
        cy.get('.PageToolbar__button')
          .eq(3)
          .within(() => {
            cy.findByText('Unpublish').should('exist')
            cy.findByText('(1)').should('exist')
          })
      })
    })
    cy.logout()

    /*
      Login as Admin and verify/approve task.
    */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/')
    cy.wait(1000)
    cy.findByText('View My Tasks', { exact: false }).click()
    cy.wait(1000)
    cy.findByText('Approve', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive/learn/words')
    cy.wait(5000)
    cy.findByTestId('DictionaryList__row').scrollIntoView()
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
      cy.findByText('Enabled').should('exist')
    })
  })
})
