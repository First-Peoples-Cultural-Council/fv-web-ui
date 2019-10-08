// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('LangAdminPortal.js > LangAdminCreatePortal', () => {
  it('Test to check that a language admin can edit the portal.', () => {
    // TODO: Add database setup here.
    // Requires the default portal information and media is all that exists for SENCOTEN.

    /*
                        Login as Language Admin and navigate to the edit portal page.
                    */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')

    /*
            Test that the default images are showing and not the new ones already.
         */
    cy.get('#pageNavigation > div > div.row > h2').within(() => {
      cy.get('img[src="assets/images/cover.png"]').should('exist')
    })
    cy.get('div.Header.row').should(
      'have.css',
      'background-image',
      'url("http://127.0.0.1:3001/explore/FV/Workspaces/Data/TEst/Test/assets/images/cover.png")'
    )

    cy.getByText('Edit Portal').click()
    cy.wait(500)

    /*
            Add info to portal form.
         */
    cy.get('input.form-control').type('TestPortalGreeting')
    cy.get('div.ql-editor.ql-blank')
      .eq(0)
      .type('TestPortalIntroduction')
    cy.get('div.ql-editor.ql-blank').type('TestPortalNews')

    /*
            Add audio to the portal.
         */
    cy.queryAllByText('Upload New')
      .eq(0)
      .click()
    cy.getByText('Create new audio in the sencoten dialect')
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
    cy.getByText('Create new picture in the sencoten dialect')
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
    cy.getByText('Create new picture in the sencoten dialect')
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

    cy.get('div.Header.row').should(
      'not.have.css',
      'background-image',
      'url("http://127.0.0.1:3001/explore/FV/Workspaces/Data/TEst/Test/assets/images/cover.png")'
    )
    cy.get('#pageNavigation > div > div.row > h2').within(() => {
      cy.get('img[src="assets/images/cover.png"]').should('not.exist')
    })
  })
})
