// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import copy from '../../../app/components/Phrasebook/copy.js'
import browseCopy from '../../../app/components/Phrasebooks/copy.js'

const createPhraseBooks = (start, max) => {
  if (start >= max) {
    return
  }

  const phraseBookName = `[CY] A Phrase Book ${start}`
  cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/create/phrasebook')
  cy.wait(2000)
  cy.findByLabelText(copy.create.name).type(phraseBookName)
  cy.findByText(copy.create.submit).click()
  cy.wait(1000)

  const count = start + 1

  if (count !== max) {
    createPhraseBooks(count, max)
  }
}

const performBatchDelete = () => {
  // Display 500 Entries on the screen
  cy.wait(2000)
  cy.findByText('Per Page:')
    .siblings('div')
    .first()
    .click()
  cy.get('[data-value=500]').click()
  cy.wait(2000)

  // Batch Select and Delete
  cy.get('.DictionaryList__data > .Confirmation > .Confirmation__initiate > .Confirmation__btnInitiate')
    .should('exist')
    .should('be.disabled')
  cy.findByText(browseCopy.batch.select)
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
      userName: 'TestDialectPublic_recorders',
      userPassword: 'TestDialectPublic_recorders',
    })

    // Create a Phrase Book
    createPhraseBooks(0, 1)

    // Edit after Creation
    cy.findByText(copy.create.success.editView).click()

    cy.wait(2000)
    cy.findByText(copy.create.btnInitiate)
      .should('exist')
      .click()

    cy.wait(2000)
    cy.findByText(copy.create.btnDeny)
      .should('exist')
      .click()
    cy.wait(2000)
    cy.findByText(copy.create.btnInitiate).click()
    cy.wait(2000)

    cy.findByText(copy.create.btnConfirm)
      .should('exist')
      .click()
    cy.wait(2000)

    // Confirmation screen
    cy.findByText(copy.edit.successDelete.title).should('exist')
    cy.findByText(copy.edit.success.linkCreateAnother).should('exist')
    cy.wait(500)
  })

  it('Batch deletes entries from from browse screen', () => {
    cy.login({
      userName: 'TestDialectPublic_recorders',
      userPassword: 'TestDialectPublic_recorders',
    })

    // Create 10 Phrase Books
    createPhraseBooks(0, 10)
    cy.findByText(copy.create.success.browseView).click()
    cy.wait(2000)

    // Perform batch delete from browse screen
    performBatchDelete()
  })
})
