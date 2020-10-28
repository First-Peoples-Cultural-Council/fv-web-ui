// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('LangAdminPortal-Inline.js > LangAdminPortal-Inline', () => {
  it('Test to check that a language admin can edit the portal by using the inline pencil.', () => {
    /*
            Login as Language Admin.
        */
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne')
    cy.wait(500)

    // Add to the greeting.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(0)
      .click()
    cy.get('[name="fv-portal:greeting"]').type('TestPortalInlineGreeting')
    cy.findByText('Save').click()

    // Add to the about section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(1)
      .click()
    cy.get('div.ql-editor.ql-blank').type('TestPortalInlineAbout')
    cy.findByText('Save').click()

    // Add to the news section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(2)
      .click()
    cy.get('div.ql-editor.ql-blank').type('TestPortalInlineNews')
    cy.findByText('Save').click()

    // Add to the related links section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(3)
      .click()
    cy.findByText('+ Add new').click()
    cy.findByText('Create Link').click()
    cy.findByTestId('DialogCreateForm__DialogContent').within(() => {
      cy.get('[name="dc:title"]').type('TestPortalInlineRelatedLinkTitle')
      cy.get('[name="dc:description"]').type('TestPortalInlineRelatedLinkDescription')
      cy.get('[name="fvlink:url"]').type(
        'https://dev.firstvoices.com/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne'
      )
      cy.findByText('Save').click()
      cy.wait(500)
    })
    cy.findByText('Save').click()
    cy.wait(500)

    // Change country.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(4)
      .click()
    cy.findByTestId('fvdialect-country').select('United States')
    cy.findByText('Save').click()

    // Add to region section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(5)
      .click()
    cy.findByTestId('EditableComponent__fv-dialect-region').within(() => {
      cy.get('[class="form-control"]').type('TestPortalInlineRegion')
    })
    cy.findByText('Save').click()

    /*
            Reload the page and make sure all changes are visible.
         */
    cy.reload()
    cy.findByText('TestPortalInlineGreeting').should('exist')
    cy.findByText('TestPortalInlineAbout').should('exist')
    cy.findByText('TestPortalInlineNews').should('exist')
    cy.findByText('TestPortalInlineRelatedLinkTitle').should('exist')
    cy.findByText('US', { exact: true }).should('exist')
    cy.findByText('TestPortalInlineRegion').should('exist')

    /*
      Test to make sure the public view does not change yet.
     */
    cy.findByText('Public View').click()
    cy.findByText('TestPortalInlineGreeting').should('not.exist')
    cy.findByText('TestPortalInlineAbout').should('not.exist')
    cy.findByText('TestPortalInlineNews').should('not.exist')
    cy.findByText('TestPortalInlineRelatedLinkTitle').should('not.exist')
  })
})
