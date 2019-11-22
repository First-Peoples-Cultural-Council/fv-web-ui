// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('Breadcrumb.js > Breadcrumb', () => {
  it('FW-235: Breadcrumb link to home page from Photo Gallery broken', () => {
    /*
      Temporary line to force the test to fail until it is updated.
     */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.visit('/explore/FV/sections/Data/Wakashan/Nuu%C4%8Daan%CC%93u%C9%AB/Ehattesaht%20Nuchatlaht/gallery')
    cy.getByTestId('pageContainer').within(() => {
      cy.log('Confirm on gallery page')
      cy.queryByText('Ehattesaht nuchatlaht galleries', { exact: false }).should('exist')
    })

    cy.log('Click breadcrumb')
    cy.getByText('Ehattesaht Nuchatlaht Home Page', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.log('Confirm on dialect home page')
      cy.queryByText('about us', { exact: false }).should('exist')
      cy.queryByText('play a game', { exact: false }).should('exist')
      cy.queryByText('photo gallery', { exact: false }).should('exist')
    })
  })
})
