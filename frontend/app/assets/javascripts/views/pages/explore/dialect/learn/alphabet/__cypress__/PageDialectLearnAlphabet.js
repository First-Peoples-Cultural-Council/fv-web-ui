// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

describe('PageDialectLearnAlphabet', () => {
  it('FW-333: Can\'t "Edit Character" from alphabet', () => {
    // Login
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/alphabet/z/edit')

    cy.wait(3000)

    // deletes any pre-existing audio files
    cy.findByTestId('pageContainer').within(($el) => {
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
    cy.wait(500)
    cy.findByText('Related audio').within(() => {
      cy.findByText('Replace').should('not.exist')
    })

    cy.findByText('+ Add audio', { exact: false }).click()
    cy.wait(1000)

    cy.findByText('+ Add audio', { exact: false })
      .parents('fieldset')
      .first()
      .within(() => {
        cy.findByText('Browse Existing', { exact: false }).click()
      })

    cy.wait(500)

    cy.get('.media-list').within(() => {
      cy.findByText('Audio 1', { exact: false }).click()
    })

    cy.findByText('save', { exact: false }).click()

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/alphabet/z')
    cy.wait(500)
    cy.findByText('Audio 1', { exact: false }).should('exist')
  })
})
