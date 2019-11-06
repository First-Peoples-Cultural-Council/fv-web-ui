// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('EditableComponent.js > EditableComponent', () => {
  it('FW-212: Drop AlloyEditor for Quill', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.')
    cy.expect(true).to.equal(false)

    const updateMessage = `EditableComponent.js > EditableComponent @ ${new Date()}`
    const updateMessage1 = `${updateMessage} 1`
    const updateMessage2 = `${updateMessage} 2`
    const updateMessage3 = `${updateMessage} 3`
    cy.login({
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })

    cy.log('■□□□ 1/5')
    cy.visit('/explore/FV/Workspaces/Data/Athabascan/Dene/Dene')

    cy.getByTestId('EditableComponent__fv-portal-about').within(() => {
      cy.getByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage1)

      cy.getByText('Save', { exact: false }).click()

      cy.wait(500)
      cy.getByText(updateMessage1).should('exist')
    })
    cy.getByTestId('EditableComponent__fv-portal-news').within(() => {
      cy.getByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage2)

      cy.getByText('Save', { exact: false }).click()

      cy.wait(500)
      cy.getByText(updateMessage2).should('exist')
    })

    cy.log('■■□□□ 2/5')
    cy.visit('/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn')

    cy.getByTestId('EditableComponent__dc-description').within(() => {
      cy.getByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage)
    })
    cy.getByText('SAVE', { exact: false }).click()

    cy.wait(500)
    cy.getByText(updateMessage).should('exist')

    cy.log('■■■□□ 3/5')
    cy.visit('/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/edit')

    /*
      Portal introduction
      News
        wysiwyg__userInput
        */
    cy.getByTestId('wysiwyg-fv-portal_about').within(() => {
      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage1)
    })

    cy.getByTestId('wysiwyg-fv-portal_news').within(() => {
      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage2)
    })

    cy.getByTestId('withForm__btnGroup2').within(() => {
      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.wait(500)
    cy.getByText(updateMessage1).should('exist')
    cy.getByText(updateMessage2).should('exist')

    cy.log('■■■■□ 4/5')
    cy.visit('/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/stories')
    cy.getByText('Create Story Book', { exact: false }).click()

    cy.wait(500)

    cy.getByText('Add new story book to', { exact: false }).should('exist')

    cy.getByLabelText('Book title', { exact: false }).type('[CY:SETUP] Title')

    cy.getByTestId('wysiwyg-fvbook_introduction').within(() => {
      // TODO: Quill 'implementation detail' hook
      cy.get('.ql-blank').type(updateMessage)
    })

    cy.getByTestId('PageDialectStoriesAndSongsCreate__btnGroup').within(() => {
      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.log('■■■■■ 5/5')
    cy.getByText(updateMessage).should('exist')

    cy.getByText('add new page', { exact: false }).click()
    cy.wait(500)

    cy.getByText('Add New Entry To', { exact: false }).should('exist')

    cy.getByTestId('wysiwyg-dc_title').within(() => {
      // TODO: Quill 'implementation detail' hook
      cy.get('.ql-blank').type(updateMessage3)
    })

    cy.getByTestId('PageDialectStoriesAndSongsBookEntryCreate__btnGroup').within(() => {
      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.getByText('open book', { exact: false }).click()

    cy.getByText(updateMessage3).should('exist')
  })
})
