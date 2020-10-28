// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import copy from '../../../app/components/Category/copy.js'

const editCategory = () => {
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

  // Test proper category editing
  cy.findByLabelText(copy.edit.name).type('[CY] Updated Category name')
  cy.findByText(copy.edit.submit).click()
  cy.wait(2000)

  //Assert that confirmation screen appears
  cy.findByText(copy.edit.success.title).should('exist')
  cy.findByText(copy.edit.success.thanks).should('exist')
  cy.wait(2000)
}

describe('CategoryCreate.js > Category', () => {
  it('Edit a Category After Creation', () => {
    cy.login({
      userName: 'TESTLANGUAGEEIGHT_RECORDER',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageEight/create/category')
    cy.wait(2000)

    // Create a Category
    cy.findByLabelText(copy.create.name).type('[CY] Category name')
    cy.findByText(copy.create.submit).click()

    cy.findByText(copy.create.success.editView).click()
    cy.wait(2000)
    editCategory()
    cy.findByText(copy.create.success.editView).click()
    cy.wait(2000)
    editCategory()
  })

  it('Edit a Category From The Browse List', () => {
    cy.login({
      userName: 'TESTLANGUAGEEIGHT_RECORDER',
    })

    // Create a Category
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageEight/create/category')
    cy.wait(2000)
    cy.findByLabelText(copy.create.name).type('[CY] Category name')
    cy.findByText(copy.create.submit).click()
    cy.wait(2000)

    // Edit from Browse List
    cy.findByText(copy.create.success.browseView).click()
    cy.findByText('[CY] Category name')
      .parent()
      .parent()
      .contains('Edit')
      .click()
    cy.wait(2000)

    editCategory()
  })
})
