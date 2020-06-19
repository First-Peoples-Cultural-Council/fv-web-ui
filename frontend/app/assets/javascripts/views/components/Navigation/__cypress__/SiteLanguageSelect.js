// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('SiteLanguage.js > SiteLanguageSelect.js', () => {
  it('Test to check that a guest can view the website in French if they prefer.', () => {
    /*
            Navigate to main page as a guest.
         */
    cy.visit('/home')
    cy.wait(500)
    cy.get('[title="Language Settings"]').click()

    /*
            Change the website to French.
         */
    //TODO: need a better hook to click the choose language arrow.
    cy.findByText('English').click()
    cy.findByText('Français').click()
    cy.wait(1000)
    cy.reload()

    /*
            Check that various parts of the website are now correctly translated to French.
         */
    cy.get('[id="pageNavigation"]').within(() => {
      cy.findByText('Explorer Langues', { exact: false }).should('exist')
      cy.get('[placeholder="Rechercher:"]').should('exist')
    })
    cy.get('div.PromiseWrapper').within(() => {
      cy.get('div.row').within(() => {
        cy.findByText('Commencer', { exact: false }).should('exist')
      })
    })

    cy.get('div.container-fluid').within(() => {
      cy.findByText('Avis de non-responsabilité', { exact: false }).should('exist')
      cy.findByText('Conditions d’utilisation', { exact: false }).should('exist')
      cy.findByText('Aide', { exact: false }).should('exist')
      cy.findByText('Faire un don', { exact: false }).should('exist')
    })

    cy.findByTestId('Navigation__open').click()
    cy.findByText('Accueil', { exact: false }).should('exist')
    cy.findByText('Commencer', { exact: false }).should('exist')
    cy.findByText('Explorer langues', { exact: false }).should('exist')
    cy.findByText('Enfants', { exact: false }).should('exist')
    cy.findByText('Contribuer', { exact: false }).should('exist')

    // TODO: Add check for sign in page. Currently it doesn't change to french.
  })
})
