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
    cy.getByText('No results found.', { exact: true }).should('be.visible')

    /*
      Going through the steps to create a word
    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: false }).click()
    cy.wait(500)
    cy.getByText('Words', { exact: true }).click()
    cy.wait(1500)
    cy.getByText('Create New Word', { exact: true }).click()
    cy.wait(3000)
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
      Finishing the word creation form
    */
    cy.getByText('+ Add cultural note', { exact: true }).click()
    cy.getByTestId('fv-cultural_note0', { exact: true }).type('TestCulturalNote')
    cy.getByTestId('fv-reference', { exact: true }).type('TestReference')
    cy.getByTestId('fv-word-acknowledgement', { exact: true }).type('TestAcknowledgement')
    cy.getByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
      Checking to see if the word now exists
    */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageFour/learn/words')
    cy.wait(3500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('New').should('exist')
    })
  })
})
