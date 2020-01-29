// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('PageDialectLearnAlphabet', () => {
  it('FW-333: Can\'t "Edit Character" from alphabet', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/alphabet/z/edit')

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
    cy.pause()

    cy.getByText('+ Add audio', { exact: false }).click()
    cy.wait(3000)

    cy.getByText('+ Add audio', { exact: false })
      .parents('fieldset')
      .first()
      .within(() => {
        cy.getByText('Browse Existing', { exact: false }).click()
      })

    cy.wait(500)

    cy.get('.media-list').within(() => {
      cy.getByText('Audio 1', { exact: false }).click()
    })

    cy.getByText('save', { exact: false }).click()

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/alphabet/z')
    cy.wait(500)
    cy.getByText('Audio 1', { exact: false }).should('exist')
  })
})
