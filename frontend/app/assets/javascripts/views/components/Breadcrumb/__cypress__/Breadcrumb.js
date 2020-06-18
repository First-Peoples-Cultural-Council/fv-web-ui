// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('Breadcrumb.js > Breadcrumb', () => {
  it('FW-235: Breadcrumb link to home page from Photo Gallery broken', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageTwo/gallery')
    cy.findByTestId('pageContainer').within(() => {
      cy.log('Confirm on gallery page')
      cy.findByText('Testlanguagetwo galleries', { exact: false }).should('exist')
    })

    cy.log('Click breadcrumb')
    cy.findByText('Testlanguagetwo Home Page', { exact: false }).click()
    cy.findByTestId('pageContainer').within(() => {
      cy.log('Confirm on dialect home page')
      cy.findByText('about us', { exact: false }).should('exist')
      cy.findByText('play a game', { exact: false }).should('exist')
      cy.findByText('photo gallery', { exact: false }).should('exist')
    })
  })
})
