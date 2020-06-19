// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('LangAdminPortal.js > LangAdminPortal', () => {
  it('Test to check that a language admin can edit the portal.', () => {
    /*
                        Login as Language Admin and navigate to the edit portal page.
                    */
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix')
    cy.wait(500)

    /*
            Test that the default images are showing and not the new ones already.
         */
    cy.get('div.row.Navigation__dialectContainer').within(() => {
      cy.get('img[src="assets/images/cover.png"]').should('exist')
    })
    cy.get('div.Header.row').should(
      'have.css',
      'background-image',
      'url("' + Cypress.env('FRONTEND') + '/explore/FV/Workspaces/Data/Test/Test/assets/images/cover.png")'
    )

    cy.findByText('Edit').click()
    cy.wait(500)

    /*
            Add info to portal form.
         */
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="fv-portal:greeting"]').type('TestPortalGreeting')
      cy.get('div.ql-editor.ql-blank')
        .eq(0)
        .type('TestPortalIntroduction')
      cy.get('div.ql-editor.ql-blank').type('TestPortalNews')
      cy.findByText('Featured words')
        .parent()
        .within(() => {
          cy.findByText('+ Add new').click()
          cy.findByText('Browse Existing').click()
        })
    })
    cy.wait(500)
    cy.findByText('Dragon')
      .parent()
      .parent()
      .within(() => {
        cy.findByText('Select').click()
      })
    cy.wait(500)
    cy.get('div.form-horizontal').within(() => {
      cy.findByText('Related links')
        .parent()
        .within(() => {
          cy.findByText('+ Add new').click()
          cy.findByText('Create Link').click()
        })
    })
    cy.findByTestId('DialogCreateForm__DialogContent').within(() => {
      cy.get('[name="dc:title"]').type('TestPortalRelatedLinkTitle')
      cy.get('[name="dc:description"]').type('TestPortalRelatedLinkDescription')
      cy.get('[name="fvlink:url"]').type(
        Cypress.env('FRONTEND') + '/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix'
      )
      cy.findByText('Save').click()
    })

    /*
            Add audio to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.findByTestId('AddMediaComponent').within(() => {
      cy.get('[name="dc:title"]').type('TestPortalAudio')
      cy.get('[name="dc:description"]').type('TestPortalAudioDescription')
      const fileName = 'TestRelatedAudio.wav'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
            Add a background image to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.findByTestId('AddMediaComponent').within(() => {
      cy.get('[name="dc:title"]').type('TestPortalBackgroundImage')
      cy.get('[name="dc:description"]').type('TestPortalBackgroundImageDescription')
      const fileName = 'TestBackgroundImage.jpg'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/jpg', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
            Add a logo image to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.findByTestId('AddMediaComponent').within(() => {
      cy.get('[name="dc:title"]').type('TestLogoBackgroundImage')
      cy.get('[name="dc:description"]').type('TestLogoBackgroundImageDescription')
      const fileName = 'TestRelatedImage.png'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
            Save and check that the info is now live on the home language page.
         */
    cy.findByText('Save').click()
    cy.wait(500)
    cy.reload()
    cy.wait(500)

    cy.get('#portalFeaturedAudio').should('exist')
    cy.findByText('TestPortalGreeting').should('exist')
    cy.findByText('TestPortalIntroduction').should('exist')
    cy.findByText('TestPortalNews').should('exist')
    cy.findByText('TestPortalRelatedLinkTitle').should('exist')

    cy.get('div.Header.row').should(
      'not.have.css',
      'background-image',
      'url("' + Cypress.env('FRONTEND') + '/explore/FV/Workspaces/Data/Test/Test/assets/images/cover.png")'
    )

    /*
        Test that if a user clicks cancel when editing, the changes don't save.
     */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix')
    cy.wait(500)
    cy.findByText('Edit').click()
    cy.wait(500)

    cy.get('input.form-control').type('ThisShouldNotSave')
    cy.findByTestId('withForm__btnGroup2').within(() => {
      cy.findByText('Cancel').click()
    })
    cy.findByText('Yes').click()

    cy.findByText('ThisShouldNotSave').should('not.exist')
    cy.findByText('TestPortalGreetingThisShouldNotSave').should('not.exist')

    /*
        Check that the information is visible on the public view
     */
    cy.findByText('Publish Changes').click()
    cy.findByText('Portal published successfully!!').should('exist')
    cy.findByText('Public View').click()
    cy.wait(1000)
    cy.get('#portalFeaturedAudio').should('exist')
    cy.findByText('TestPortalGreeting').should('exist')
    cy.findByText('TestPortalIntroduction').should('exist')
    cy.findByText('TestPortalNews').should('exist')
    cy.findByText('TestPortalRelatedLinkTitle').should('exist')

    cy.get('div.Header.row').should(
      'not.have.css',
      'background-image',
      'url("' + Cypress.env('FRONTEND') + '/explore/FV/Workspaces/Data/Test/Test/assets/images/cover.png")'
    )
  })
})
