// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderCreate-Story.js > RecorderCreate-Story', () => {
  it('Test to check story creation for recorders.', () => {
    /*
                Login as Recorder and check that no stories exist.
            */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_RECORDER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Stories', { exact: true }).click()
    })
    cy.queryByText('TestStoryTitle').should('not.exist')
    cy.queryByText('Continue to story').should('not.exist')
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
                Checking to see if the story now exists
             */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/stories')
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('TestStoryTitle').should('exist')
      cy.getByText('TestStoryTranslation').should('exist')
      cy.getByText('Continue to story').should('exist')
    })

    /*
                    Test fonts.
                 */
    cy.get('div.CardViewCard').should('have.css', 'font-family', 'Arial, sans-serif')
    cy.logout()

    /*
                Login as language member and check that the story is not visible.
             */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/stories')
    cy.wait(500)
    cy.queryByText('TestStoryTitle').should('not.exist')
    cy.logout()

    /*
                Login as admin, check that the story is editable, and enable the story.
             */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/stories')
    cy.wait(500)
    cy.queryByText('TestStoryTitle')
      .should('exist')
      .click()
    cy.getByText('Edit')
      .should('exist')
      .click()

    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('Edited')
    })
    cy.getByText('Save', { exact: true }).click()
    cy.wait(500)
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/stories')
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('TestStoryTranslation').should('exist')
      cy.getByText('Continue to story').should('exist')
      cy.getByText('TestStoryTitleEdited')
        .should('exist')
        .click()
    })

    cy.getByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(0)
          .click()
      })
    })
    cy.logout()

    /*
                Login as language member and check that the story is now visible.
             */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/stories')
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.getByText('TestStoryTitleEdited').should('exist')
      cy.getByText('TestStoryTranslation').should('exist')
      cy.getByText('Continue to story').should('exist')
    })
    cy.logout()

    /*
                Login as admin and publish the story.
             */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/stories')
    cy.wait(500)
    cy.queryByText('TestStoryTitleEdited')
      .should('exist')
      .click()
    cy.wait(500)
    cy.getByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(1)
          .click()
      })
    })
    cy.wait(500)
    cy.getByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.getByText('Publish', { exact: true }).click()
    })
    cy.wait(1000)
    cy.reload()
    cy.wait(300)

    /*
        Check that the published story is visible.
     */
    cy.getByText('Public View').click()
    cy.wait(1500)
    cy.get('[id="pageNavigation"]').within(() => {
      cy.get('div.row.Navigation__dialectContainer')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(58, 104, 128)')
    })
    cy.getByText('TestStoryTitleEdited').should('exist')
    cy.getByText('TestStoryTranslation').should('exist')
    cy.getByText('TestStoryBookIntroduction').should('exist')
  })
})
