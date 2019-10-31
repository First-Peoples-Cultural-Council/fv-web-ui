// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('ReportViewFilter.js > ReportViewFilter', () => {
  it('Test to check that reports are generated properly.', () => {
    // TODO: Add database setup here.
    // A test word which has been enabled but not published must exist for SENCOTEN.

    /*
                Login as member and navigate to the reports page.
            */
    cy.login({
      userName: 'SENCOTEN_MEMBER_USERNAME',
      userPassword: 'SENCOTEN_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.get('div.clearfix.page-toolbar').within(() => {
      cy.get('button.hidden-xs', { exact: true }).click()
    })
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
      userName: 'SENCOTEN_MEMBER_USERNAME',
      userPassword: 'SENCOTEN_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.get('div.clearfix.page-toolbar').within(() => {
      cy.get('button.hidden-xs', { exact: true }).click()
    })
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
    /*
        // TODO: Uncomment the next three lines of code and remove the following three lines of code when FW-591 is fixed.
        cy.get('div.FilteredGridList__btnGroup').within(() => {
            cy.getByText('Filter').click()
        })
        */
    // TODO: Remove the following three lines when FW-591 is fixed.
    cy.get('fieldset.fieldset').within(() => {
      cy.get('input.form-control').type('{enter}')
    })

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
