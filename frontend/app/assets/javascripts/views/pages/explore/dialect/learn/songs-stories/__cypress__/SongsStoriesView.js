// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('SongsStoriesView.js > SongsStoriesView', () => {
  it('FW-298: Broken buttons on Book page', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.login()
    cy.visit(
      "http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Demonstration/%7BDemonstration%7D/Alex's%20Demo/learn/stories/4d8ca4b9-58be-4b66-b94f-0066caf51a7d"
    )

    cy.getByText('add new page', { exact: false }).click()
    cy.getByText('Add New Entry To', { exact: false }).should('exist')
  })
})
