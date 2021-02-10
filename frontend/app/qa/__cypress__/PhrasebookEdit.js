// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import copy from '../../../app/components/Phrasebook/copy.js'

const editPhraseBook = () => {
  // Assert that description titles exist
  cy.findByText(copy.edit.title).should('exist')
  cy.findByText(copy.edit.name).should('exist')
  cy.findByText(copy.edit.description).should('exist')
  cy.findByText(copy.edit.requiredNotice).should('exist')

  //Test error validation
  cy.findByLabelText(copy.edit.name).clear()
  cy.findByText(copy.edit.submit).click()
  cy.findByLabelText(copy.validation.name).should('exist')
  cy.findByText(copy.edit.submit).click()
  cy.findByLabelText(copy.validation.name).should('exist')

  // Test proper phrase book editing
  cy.findByLabelText(copy.edit.name).type('[CY] Updated Phrase book name')
  cy.findByText(copy.edit.submit).click()

  //Assert that confirmation screen appears
  cy.findByText(copy.edit.success.title).should('exist')
  cy.findByText(copy.edit.success.thanks).should('exist')
}

describe('PhrasebookEdit.js > Phrasebook', () => {
  it('Edit a Phrasebook', () => {
    cy.login({
      userName: 'TestDialectPublic_recorders',
      userPassword: 'TestDialectPublic_recorders',
    })

    // Visit browse view
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/phrasebooks')

    // Edit phrase book
    cy.findByText('Phrase Book C').parent().parent().contains('Edit').click()

    editPhraseBook()
  })
})
