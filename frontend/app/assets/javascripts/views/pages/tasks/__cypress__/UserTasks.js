// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('UserTasks.js > UserTasks', () => {
  it('FW-295: Language Admin user registration approval page not loading', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.log('Note: If FW-295 has regressed the following `visit()` will loop forever, hanging the test')
    cy.visit('/tasks/users/13e3f46d-72aa-4afc-8687-207926f644e5')
    cy.getByTestId('pageContainer').within(() => {
      cy.log('Confirm page loaded')
      cy.queryByText('User Registration Requests', { exact: false }).should('exist')
      cy.log('Confirm not allowed')
      cy.queryByText('You are not authorized to view this content.', { exact: false }).should('exist')
    })
  })
  /*
CyLanguageAdmin	CyLanguageAdmin	CyLanguageAdmin
CyMember	CyMember	CyMember
CyRecorder	CyRecorder	CyRecorder
CyRecorderApproval	CyRecorderApproval	CyRecorderApproval
*/
  it('FW-339: No tasks are displayed for Language Admins', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.login({
      userName: 'CY_RECOREDER_USERNAME',
      userPassword: 'CY_RECOREDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/Cypress/Cypress/Cypress/learn/words/53c88402-8323-4d51-8793-fcdd42edd468')

    cy.wait(1000)

    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('enable', { exact: false }).click()
    })

    cy.getByText('Menu open', { exact: false }).click({ force: true })
    cy.wait(500)
    cy.getByTestId('LeftNav').within(() => {
      cy.getByText('sign out', { exact: false }).click()
    })
    cy.wait(1000)

    cy.login({
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/tasks')
    cy.getByText('FW-339 No tasks are displayed for Language Admins', { exact: false })
      .parents('tr')
      .first()
      .within(() => {
        cy.getByTestId('Tasks__approveRejectContainer').within(() => {
          cy.getByText('reject', { exact: false }).click()
        })
      })
  })
})
