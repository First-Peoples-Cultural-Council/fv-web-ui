// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('Breadcrumb.js > Breadcrumb', () => {
  it('FW-235: Breadcrumb link to home page from Photo Gallery broken', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageTwo/gallery')
    cy.getByTestId('pageContainer').within(() => {
      cy.log('Confirm on gallery page')
      cy.queryByText('Testlanguagetwo galleries', { exact: false }).should('exist')
    })

    cy.log('Click breadcrumb')
    cy.getByText('Testlanguagetwo Home Page', { exact: false }).click()
    cy.getByTestId('pageContainer').within(() => {
      cy.log('Confirm on dialect home page')
      cy.queryByText('about us', { exact: false }).should('exist')
      cy.queryByText('play a game', { exact: false }).should('exist')
      cy.queryByText('photo gallery', { exact: false }).should('exist')
    })
  })
})
