// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderCreate-Phrase.js > RecorderCreate-Phrase', () => {
  it('Test to check a recorder creating a phrase.', () => {
    /*
                Login as Recorder, go to phrase creation page and click create new phrase
            */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_RECORDER',
    })
    cy.route('POST', '/nuxeo/api/v1/automation/Workflow*').as('workflowXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour')
    cy.wait('@workflowXHR')

    cy.route('POST', '/nuxeo/api/v1/automation/Workflow*').as('workflowXHR')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.wait('@workflowXHR')

    cy.route('POST', '/nuxeo/api/v1/automation/*').as('automationXHR')
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.wait(['@automationXHR', '@automationXHR'])

    cy.route('GET', '/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageFour').as('pathXHR')
    cy.getByText('Create New Phrase', { exact: true }).click()
    cy.wait('@pathXHR')

    /*
            Enter data to create a new phrase
         */
    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('TestPhrase')
      cy.getByText('+ Add definition', { exact: true }).click()
      cy.get('[name="fv:definitions[0][translation]"]').type('TestTranslation')
    })

    /*
            Audio upload
        */
    cy.getByText('+ Add related audio', { exact: true }).click()
    cy.getByText('Upload audio', { exact: true }).click()
    cy.route('/nuxeo/api/v1/')
    cy.route('POST', '/nuxeo/api/v1/upload/**').as('mediaUploadXHR')
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
            Finishing the phrase creation form and save
        */
    cy.getByText('+ Add cultural note', { exact: true }).click()
    cy.getByTestId('fv-cultural_note0', { exact: true }).type('TestCulturalNote')
    cy.get('[name="fv:reference"]', { exact: true }).type('TestReference')
    cy.get('[name="fv-phrase:acknowledgement"]', { exact: true }).type('TestAcknowledgement')
    cy.getByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
            Check that the phrase now exists
         */
    cy.route('POST', '/nuxeo/api/v1/automation/Document.EnrichedQuery').as('enrichedQueryXHR')
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageFour').as('pathTwoXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(['@enrichedQueryXHR', '@enrichedQueryXHR', '@enrichedQueryXHR'])
    cy.wait('@pathTwoXHR')
    cy.wait(500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('New').should('exist')
    })
    /*
            Logout
         */
    cy.logout()

    /*
            Check that the phrase is not visible for Site Member when not enabled
         */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_MEMBER',
    })
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageFour').as('pathThreeXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait('@pathThreeXHR')
    cy.queryByText('TestPhrase').should('not.exist')
    cy.getByText('No results found.').should('exist')

    /*
            Logout
         */
    cy.logout()

    /*
            Login as admin and enable the phrase
         */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_ADMIN',
    })
    cy.route('POST', '/nuxeo/api/v1/automation/Document.EnrichedQuery').as('enrichedQueryXHRTwo')
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageFour').as('pathFourXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(['@enrichedQueryXHRTwo', '@enrichedQueryXHRTwo', '@enrichedQueryXHRTwo'])
    cy.wait('@pathFourXHR')

    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageFour').as('pathFiveXHR')
    cy.wait(1000)
    cy.getByText('TestPhrase', { exact: false }).click()
    cy.wait('@pathFiveXHR')
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.logout()

    /*
              Login as language member and check that the story is now visible.
           */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_MEMBER',
    })
    cy.route('POST', '/nuxeo/api/v1/automation/*').as('phrasesOneXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(['@phrasesOneXHR', '@phrasesOneXHR', '@phrasesOneXHR', '@phrasesOneXHR'])
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.queryByText('No results found.').should('not.exist')
    cy.logout()

    /*
                Login as admin and publish the phrase.
             */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_ADMIN',
    })
    cy.route('POST', '/nuxeo/api/v1/automation/Document.EnrichedQuery').as('phrasesThreeXHR')
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(['@phrasesThreeXHR', '@phrasesThreeXHR', '@phrasesThreeXHR'])
    cy.route('/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageFour').as('pathSixXHR')
    cy.queryByText('TestPhrase')
      .should('exist')
      .click()
    cy.wait('@pathSixXHR')
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
    cy.reload()
    cy.wait('@pathSixXHR')

    /*
        Check that the published phrase is visible.
     */
    cy.route('/nuxeo/api/v1/path/FV/sections/Data/Test/Test/TestLanguageFour').as('pathSevenXHR')
    cy.getByText('Public View').click()
    cy.wait('@pathSevenXHR')
    cy.get('[id="pageNavigation"]').within(() => {
      cy.get('div.row.Navigation__dialectContainer')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(58, 104, 128)')
    })
    cy.queryByText('TestPhrase').should('exist')
    cy.queryByText('TestTranslation').should('exist')
    cy.queryByText('TestCulturalNote').should('exist')
    cy.queryByText('TestImage').should('exist')
    cy.queryByText('TestVideo')
      .scrollIntoView()
      .should('exist')
    cy.queryByText('TestAcknowledgement').should('exist')
  })
})
