// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Phrasebook/internationalization.js'
import browseCopy from '../../../app/assets/javascripts/views/pages/explore/dialect/Phrasebooks/internationalization.js'

const createPhraseBooks = (start, max) => {
  if (start >= max) {
    return
  }

  const phraseBookName = `[CY] A Phrase Book ${start}`
  cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/create/phrasebook')
  cy.wait(2000)
  cy.getByLabelText(copy.create.name).type(phraseBookName)
  cy.getByText(copy.create.submit).click()
  cy.wait(1000)

  const count = start + 1

  if (count !== max) {
    createPhraseBooks(count, max)
  }
}

const performBatchDelete = () => {
  // Display 500 Entries on the screen
  cy.wait(2000)
  cy.getByText('Per Page:')
    .siblings('div')
    .first()
    .click()
  cy.get('[data-value=500]').click()
  cy.wait(2000)

  // Batch Select and Delete
  cy.get('.DictionaryList__data > .Confirmation > .Confirmation__initiate > .Confirmation__btnInitiate')
    .should('exist')
    .should('be.disabled')
  cy.getByText(browseCopy.batch.select)
    .should('exist')
    .click()
  cy.wait(2000)
  cy.get('.DictionaryList__data > .Confirmation > .Confirmation__initiate > .Confirmation__btnInitiate')
    .should('be.enabled')
    .click()
  cy.wait(2000)
  cy.get('.DictionaryList__data > .Confirmation > .Confirmation__initiate > .Confirmation__btnInitiate').should('exist')
  cy.get(
    '.DictionaryList__data > .Confirmation > .Confirmation__confirmOrDeny > .Confirmation__confirmOrDenyInner > .Confirmation__btnDeny'
  )
    .should('exist')
    .click()
  cy.wait(2000)
  cy.get('.DictionaryList__data > .Confirmation > .Confirmation__initiate > .Confirmation__btnInitiate').click()
  cy.wait(2000)

  // Perform batch delete
  cy.get(
    '.DictionaryList__data > .Confirmation > .Confirmation__confirmOrDeny > .Confirmation__confirmOrDenyInner > .Confirmation__btnConfirm > .Confirmation__btnConfirmText'
  ).click()
  cy.wait(2000)
}

describe('PhrasebookCreate.js > Phrasebook', () => {
  it('Delete a phrasebook from edit screen', () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })

    // Create a Phrase Book
    createPhraseBooks(0, 1)

    // Edit after Creation
    cy.getByText(copy.create.success.editView).click()

    cy.wait(2000)
    cy.getByText(copy.create.btnInitiate)
      .should('exist')
      .click()

    cy.wait(2000)
    cy.getByText(copy.create.btnDeny)
      .should('exist')
      .click()
    cy.wait(2000)
    cy.getByText(copy.create.btnInitiate).click()
    cy.wait(2000)

    cy.getByText(copy.create.btnConfirm)
      .should('exist')
      .click()
    cy.wait(2000)

    // Confirmation screen
    cy.getByText(copy.edit.successDelete.title).should('exist')
    cy.getByText(copy.edit.success.linkCreateAnother).should('exist')
    cy.wait(500)
  })

  it('Deletes a phrasebook from browse screen', () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })

    const phraseBookName = '[CY] A Phrase Book 0'

    createPhraseBooks(0, 1)

    cy.getByText(copy.create.success.browseView).click()
    cy.wait(3000)

    // Test state of phrasebook browse delete button
    cy.getByText(phraseBookName)
      .should('exist')
      .parent()
      .parent()
      .contains(browseCopy.btnInitiate)
      .click()
    cy.wait(1000)
    cy.getByText(phraseBookName)
      .parent()
      .parent()
      .within(() => {
        cy.getByText(browseCopy.btnDeny)
          .should('exist')
          .click()
      })
    cy.wait(2000)
    cy.getByText(phraseBookName)
      .should('exist')
      .parent()
      .parent()
      .find('button.Confirmation__btnInitiate')
      .click()

    // Test Delete
    cy.getByText(phraseBookName)
      .parent()
      .parent()
      .within(() => {
        cy.getByText(browseCopy.btnConfirm)
          .should('exist')
          .click()
      })
    cy.wait(2000)
  })

  it('Batch deletes entries from from browse screen', () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })

    // Create 10 Phrase Books
    createPhraseBooks(0, 10)
    cy.getByText(copy.create.success.browseView).click()
    cy.wait(2000)

    // Perform batch delete from browse screen
    performBatchDelete()
  })
})
