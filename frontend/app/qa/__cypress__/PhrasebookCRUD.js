// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

// TODO: ENABLE WEBPACK ALIASES IN CYPRESS TESTS!
import copy from '../../../app/components/Phrasebook/copy.js'
import browseCopy from '../../../app/components/Phrasebooks/copy.js'

describe('PhrasebookCRUD.js > Phrasebook', () => {
  beforeEach(() => {
    // Login
    cy.login({
      userName: 'TestDialectPublic_recorders',
      userPassword: 'TestDialectPublic_recorders',
    })
  })

  it('Create a Phrase book', () => {
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/create/phrasebook')
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)

    // Fill in required field
    cy.findByLabelText(copy.create.name).type('[CY] Created Phrase book name')

    // Resubmit
    cy.findByText(copy.create.submit).click()

    // Should see success
    cy.findByText(copy.create.success.title).should('exist')
  })

  it('Edit a Phrasebook', () => {
    // Visit browse view
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/phrasebooks')

    // Edit phrase book
    cy.findAllByTestId('DictionaryList__row').first().contains('Edit').click()

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
  })

  it('Delete a phrasebook from edit screen', () => {
    // Visit browse view
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/phrasebooks')

    // Edit phrase book
    cy.findAllByTestId('DictionaryList__row').first().contains('Edit').click()

    cy.findByText(copy.create.btnInitiate).should('exist').click()

    cy.findByText(copy.create.btnDeny).should('exist').click()
    cy.findByText(copy.create.btnInitiate).click()

    cy.findByText(copy.create.btnConfirm).should('exist').click()

    // Confirmation screen
    cy.findByText(copy.edit.successDelete.title).should('exist')
    cy.findByText(copy.edit.success.linkCreateAnother).should('exist')
  })

  it('Batch delete entries from from browse screen', () => {
    // Visit browse view
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/phrasebooks')

    // Select all
    cy.findByText(browseCopy.batch.select).should('exist').click()

    // Delete
    cy.findAllByTestId('DictionaryList__row').last().next('tr').contains(browseCopy.btnInitiate).click()

    cy.findByTestId('Pagination__resultCount').then(($resultCount) => {
      // Capture current total results
      const totalResults = parseInt($resultCount.text(), 10)
      cy.log(`Found ${totalResults} phrase books.`)

      // Confirm delete
      // FindByText (browseCopy.itemsSelected.btnConfirm) may be nested too deep
      cy.findAllByTestId('DictionaryList__row').last().next('tr').find('button.Confirmation__btnConfirm').click()

      // Visit browse view again
      cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/phrasebooks')

      cy.findByTestId('Pagination__resultCount').then(($newResultCount) => {
        const newResults = parseInt($newResultCount.text(), 10)
        cy.log(`Found ${newResults} phrase books.`)
        expect(newResults).to.be.lessThan(totalResults)
      })
    })
  })
})
