// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecApprovalCreateDelete-Story.js > RecApprovalCreateDelete-Stories', () => {
  it('Test to check recorder with approval creation and deletion of stories.', () => {
    /*
                            Login as Recorder with Approval and check that no stories currently exists.
                        */
    cy.login({
      userName: 'TESTLANGUAGETHREE_RECORDER_APPROVER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/stories')
    cy.wait(500)
    cy.queryByText('TestStoryTitle').should('not.exist')
    cy.queryByText('Continue to story').should('not.exist')

    /*
                        Going through the steps to create a phrase
                    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: false }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Stories', { exact: true }).click()
    })
    cy.wait(500)
    cy.getByText('Create Story Book', { exact: true }).click()

    /*
                Enter the data to create a new story book.
             */
    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('TestStoryTitle')
      cy.queryAllByText('+ Add new')
        .eq(0)
        .click()
      cy.get('[name="fvbook:title_literal_translation[0][translation]"]').type('TestStoryTranslation')
      cy.get('div.ql-editor.ql-blank').type('TestStoryBookIntroduction')
      cy.queryAllByText('+ Add new')
        .eq(1)
        .click()
      cy.get('table').within(() => {
        cy.get('div.ql-editor.ql-blank').type('TestStoryBookIntroductionTranslation')
      })
    })

    /*
                        Audio upload
                     */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(2)
        .click()
      cy.getByText('Upload New').click()
    })
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="dc:title"]').type('TestStoryAudio')
      cy.get('[name="dc:description"]').type('TestStoryAudioDescription')
      const fileName = 'TestRelatedAudio.wav'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.getByText('Insert into entry').click()

    /*
                        Image upload
                     */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(3)
        .click()
      cy.getByText('Upload New').click()
    })
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="dc:title"]').type('TestStoryImage')
      cy.get('[name="dc:description"]').type('TestStoryImageDescription')
      const fileName = 'TestRelatedImage.png'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.getByText('Insert into entry').click()

    /*
                        Video upload
                     */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(4)
        .click()
      cy.getByText('Upload New').click()
    })
    cy.get('div.form-horizontal').within(() => {
      cy.get('[name="dc:title"]').type('TestStoryVideo')
      cy.get('[name="dc:description"]').type('TestStoryVideoDescription')
      const fileName = 'TestRelatedVideo.mp4'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.getByText('Insert into entry').click()

    /*
                        Finishing the story creation form and save
                     */
    cy.get('fieldset.fieldset').within(() => {
      cy.queryAllByText('+ Add new')
        .eq(6)
        .click()
      cy.get('[name="fv:cultural_note[0]"]', { exact: true }).type('TestStoryCulturalNote')
    })
    cy.getByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
                        Checking to see if the story now exists.
                    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/stories')
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('TestStoryTitle').should('exist')
      cy.getByText('TestStoryTranslation').should('exist')
      cy.getByText('Continue to story').should('exist')
    })

    /*
                        Make sure that the enabled toggle is available and click it.
                        Make sure that the published toggle becomes available and click it.
                    */
    cy.wait(500)
    cy.getByText('TestStoryTitle').click()
    cy.getByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(0)
          .click()
      })
    })
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(1)
          .click()
      })
    })
    cy.getByTestId('ViewWithActions__buttonPublish').click()

    /*
                        Check that edit book button is visible and functional.
                        Check that the cancel button when editing story works.
                    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/stories')
    cy.wait(800)
    cy.getByText('TestStoryTitle').click()
    cy.getByText('Edit')
      .should('exist')
      .click()
    cy.get('fieldset.fieldset').within(() => {
      cy.getByText('Book title', { exact: true }).should('exist')
      cy.getByText('Book title translation', { exact: true }).should('exist')
      cy.getByText('Book introduction', { exact: true }).should('exist')
    })
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Cancel').click()
    })
    cy.getByText('Yes').click()

    /*
                        Check that edit book saves properly.
                    */
    cy.getByText('Edit')
      .should('exist')
      .click()
    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('TestStoryTitle1')
    })
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Save').click()
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/stories')
    cy.wait(500)
    cy.getByText('TestStoryTitleTestStoryTitle1', { exact: true })
      .should('exist')
      .click()

    /*
                        Test fonts.
                     */
    cy.get('div.PromiseWrapper').should('have.css', 'font-family', 'Arial, sans-serif')

    /*
                        Delete the story and check that it no longer exists.
                    */
    cy.getByText('Delete book').click()
    cy.getByTestId('ViewWithActions__dialog').within(() => {
      cy.getByTestId('ViewWithActions__buttonDelete').click()
    })
    cy.wait(500)
    cy.getByText('Delete book success').should('exist')

    cy.getByText('Return To Previous Page').click()
    cy.wait(1500)
    cy.queryByText('TestStoryTitleTestStoryTitle1').should('not.exist')
    cy.queryByText('Continue to story').should('not.exist')
  })
})
