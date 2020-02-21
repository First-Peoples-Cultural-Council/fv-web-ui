// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
const click = ($el) => $el.click()

describe('RecApprovalCreateDelete-Word.js > RecApprovalCreateDelete-Word', () => {
  it('Test to check recorder with approval creation and deletion of words.', () => {
    /*
                Login as Recorder with approval and check that no word currently exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETHREE_RECORDER_APPROVER',
    })
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageThree').as('pathXHR')
    cy.route('POST', '/nuxeo/api/v1/automation/Document.EnrichedQuery').as('enrichedQueryXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/words')
    cy.wait('@pathXHR')
    cy.wait(['@enrichedQueryXHR', '@enrichedQueryXHR', '@enrichedQueryXHR'])
    cy.queryByText('No results found.', { exact: true }).should('be.visible')

    /*
                Going through the steps to create a word
            */
    cy.route('POST', '/nuxeo/api/v1/automation/Workflow.GetOpenTasks').as('openTasksXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree')
    cy.wait('@pathXHR')
    cy.wait('@openTasksXHR')

    cy.getByText('Learn our Language', { exact: false }).click()
    cy.wait(['@pathXHR', '@pathXHR'])
    cy.wait('@openTasksXHR')

    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechXHR')
    cy.getByText('Words', { exact: true }).click()
    cy.wait(['@enrichedQueryXHR', '@enrichedQueryXHR', '@partsOfSpeechXHR'])
    cy.getByText('Create New Word')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.wait('@partsOfSpeechXHR')

    cy.getByTestId('dc-title').type('TestWord')
    cy.getByTestId('fv-word-part_of_speech').select('Noun', { exact: true })
    cy.getByTestId('fv-word-pronunciation').type('TestPronunciation')
    cy.getByText('+ Add definition', { exact: true }).click()
    cy.getByTestId('fv-definitions0translation').type('TestTranslation')
    cy.getByText('+ Add literal translation', { exact: true }).click()
    cy.getByTestId('fv-literal_translation0translation').type('TestLiteralTranslation')

    /*
              Audio upload
            */
    cy.route('POST', '/nuxeo/api/v1/upload/**').as('mediaUploadXHR')
    cy.getByText('+ Add related audio', { exact: true }).click()
    cy.getByText('Upload audio', { exact: true }).click()
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestAudio')
      cy.get('[name="dc:description"]').type('TestAudioDescription')
      const fileName = 'TestRelatedAudio.wav'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
    cy.wait(['@mediaUploadXHR', '@mediaUploadXHR', '@mediaUploadXHR'])
    cy.getByText('Insert into entry').click()

    /*
              Image upload
            */
    cy.getByText('+ Add related pictures', { exact: true }).click()
    cy.getByText('Upload picture', { exact: true }).click()
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestImage')
      cy.get('[name="dc:description"]').type('TestImageDescription')
      const fileName = 'TestRelatedImage.png'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
    cy.wait(['@mediaUploadXHR', '@mediaUploadXHR', '@mediaUploadXHR'])
    cy.getByText('Insert into entry').click()

    /*
              Video upload
            */
    cy.getByText('+ Add related videos', { exact: true }).click()
    cy.getByText('Upload video', { exact: true }).click()
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestVideo')
      cy.get('[name="dc:description"]').type('TestVideoDescription')
      const fileName = 'TestRelatedVideo.mp4'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
    cy.wait(['@mediaUploadXHR', '@mediaUploadXHR', '@mediaUploadXHR'])
    cy.getByText('Insert into entry').click()

    /*
              Finishing the word creation form
            */
    cy.getByText('+ Add cultural note', { exact: true }).click()
    cy.getByTestId('fv-cultural_note0', { exact: true }).type('TestCulturalNote')
    cy.getByTestId('fv-reference', { exact: true }).type('TestReference')
    cy.getByTestId('fv-word-acknowledgement', { exact: true }).type('TestAcknowledgement')
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageThree').as('pathTwoXHR')
    cy.getByText('Save', { exact: true }).click()
    cy.wait('@pathTwoXHR')

    /*
                Checking to see if the word now exists.
            */
    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechTwoXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/words')
    cy.wait(['@enrichedQueryXHR', '@enrichedQueryXHR', '@enrichedQueryXHR', '@partsOfSpeechTwoXHR'])
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.queryByText('TestWord').should('exist')
      cy.queryByText('TestTranslation').should('exist')
      cy.queryByText('Noun').should('exist')
      cy.queryByText('New').should('exist')
    })

    /*
            Make sure that the enabled toggle is available and click it.
            Make sure that the published toggle becomes available and click it.
        */
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageThree').as('pathThreeXHR')
    cy.getByText('TestWord').click()
    cy.wait('@pathThreeXHR')

    cy.route('POST', '/nuxeo/api/v1/automation/Workflow.GetOpenTasks').as('getOpenTasksTwoXHR')
    cy.getByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(0)
          .click()
      })
    })
    cy.wait('@getOpenTasksTwoXHR')
    cy.getByTestId('pageContainer').within(() => {
      cy.get('div.hidden-xs').within(() => {
        cy.get('input[type=checkbox]')
          .eq(1)
          .click()
      })
    })
    cy.getByTestId('ViewWithActions__buttonPublish').click()
    cy.wait('@getOpenTasksTwoXHR')

    /*
                Check that edit word button is visible and functional.
                Check that the cancel button when editing word works.
            */
    cy.route('/nuxeo/api/v1/directory/parts_of_speech').as('partsOfSpeechThreeXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageThree/learn/words')
    cy.wait(['@partsOfSpeechThreeXHR'])
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageThree').as('pathFourXHR')
    cy.getByText('TestWord').click()
    cy.wait('@pathFourXHR')

    cy.route('/nuxeo/api/v1/id/**').as('formXHR')
    cy.getByText('Edit word')
      .should('exist')
      .click()
    cy.wait(['@formXHR', '@formXHR', '@formXHR', '@formXHR'])
    cy.get('div.form-horizontal').within(() => {
      cy.getByText('Word', { exact: true }).should('exist')
      cy.getByText('Part of speech', { exact: true }).should('exist')
      cy.getByText('Pronunciation', { exact: true }).should('exist')
    })
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Cancel').click()
    })
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageThree').as('pathFiveXHR')
    cy.getByText('Yes!').click()
    cy.wait('@pathFiveXHR')

    /*
                Check that edit word saves properly.
            */
    cy.route('/nuxeo/api/v1/id/**').as('formTwoXHR')
    cy.queryByText('TestWord').click()
    cy.getByText('Edit word')
      .should('exist')
      .click()
    cy.wait(['@formTwoXHR', '@formTwoXHR', '@formTwoXHR', '@formTwoXHR'])
    cy.get('#virtual-keyboard-helper-dc-title').type('TestWord1')

    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Save').click()
    })
    cy.wait(['@formTwoXHR', '@formTwoXHR', '@formTwoXHR', '@formTwoXHR', '@pathFiveXHR'])

    cy.queryByText('TestWordTestWord1', { exact: true }).should('exist')

    /*
            Test fonts.
         */
    cy.get('div.PromiseWrapper').should('have.css', 'font-family', 'Arial, sans-serif')

    /*
                Delete the word and check that it no longer exists.
            */
    cy.route('POST', '/nuxeo/api/v1/automation/Document.Trash').as('deleteXHR')
    cy.getByText('Delete word').click()
    cy.getByTestId('ViewWithActions__dialog').within(() => {
      cy.getByTestId('ViewWithActions__buttonDelete').click()
    })
    cy.wait('@deleteXHR')

    cy.getByText('Delete word success').should('exist')
    // https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
    cy.route('POST', '/nuxeo/api/v1/automation/Document.EnrichedQuery').as('enrichedQueryTwoXHR')
    cy.getByText('Return To Previous Page')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.wait('@enrichedQueryTwoXHR')
    cy.getByText('No results found.', { exact: true }).should('be.visible')
  })
})
