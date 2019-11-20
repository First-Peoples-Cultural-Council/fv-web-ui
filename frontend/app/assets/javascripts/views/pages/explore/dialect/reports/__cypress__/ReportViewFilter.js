// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('ReportViewFilter.js > ReportViewFilter', () => {
  it('Test to check that reports are generated properly.', () => {
    cy.exec('bash ./scripts/ResetWordLangFive.sh enabled-true')
      .its('stdout')
      .should('contain', 'Reset TestLanguageFive dictionary successfully.')

    /*
                Login as member and navigate to the reports page.
            */
    cy.login({
      userName: 'TESTLANGUAGEFIVE_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageFive')
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.getByText('Reports', { exact: true }).click()

    /*
            Check that the 50 different reports appear.
         */
    cy.get('div.row').within(() => {
      cy.get('div.row').within(() => {
        cy.get('div.row')
          .children()
          .should('have.length', 50)
      })
    })

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
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/TestLanguageFive')
    cy.get('[title="More Options"]', { exact: true }).click()
    cy.getByText('Reports', { exact: true }).click()

    /*
            Check that the 50 different reports appear.
         */
    cy.get('div.row').within(() => {
      cy.get('div.row').within(() => {
        cy.get('div.row')
          .children()
          .should('have.length', 50)
      })
    })

    /*
            Filter the report selection by "Audio".
         */
    cy.get('fieldset.fieldset').within(() => {
      cy.get('input.form-control').type('Audio')
    })
    cy.wait(500)
    cy.getByText('Filter').click()

    /*
            Check that after filtering only the proper four exist.
         */
    cy.get('div.row').within(() => {
      cy.get('div.row').within(() => {
        cy.get('div.row')
          .children()
          .should('have.length', 4)
      })
    })
    cy.getByText('Words without Audio', { exact: true }).should('exist')
    cy.getByText('Phrases without Audio', { exact: true }).should('exist')
    cy.getByText('Songs without Audio', { exact: true }).should('exist')
    cy.getByText('Stories without Audio', { exact: true }).should('exist')
  })
})
