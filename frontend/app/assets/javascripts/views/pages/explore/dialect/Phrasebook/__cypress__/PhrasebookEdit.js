// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Phrasebook/internationalization.js'

const editPhraseBook = () => {
  // Assert that description titles exist
  cy.findByText(copy.edit.title).should('exist')
  cy.findByText(copy.edit.name).should('exist')
  cy.findByText(copy.edit.description).should('exist')
  cy.findByText(copy.edit.requiredNotice).should('exist')

  //Test error validation
  cy.wait(2000)
  cy.findByLabelText(copy.edit.name).clear()
  cy.findByText(copy.edit.submit).click()
  cy.findByLabelText(copy.validation.name).should('exist')
  cy.wait(2000)
  cy.findByText(copy.edit.submit).click()
  cy.findByLabelText(copy.validation.name).should('exist')

  // Test proper phrase book editing
  cy.findByLabelText(copy.edit.name).type('[CY] Updated Phrase book name')
  cy.findByText(copy.edit.submit).click()
  cy.wait(2000)

  //Assert that confirmation screen appears
  cy.findByText(copy.edit.success.title).should('exist')
  cy.findByText(copy.edit.success.thanks).should('exist')
  cy.wait(2000)
}

describe('PhrasebookCreate.js > Phrasebook', () => {
  it('Edit a Phrasebook After Creation', () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/create/phrasebook')
    cy.wait(2000)

    // Create a Phrasebook
    cy.findByLabelText(copy.create.name).type('[CY] Phrase book name')
    cy.findByText(copy.create.submit).click()

    cy.findByText(copy.create.success.editView).click()
    cy.wait(2000)
    editPhraseBook()
    cy.findByText(copy.create.success.editView).click()
    cy.wait(2000)
    editPhraseBook()
  })

  it('Edit a Phrasebook From The Browse List', () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })

    // Create a Phrasebook
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/create/phrasebook')
    cy.wait(2000)
    cy.findByLabelText(copy.create.name).type('[CY] Phrase book name')
    cy.findByText(copy.create.submit).click()
    cy.wait(2000)

    // Edit from Browse List
    cy.findByText(copy.create.success.browseView).click()
    cy.findByText('[CY] Phrase book name')
      .parent()
      .parent()
      .contains('Edit')
      .click()
    cy.wait(2000)

    editPhraseBook()
  })
})
