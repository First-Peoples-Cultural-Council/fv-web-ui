// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('Breadcrumb', () => {
  it('FW-235: Breadcrumb link to home page from Photo Gallery broken', () => {
    cy.log('NOTE: Test expects to be run with `npm run startPreprod`')
    cy.visit(
      'http://0.0.0.0:3001/nuxeo/app/explore/FV/sections/Data/Wakashan/Nuu%C4%8Daan%CC%93u%C9%AB/Ehattesaht%20Nuchatlaht/gallery'
    )
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

    cy.log('Test complete')
  })
})
