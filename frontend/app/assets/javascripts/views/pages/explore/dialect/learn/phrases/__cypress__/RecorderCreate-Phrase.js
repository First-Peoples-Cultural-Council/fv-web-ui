// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('RecorderCreate-Phrase.js > RecorderCreate-Phrase', () => {
  it('Test to check a recorder creating a phrase.', () => {
    // TODO: Add database setup here.
    // Requires no phrases exist in database for SENCOTEN.

    /*
                Login as Recorder, go to phrase creation page and click create new phrase
            */
    cy.login({
      userName: 'SENCOTEN_RECORDER_USERNAME',
      userPassword: 'SENCOTEN_RECORDER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.getByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.getByText('Create New Phrase', { exact: true }).click()

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
    cy.get('[name="fv:cultural_note[0]"]', { exact: true }).type('TestCulturalNote')
    cy.get('[name="fv:reference"]', { exact: true }).type('TestReference')
    cy.get('[name="fv-phrase:acknowledgement"]', { exact: true }).type('TestAcknowledgement')
    cy.getByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
            Check that the phrase now exists
         */
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/phrases')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('New').should('exist')
    })

    /*
            Logout
         */
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Check that the phrase is not visible for Site Member when not enabled
         */
    cy.login({
      userName: 'SITE_MEMBER_USERNAME',
      userPassword: 'SITE_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/phrases')
    cy.queryByText('TestPhrase').should('not.exist')
    cy.getByText('No results found.').should('exist')

    /*
            Logout
         */
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Login as admin and enable the phrase
         */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/phrases')
    cy.wait(800)
    cy.getByText('TestPhrase', { exact: false }).click()
    cy.get('div.hidden-xs.clearfix').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.getByTestId('Navigation__open').click()
    cy.getByText('Sign Out').click()

    /*
            Check that the phrase is now visible for Site User when enabled
         */
    cy.login({
      userName: 'SITE_MEMBER_USERNAME',
      userPassword: 'SITE_MEMBER_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/phrases')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Enabled').should('exist')
    })
    cy.queryByText('No results found.').should('not.exist')

    // TODO: Test that phrase is visible to public once published.  FW-569 needs looking at first.
  })
})
