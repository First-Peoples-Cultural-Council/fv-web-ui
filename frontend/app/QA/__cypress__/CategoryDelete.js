// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Category/internationalization.js'

const createCategories = (start, max) => {
  if (start >= max) {
    return
  }

  const categoryName = `[CY] A Category ${start}`
  cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageEight/create/category')
  cy.wait(2000)
  cy.findByLabelText(copy.create.name).type(categoryName)
  cy.findByText(copy.create.submit).click()
  cy.wait(1000)

  const count = start + 1

  if (count !== max) {
    createCategories(count, max)
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
  cy.findByText(copy.batch.select)
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

  const categoryForDialectFilterListTest = 'TestDialectCategory'

  // We want to ensure that the TestDialectCategory is not deleted from the list as this is used for later testing.
  cy.get('body').then(($body) => {
    if ($body.text().includes(categoryForDialectFilterListTest)) {
      cy.findByText(categoryForDialectFilterListTest)
        .parent()
        .parent()
        .find('.Checkbox input')
        .click()
      cy.wait(1000)
    }
  })

  // Perform batch delete
  cy.get(
    '.DictionaryList__data > .Confirmation > .Confirmation__confirmOrDeny > .Confirmation__confirmOrDenyInner > .Confirmation__btnConfirm > .Confirmation__btnConfirmText'
  ).click()
  cy.wait(2000)
}

describe('CategoryCreate.js > Category', () => {
  it('Delete a category from edit screen', () => {
    cy.login({
      userName: 'TESTLANGUAGEEIGHT_RECORDER',
    })

    // Create a Category
    createCategories(0, 1)

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

  it('Deletes a category from browse screen', () => {
    cy.login({
      userName: 'TESTLANGUAGEEIGHT_RECORDER',
    })

    const categoryName = '[CY] A Category 0'

    createCategories(0, 1)

    cy.findByText(copy.create.success.browseView).click()
    cy.wait(3000)

    // Test state of category browse delete button
    cy.findByText(categoryName)
      .should('exist')
      .parent()
      .parent()
      .contains(copy.create.btnInitiate)
      .click()
    cy.wait(1000)
    cy.findByText(categoryName)
      .parent()
      .parent()
      .within(() => {
        cy.findByText(copy.create.btnDeny)
          .should('exist')
          .click()
      })
    cy.wait(2000)
    cy.findByText(categoryName)
      .should('exist')
      .parent()
      .parent()
      .find('button.Confirmation__btnInitiate')
      .click()

    // Test Delete
    cy.findByText(categoryName)
      .parent()
      .parent()
      .within(() => {
        cy.findByText(copy.create.btnConfirm)
          .should('exist')
          .click()
      })
    cy.wait(2000)
  })

  it('Batch deletes entries from from browse screen', () => {
    cy.login({
      userName: 'TESTLANGUAGEEIGHT_RECORDER',
    })

    // Create 5 Categories
    createCategories(0, 5)
    cy.findByText(copy.create.success.browseView).click()
    cy.wait(2000)

    // Perform batch delete from browse screen
    performBatchDelete()
  })
})
