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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.wait(1500)
    cy.getByText('Create New Phrase', { exact: true }).click()
    cy.wait(3000)

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
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestAudio')
      cy.get('[name="dc:description"]').type('TestAudioDescription')
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
    cy.wait(2000)
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
    cy.wait(2000)
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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(3500)
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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(3500)
    cy.queryByText('TestPhrase').should('not.exist')
    cy.getByText('No results found.', { exact: false }).should('exist')

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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(3500)
    cy.getByText('TestPhrase', { exact: false }).click()
    cy.wait(2000)
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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(3500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.queryByText('No results found.', { exact: false }).should('not.exist')
    cy.logout()

    /*
                Login as admin and publish the phrase.
             */
    cy.login({
      userName: 'TESTLANGUAGEFOUR_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/phrases')
    cy.wait(3500)
    cy.queryByText('TestPhrase')
      .should('exist')
      .click()
    cy.wait(2000)
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
    cy.wait(1000)

    /*
        Check that the published phrase is visible.
     */
    cy.getByText('Public View').click()
    cy.wait(3000)
    cy.get('[id="pageNavigation"]').within(() => {
      cy.get('div.row.Navigation__dialectContainer')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(58, 104, 128)')
    })
    cy.getByText('TestPhrase').should('exist')
    cy.getByText('TestTranslation').should('exist')
    cy.getByText('TestCulturalNote').should('exist')
    cy.getByText('TestImage').should('exist')
    cy.getByText('TestVideo')
      .scrollIntoView()
      .should('exist')
    cy.getByText('TestAcknowledgement').should('exist')
  })
})
