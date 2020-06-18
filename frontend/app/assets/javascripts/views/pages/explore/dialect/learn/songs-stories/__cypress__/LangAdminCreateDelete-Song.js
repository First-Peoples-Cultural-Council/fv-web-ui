// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('LangAdminCreateDelete-Song.js > LangAdminCreateDelete-Song', () => {
  it('Test to check that a language admin can create and delete songs.', () => {
    /*
                    Login as Language Admin and check that no songs currently exists.
                */
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/songs')
    cy.wait(1000)
    cy.findByText('TestSongTitle').should('not.exist')
    cy.findByText('Continue to song').should('not.exist')
    cy.findByText('Create Song Book', { exact: true }).click()

    /*
            Enter the data to create a new song book.
         */
    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('TestSongTitle')
      cy.queryAllByText('+ Add new')
        .eq(0)
        .click()
      cy.get('[name="fvbook:title_literal_translation[0][translation]"]').type('TestSongTranslation')
      cy.get('div.ql-editor.ql-blank').type('TestSongBookIntroduction')
      cy.queryAllByText('+ Add new')
        .eq(1)
        .click()
      cy.get('table').within(() => {
        cy.get('div.ql-editor.ql-blank').type('TestSongBookIntroductionTranslation')
      })
    })

    /*
                Audio upload
             */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(2)
        .click()
      cy.findByText('Upload New').click()
    })
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="dc:title"]').type('TestSongAudio')
      cy.get('[name="dc:description"]').type('TestSongAudioDescription')
      const fileName = 'TestRelatedAudio.wav'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
                Image upload
             */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(3)
        .click()
      cy.findByText('Upload New').click()
    })
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="dc:title"]').type('TestSongImage')
      cy.get('[name="dc:description"]').type('TestSongImageDescription')
      const fileName = 'TestRelatedImage.png'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
                Video upload
             */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(4)
        .click()
      cy.findByText('Upload New').click()
    })
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="dc:title"]').type('TestSongVideo')
      cy.get('[name="dc:description"]').type('TestSongVideoDescription')
      const fileName = 'TestRelatedVideo.mp4'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
                Finishing the song creation form and save
             */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(6)
        .click()
      cy.get('[name="fv:cultural_note[0]"]', { exact: true }).type('TestSongCulturalNote')
    })
    cy.findByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
                    Checking to see if the song now exists.
                */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/songs')
    cy.wait(500)
    cy.findByTestId('pageContainer').within(() => {
      cy.findByText('TestSongTitle').should('exist')
      cy.findByText('TestSongTranslation').should('exist')
      cy.findByText('Continue to song').should('exist')
    })

    /*
                    Check that edit song button is visible and functional.
                    Check that the cancel button when editing song works.
                */
    cy.findByText('TestSongTitle').click()
    cy.findByText('Edit')
      .should('exist')
      .click()
    cy.wait(500)
    cy.get('fieldset.fieldset').within(() => {
      cy.findByText('Book title', { exact: true }).should('exist')
      cy.findByText('Book title translation', { exact: true }).should('exist')
      cy.findByText('Book introduction', { exact: true }).should('exist')
    })
    cy.wait(500)
    cy.findByTestId('withForm__btnGroup1').within(() => {
      cy.findByText('Cancel').click()
    })
    cy.findByText('Yes').click()

    /*
                    Check that edit song saves properly.
                */
    cy.findByText('Edit')
      .should('exist')
      .click()
    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('TestSongTitle1')
    })
    cy.findByTestId('withForm__btnGroup1').within(() => {
      cy.findByText('Save').click()
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/songs')
    cy.wait(500)
    cy.findByText('TestSongTitleTestSongTitle1', { exact: true })
      .should('exist')
      .click()

    /*
                    Delete the song and check that it no longer exists.
                */
    cy.findByText('Delete book').click()
    cy.findByTestId('ViewWithActions__dialog').within(() => {
      cy.findByTestId('ViewWithActions__buttonDelete').click()
    })
    cy.wait(500)
    cy.findByText('Delete book success').should('exist')

    cy.findByText('Return To Previous Page').click()
    cy.wait(500)

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/songs')
    cy.wait(500)

    cy.findByText('TestSongTitleTestSongTitle1').should('not.exist')
    cy.findByText('Continue to song').should('not.exist')
  })
})
