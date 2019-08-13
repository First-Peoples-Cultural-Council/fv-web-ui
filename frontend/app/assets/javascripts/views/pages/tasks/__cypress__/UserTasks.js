// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('UserTasks.js > UserTasks', () => {
  it('FW-295: Language Admin user registration approval page not loading', () => {
    cy.log('Note: If FW-295 has regressed the following `visit()` will loop forever, hanging the test')
    cy.visit('http://0.0.0.0:3001/nuxeo/app/tasks/users/13e3f46d-72aa-4afc-8687-207926f644e5')
    cy.getByTestId('pageContainer').within(() => {
      cy.log('Confirm page loaded')
      cy.queryByText('User Registration Requests', { exact: false }).should('exist')
      cy.log('Confirm not allowed')
      cy.queryByText('You are not authorized to view this content.', { exact: false }).should('exist')
    })
  })
})
