// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

describe('EditableComponent.js > EditableComponent', () => {
  it('FW-212: Drop AlloyEditor for Quill', () => {
    const updateMessage = `EditableComponent.js > EditableComponent @ ${new Date()}`
    const updateMessage1 = `${updateMessage} 1`
    const updateMessage2 = `${updateMessage} 2`
    const updateMessage3 = `${updateMessage} 3`
    cy.login({
      userName: 'TESTLANGUAGESEVEN_ADMIN',
    })

    cy.log('■□□□ 1/5')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSeven')
    cy.wait(500)

    cy.findByTestId('EditableComponent__fv-portal-about').within(() => {
      cy.findByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.findByTestId('wysiwyg-fv-portal_about').within(() => {
        cy.get('.ql-editor')
          .clear()
          .type(updateMessage1)
      })

      cy.findByText('Save', { exact: false }).click()

      cy.wait(500)
    })
    cy.reload()
    cy.wait(500)
    cy.findByTestId('EditableComponent__fv-portal-about').within(() => {
      cy.findByText(updateMessage1).should('exist')
    })

    cy.findByTestId('EditableComponent__fv-portal-news').within(() => {
      cy.findByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.findByTestId('wysiwyg-fv-portal_news').within(() => {
        cy.get('.ql-editor')
          .clear()
          .type(updateMessage2)
      })

      cy.findByText('Save', { exact: false }).click()

      cy.wait(500)
    })
    cy.reload()
    cy.wait(500)
    cy.findByTestId('EditableComponent__fv-portal-news').within(() => {
      cy.findByText(updateMessage2).should('exist')
    })

    cy.log('■■□□□ 2/5')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSeven/learn')
    cy.wait(500)

    cy.findByTestId('EditableComponent__dc-description').within(() => {
      cy.findByTestId('EditableComponent__edit').click()

      // Note: need to wait for WYSIWYG editor to init
      cy.wait(500)

      cy.get('.ql-editor')
        .clear()
        .type(updateMessage)
    })
    cy.findByText('SAVE', { exact: false }).click()

    cy.wait(500)
    cy.findByText(updateMessage).should('exist')

    cy.log('■■■□□ 3/5')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSeven/edit')
    cy.wait(500)

    /*
      Portal introduction
      News
        wysiwyg__userInput
        */
    cy.findByTestId('wysiwyg-fv-portal_about').within(() => {
      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage1)
    })

    cy.findByTestId('wysiwyg-fv-portal_news').within(() => {
      cy.contains('EditableComponent.js > EditableComponent')
        .clear()
        .type(updateMessage2)
    })

    cy.findByTestId('withForm__btnGroup2').within(() => {
      cy.findByText('SAVE', { exact: false }).click()
    })

    cy.wait(500)
    cy.findByText(updateMessage1).should('exist')
    cy.findByText(updateMessage2).should('exist')

    cy.log('■■■■□ 4/5')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSeven/learn/stories')
    cy.wait(500)
    cy.findByText('Create Story Book', { exact: false }).click()

    cy.wait(500)

    cy.findByText('Add new story book to', { exact: false }).should('exist')

    cy.findByLabelText('Book title', { exact: false }).type('[CY:SETUP] Title')

    cy.findByTestId('wysiwyg-fvbook_introduction').within(() => {
      // TODO: Quill 'implementation detail' hook
      cy.get('.ql-blank').type(updateMessage)
    })

    cy.findByTestId('PageDialectStoriesAndSongsCreate__btnGroup').within(() => {
      cy.findByText('SAVE', { exact: false }).click()
    })
    cy.wait(500)

    cy.log('■■■■■ 5/5')
    cy.findByText(updateMessage).should('exist')

    cy.findByText('add new page', { exact: false }).click()
    cy.wait(500)

    cy.findByText('Add New Entry To', { exact: false }).should('exist')

    cy.findByTestId('wysiwyg-dc_title').within(() => {
      // TODO: Quill 'implementation detail' hook
      cy.get('.ql-blank').type(updateMessage3)
    })

    cy.findByTestId('PageDialectStoriesAndSongsBookEntryCreate__btnGroup').within(() => {
      cy.findByText('SAVE', { exact: false }).click()
    })
    cy.wait(500)
    cy.reload()
    cy.wait(500)

    cy.findByText('open book', { exact: false }).click()

    cy.findByText(updateMessage3).should('exist')
  })
})
