// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecApprovalCreateDelete-Song.js > RecApprovalCreateDelete-Song', () => {
  it('Test to check recorder with approval creation and deletion of songs.', () => {
    /*
                        Login as Recorder with Approval and check that no songs currently exists.
                    */
    cy.login({
      userName: 'TESTLANGUAGETHREE_RECORDER_APPROVER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/songs')
    cy.wait(500)
    cy.findByText('TestSongTitle').should('not.exist')
    cy.findByText('Continue to song').should('not.exist')

    /*
                    Going through the steps to create a phrase
                */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: false }).click()
    cy.get('div.Header.row').within(() => {
      cy.findByText('Songs', { exact: true }).click()
    })
    cy.wait(500)
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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/songs')
    cy.wait(500)
    cy.findByTestId('pageContainer').within(() => {
      cy.findByText('TestSongTitle').should('exist')
      cy.findByText('TestSongTranslation').should('exist')
      cy.findByText('Continue to song').should('exist')
    })

    /*
                    Make sure that the enabled toggle is available and click it.
                    Make sure that the published toggle becomes available and click it.
                */
    cy.wait(500)
    cy.findByText('TestSongTitle').click()
    cy.findByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(0)
          .click()
      })
    })
    cy.wait(500)
    cy.findByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(1)
          .click()
      })
    })
    cy.findByTestId('ViewWithActions__buttonPublish').click()

    /*
                    Check that edit book button is visible and functional.
                    Check that the cancel button when editing song works.
                */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/songs')
    cy.wait(800)
    cy.findByText('TestSongTitle').click()
    cy.findByText('Edit')
      .should('exist')
      .click()
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
                    Check that edit book saves properly.
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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/songs')
    cy.wait(500)
    cy.findByText('TestSongTitleTestSongTitle1', { exact: true })
      .should('exist')
      .click()

    /*
                    Test fonts.
                 */
    cy.get('div.PromiseWrapper').should('have.css', 'font-family', 'Arial, sans-serif')

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
    cy.reload()
    cy.wait(500)
    cy.findByText('TestSongTitle').should('not.exist')
    cy.findByText('Continue to song').should('not.exist')
  })
})
