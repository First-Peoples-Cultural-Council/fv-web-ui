describe('portal_edit.js > ExploreDialect', () => {
  it('Update Dialect Home >  About Us', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // Login
    cy.login()

    cy.visit(
      "http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Demonstration/%7BDemonstration%7D/Alex's%20Demo"
    )

    const updateMessage = `PORTAL UPDATE (${new Date()})`
    cy.getByText('ABOUT US')
      // TODO: need more reliable hook
      .parents('div:first')
      .parent()
      .within(() => {
        cy.getByText('mode_edit')
          .parents('button:first')
          .click()
        // Note: need to wait for WYSIWYG editor to init
        cy.wait(500)

        cy.getByTestId('wysiwyg__userInput')
          .clear()
          .type(updateMessage)

        cy.getByText('Save', { exact: false }).click()
      })
    cy.getByText('ABOUT US')
      // TODO: need more reliable hook
      .parents('div:first')
      .parent()
      .within(() => {
        cy.wait(500)
        cy.getByText(updateMessage).should('exist')
      })
  })
})
