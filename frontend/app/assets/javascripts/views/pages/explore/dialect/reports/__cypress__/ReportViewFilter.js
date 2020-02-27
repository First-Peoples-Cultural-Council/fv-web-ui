// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('ReportViewFilter.js > ReportViewFilter', () => {
  it('Test to check that reports are generated properly.', () => {
    cy.exec('bash ./scripts/ResetWordLangFive.sh enabled-true', { env: { TARGET: Cypress.env('TARGET') } })
      .its('stdout')
      .should('contain', 'Reset TestLanguageFive dictionary successfully.')

    /*
                Login as member and navigate to the reports page.
            */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive')
    cy.wait(500)
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.wait(800)
    cy.getByText('Reports', { exact: false }).click({ force: true })

    /*
            Check that the 52 different reports appear.
         */
    cy.get('.FilteredGridList')
      .queryAllByText('•')
      .should('have.length', 52)

    /*
            Check to make sure that when a specific report type is clicked that it generates the proper reports for that type.
         */
    cy.getByText('Words in Enabled Status').click()
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('Enabled').should('exist')
    })
  })

  it('Test to check the report keyword filter.', () => {
    /*
                Login as member and navigate to the reports page.
            */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFive')
    cy.wait(1000)
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.getByText('Reports', { exact: true }).click({ force: true })
    cy.wait(1000)

    /*
            Check that the 52 different reports appear.
         */
    cy.get('.FilteredGridList')
      .queryAllByText('•')
      .should('have.length', 52)

    /*
            Filter the report selection by "Audio".
         */
    cy.get('fieldset.fieldset').within(() => {
      cy.get('input.form-control').type('Audio')
    })
    cy.wait(500)
    cy.getByText('Filter').click()

    /*
            Check that after filtering only the proper six exist.
         */
    cy.get('.FilteredGridList')
      .queryAllByText('•')
      .should('have.length', 6)
    cy.getByText('Words without Audio', { exact: true }).should('exist')
    cy.getByText('Phrases without Audio', { exact: true }).should('exist')
    cy.getByText('Songs without Audio', { exact: true }).should('exist')
    cy.getByText('Stories without Audio', { exact: true }).should('exist')
  })
})
