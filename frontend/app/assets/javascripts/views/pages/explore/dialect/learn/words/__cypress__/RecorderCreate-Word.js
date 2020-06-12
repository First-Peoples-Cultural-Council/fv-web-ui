// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderCreate-Word.js > RecorderCreate-Word', () => {
  it('Test to check recorder word creation functionality.', () => {
    cy.login({
      userName: 'TESTLANGUAGEFOUR_RECORDER',
    })

    /*
      Checking to make sure no word currently exists
      Database should be reset prior to test
    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/words')
    cy.wait(500)
    cy.findByText('No Results Found', { exact: false }).should('be.visible')

    /*
      Going through the steps to create a word
    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: false }).click()
    cy.wait(500)
    cy.findByText('Words', { exact: true }).click()
    cy.wait(1500)
    cy.findByText('Create New Word', { exact: true }).click()
    cy.wait(3000)
    cy.findByTestId('dc-title').type('TestWord')
    cy.findByTestId('fv-word-part_of_speech').select('Noun', { exact: true })
    cy.findByTestId('fv-word-pronunciation').type('TestPronunciation')
    cy.findByText('+ Add definition', { exact: true }).click()
    cy.findByTestId('fv-definitions0translation').type('TestTranslation')
    cy.findByText('+ Add literal translation', { exact: true }).click()
    cy.findByTestId('fv-literal_translation0translation').type('TestLiteralTranslation')

    /*
      Audio upload
    */
    cy.findByText('+ Add related audio', { exact: true }).click()
    cy.findByText('Upload audio', { exact: true }).click()
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestAudio')
      cy.get('[name="dc:description"]').type('TestAudioDescription')
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
    cy.findByText('+ Add related pictures', { exact: true }).click()
    cy.findByText('Upload picture', { exact: true }).click()
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestImage')
      cy.get('[name="dc:description"]').type('TestImageDescription')
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
    cy.findByText('+ Add related videos', { exact: true }).click()
    cy.findByText('Upload video', { exact: true }).click()
    cy.get('[id="AddMediaComponent"]').within(() => {
      cy.get('[name="dc:title"]').type('TestVideo')
      cy.get('[name="dc:description"]').type('TestVideoDescription')
      const fileName = 'TestRelatedVideo.mp4'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
      })
      cy.findByText('Upload Media', { exact: true }).click()
    })
    cy.wait(2000)
    cy.findByText('Insert into entry').click()

    /*
      Finishing the word creation form
    */
    cy.findByText('+ Add cultural note', { exact: true }).click()
    cy.findByTestId('fv-cultural_note0', { exact: true }).type('TestCulturalNote')
    cy.findByTestId('fv-reference', { exact: true }).type('TestReference')
    cy.findByTestId('fv-word-acknowledgement', { exact: true }).type('TestAcknowledgement')
    cy.findByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
      Checking to see if the word now exists
    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/words')
    cy.wait(3500)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestWord').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('Noun').should('exist')
      cy.findByText('New').should('exist')
    })
  })
})
