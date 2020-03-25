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
      'url("http://127.0.0.1:3001/explore/FV/Workspaces/Data/Test/Test/assets/images/cover.png")'
    )

    cy.getByText('Edit').click()
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
      cy.getByText('Featured words')
        .parent()
        .within(() => {
          cy.getByText('+ Add new').click()
          cy.getByText('Browse Existing').click()
        })
    })
    cy.wait(500)
    cy.getByText('Dragon')
      .parent()
      .parent()
      .within(() => {
        cy.getByText('Select').click()
      })
    cy.wait(500)
    cy.get('div.form-horizontal').within(() => {
      cy.getByText('Related links')
        .parent()
        .within(() => {
          cy.getByText('+ Add new').click()
          cy.getByText('Create Link').click()
        })
    })
    cy.getByText('Add New Link To Testlanguagesix')
      .parent()
      .within(() => {
        cy.get('[name="dc:title"]').type('TestPortalRelatedLinkTitle')
        cy.get('[name="dc:description"]').type('TestPortalRelatedLinkDescription')
        cy.get('[name="fvlink:url"]').type('http://127.0.0.1:3001/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix')
        cy.getByText('Save').click()
      })

    /*
            Add audio to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.getByText('Create new audio in the testlanguagesix dialect')
      .parent()
      .parent()
      .within(() => {
        cy.get('[name="dc:title"]').type('TestPortalAudio')
        cy.get('[name="dc:description"]').type('TestPortalAudioDescription')
        const fileName = 'TestRelatedAudio.wav'
        cy.fixture(fileName, 'base64').then((fileContent) => {
          cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
        })
        cy.getByText('Upload Media', { exact: true }).click()
      })
    cy.wait(2000)
    cy.getByText('Insert into entry').click()

    /*
            Add a background image to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.getByText('Create new picture in the testlanguagesix dialect')
      .parent()
      .parent()
      .within(() => {
        cy.get('[name="dc:title"]').type('TestPortalBackgroundImage')
        cy.get('[name="dc:description"]').type('TestPortalBackgroundImageDescription')
        const fileName = 'TestBackgroundImage.jpg'
        cy.fixture(fileName, 'base64').then((fileContent) => {
          cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/jpg', encoding: 'base64' })
        })
        cy.getByText('Upload Media', { exact: true }).click()
      })
    cy.wait(2000)
    cy.getByText('Insert into entry').click()

    /*
            Add a logo image to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.getByText('Create new picture in the testlanguagesix dialect')
      .parent()
      .parent()
      .within(() => {
        cy.get('[name="dc:title"]').type('TestLogoBackgroundImage')
        cy.get('[name="dc:description"]').type('TestLogoBackgroundImageDescription')
        const fileName = 'TestRelatedImage.png'
        cy.fixture(fileName, 'base64').then((fileContent) => {
          cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
        })
        cy.getByText('Upload Media', { exact: true }).click()
      })
    cy.wait(2000)
    cy.getByText('Insert into entry').click()

    /*
            Save and check that the info is now live on the home language page.
         */
    cy.getByText('Save').click()
    cy.wait(500)
    cy.reload()
    cy.wait(500)

    cy.get('#portalFeaturedAudio').should('exist')
    cy.queryByText('TestPortalGreeting').should('exist')
    cy.queryByText('TestPortalIntroduction').should('exist')
    cy.queryByText('TestPortalNews').should('exist')
    cy.queryByText('TestPortalRelatedLinkTitle').should('exist')

    cy.get('div.Header.row').should(
      'not.have.css',
      'background-image',
      'url("http://127.0.0.1:3001/explore/FV/Workspaces/Data/Test/Test/assets/images/cover.png")'
    )

    /*
        Test that if a user clicks cancel when editing, the changes don't save.
     */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix')
    cy.wait(500)
    cy.getByText('Edit').click()
    cy.wait(500)

    cy.get('input.form-control').type('ThisShouldNotSave')
    cy.getByTestId('withForm__btnGroup2').within(() => {
      cy.getByText('Cancel').click()
    })
    cy.getByText('Yes').click()

    cy.queryByText('ThisShouldNotSave').should('not.exist')
    cy.queryByText('TestPortalGreetingThisShouldNotSave').should('not.exist')

    /*
        Check that the information is visible on the public view
     */
    cy.getByText('Publish Changes').click()
    cy.queryByText('Portal Published Successfully!').should('exist')
    cy.getByText('Public View').click()
    cy.wait(1000)
    cy.get('#portalFeaturedAudio').should('exist')
    cy.queryByText('TestPortalGreeting').should('exist')
    cy.queryByText('TestPortalIntroduction').should('exist')
    cy.queryByText('TestPortalNews').should('exist')
    cy.queryByText('TestPortalRelatedLinkTitle').should('exist')

    cy.get('div.Header.row').should(
      'not.have.css',
      'background-image',
      'url("http://127.0.0.1:3001/explore/FV/Workspaces/Data/Test/Test/assets/images/cover.png")'
    )
  })
})
