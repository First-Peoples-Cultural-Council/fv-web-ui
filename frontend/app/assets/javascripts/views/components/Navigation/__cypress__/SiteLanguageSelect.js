// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('SiteLanguage.js > SiteLanguageSelect.js', () => {
  it('Test to check that a guest can view the website in French if they prefer.', () => {
    /*
            Navigate to main page as a guest.
         */
    cy.visit('/home')
    cy.getByText('settings', { exact: true }).click()

    /*
            Change the website to French.
         */
    //TODO: need a better hook to click the choose language arrow.
    cy.get('#pageNavigation > div > div:nth-child(2) > div > div > div').click()
    cy.getByText('Français').click()
    cy.wait(500)

    /*
            Check that various parts of the website are now correctly translated to French.
         */
    cy.get('div.Navigation').within(() => {
      cy.getByText('Explorer Langues').should('exist')
      cy.getByText('Rechercher:').should('exist')
    })
    cy.get('div.PromiseWrapper').within(() => {
      cy.get('div.row').within(() => {
        cy.getByText('Commencer!').should('exist')
      })
    })

    cy.get('div.container-fluid').within(() => {
      cy.getByText('Avis de non-responsabilité').should('exist')
      cy.getByText('Conditions d’utilisation').should('exist')
      cy.getByText('Commentaires').should('exist')
      cy.getByText('Numéro de téléphone').should('exist')
      cy.getByText(': +1-250-882-8919 ·').should('exist')
      cy.getByText('Courriel').should('exist')
      cy.getByText(': support@fpcc.ca').should('exist')
    })

    cy.getByTestId('Navigation__open').click()
    cy.getByText('Accueil').should('exist')
    cy.getByText('Commencer').should('exist')
    cy.getByText('Explorer langues').should('exist')
    cy.getByText('Enfants').should('exist')
    cy.getByText('Contribuer').should('exist')

    // TODO: Add check for sign in page. Currently it doesn't change to french.
  })
})
