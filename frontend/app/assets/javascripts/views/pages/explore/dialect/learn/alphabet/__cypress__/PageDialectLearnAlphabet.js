// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('PageDialectLearnAlphabet', () => {
  it('FW-333: Can\'t "Edit Character" from alphabet', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.')
    cy.expect(true).to.equal(false)

    // Login
    cy.login({ url: 'https://dev.firstvoices.com/nuxeo/startup' })

    cy.visit('/explore/FV/Workspaces/Data/Cypress/Cypress/Cypress/learn/alphabet/FW-333/edit')

    cy.wait(500)

    // deletes any pre-existing audio files
    cy.getByTestId('pageContainer').within(($el) => {
      if ($el.find('[data-testid=removeAudio]').length) {
        $el.find('[data-testid=removeAudio]').each(() => {
          cy.get('[data-testid=removeAudio]')
            .first()
            .parent()
            .click()
          cy.log('Deleted existing audio file')
        })
      }
    })

    cy.getByText('add audio', { exact: false }).click()

    cy.getByText('add audio', { exact: false })
      .parents('fieldset')
      .first()
      .within(() => {
        cy.getByText('BROWSE EXISTING', { exact: false }).click()
      })

    cy.wait(500)

    cy.getByText('Select existing audio', { exact: false })
      .parent()
      .within(() => {
        cy.getByText('Audio 1', { exact: false }).click()
      })

    cy.getByText('save', { exact: false }).click()

    cy.visit('/explore/FV/Workspaces/Data/Cypress/Cypress/Cypress/learn/alphabet/FW-333')
    cy.getByText('audio 1', { exact: false }).should('exist')
  })
})
