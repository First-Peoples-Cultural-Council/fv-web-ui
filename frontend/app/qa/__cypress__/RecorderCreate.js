import '@testing-library/cypress/add-commands'
import copy from '../../../app/components/Recorder/copy'

describe('Recorder/Create.js > RecorderCreate', () => {
  it('Create', () => {
    // Login
    cy.login({
      userName: 'TestDialectPrivate_language_administrators',
      userPassword: 'TestDialectPrivate_language_administrators',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPrivate/create/recorder')
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)

    // Fill in required field
    cy.findByLabelText(`${copy.create.name} *`).type('[CY] Recorder Name')

    // Resubmit
    cy.findByText(copy.create.submit).click()

    // Should see success
    cy.findByText(copy.create.success.title).should('exist')

    // Create another
    cy.findByText(copy.create.success.linkCreateAnother).click()

    // Confirm
    cy.findByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.findByText(copy.create.submit).click()

    // Error should be displayed
    cy.findByLabelText(copy.validation.name)
  })
})
