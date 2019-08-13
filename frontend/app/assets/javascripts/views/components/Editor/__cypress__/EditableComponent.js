// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('EditableComponent.js > EditableComponent', () => {
  it('FW-212: Drop AlloyEditor for Quill', () => {
    const updateMessage = `EditableComponent.js > EditableComponent @ ${new Date()}`

    cy.login({
      url: 'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/startup',
    })

    cy.log('■□□□ 1/5')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene')

    cy.getByTestId('EditableComponent__fv-portal-about').within(() => {
      cy.getByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage)

      cy.getByText('Save', { exact: false }).click()

      cy.wait(500)
      cy.getByText(updateMessage).should('exist')
    })
    cy.getByTestId('EditableComponent__fv-portal-news').within(() => {
      cy.getByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage)

      cy.getByText('Save', { exact: false }).click()

      cy.wait(500)
      cy.getByText(updateMessage).should('exist')
    })

    cy.log('■■□□□ 2/5')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn')

    cy.getByTestId('EditableComponent__dc-description').within(() => {
      cy.getByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage)

      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.wait(500)
    cy.getByText(updateMessage).should('exist')

    cy.log('■■■□□ 3/5')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/edit')

    const updateMessage1 = `${updateMessage} 1`
    const updateMessage2 = `${updateMessage} 2`
    /*
      Portal introduction
      News
        wysiwyg__userInput
        */
    cy.getByTestId('wysiwyg-fv-portal_about').within(() => {
      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage1)
    })

    cy.getByTestId('wysiwyg-fv-portal_news').within(() => {
      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage2)
    })

    cy.getByTestId('withForm__btnGroup2').within(() => {
      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.wait(500)
    cy.getByText(updateMessage1).should('exist')
    cy.getByText(updateMessage2).should('exist')

    const updateMessage3 = `${updateMessage} wysiwyg-dc_title`
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/stories')
    cy.getByText('Create Story Book', { exact: false }).click()

    cy.wait(500)

    cy.getByText('Add new story book to', { exact: false }).should('exist')

    cy.getByLabelText('Book title', { exact: false }).type('[CY:SETUP] Title')

    cy.log('■■■■□ 4/5')
    cy.getByTestId('wysiwyg-fvbook_introduction').within(() => {
      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage)
    })

    cy.getByTestId('PageDialectStoriesAndSongsCreate__btnGroup').within(() => {
      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.getByText(updateMessage).should('exist')

    cy.getByText('add new page', { exact: false }).click()
    cy.wait(500)

    cy.getByText('Add New Entry To', { exact: false }).should('exist')

    cy.getByTestId('wysiwyg-dc_title').within(() => {
      cy.log('■■■■■ 5/5')
      cy.getByTestId('wysiwyg__userInput')
        .clear()
        .type(updateMessage3)
    })

    cy.getByTestId('PageDialectStoriesAndSongsBookEntryCreate__btnGroup').within(() => {
      cy.getByText('SAVE', { exact: false }).click()
    })

    cy.getByText('open book', { exact: false }).click()

    cy.getByText(updateMessage3).should('exist')
  })
})
