// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
const click = ($el) => $el.click()

describe('LangAdminViewEdit-Word.js > LangAdminViewEdit-Word', () => {
  it('Test to check language admin viewing and editing of words permissions.', () => {
    /* Log in and create a word as recorder
     */
    cy.login({
      userName: 'TESTLANGUAGETWO_RECORDER',
    })
    /*
        Going through the steps to create a word
      */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: false }).click()
    cy.wait(500)
    cy.findByText('Words', { exact: true }).click()
    cy.wait(1500)
    cy.findByText('Create New Word', { exact: true }).click()
    cy.wait(3000)
    cy.findByTestId('dc-title').type('TestWordForPermissions')
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
      cy.get('[name="dc:title"]').type('TestWordForPermissionsAudio')
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
      cy.get('[name="dc:title"]').type('TestWordForPermissionsImage')
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
      cy.get('[name="dc:title"]').type('TestWordForPermissionsVideo')
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
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(3500)
    cy.findByText('TestWordForPermissions')
      .parent()
      .parent()
      .within(() => {
        cy.findByText('TestTranslation').should('exist')
        cy.findByText('Noun').should('exist')
        cy.findByText('New').should('exist')
      })
    cy.logout()
    /*
            Login as Language Member and check that the word is not visible when not enabled.
        */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.findByText('Words', { exact: true }).click()
    cy.wait(500)
    cy.findByText('TestWordForPermissions').should('not.exist')
    cy.logout()
    /*
                Login as Language Admin, navigate to words and check that a word exists.
            */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.wait(500)
    cy.get('div.Header.row').within(() => {
      cy.findByText('Words', { exact: true }).click()
    })
    cy.wait(3500)
    cy.findByText('TestWordForPermissions')
      .parent()
      .parent()
      .within(() => {
        cy.findByText('New').should('exist')
        cy.findByText('TestTranslation').should('exist')
        cy.findByText('TestWordForPermissions').click()
      })

    /*
            Check for edit word button and then enable the word.
         */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(2500)
    cy.findByText('TestWordForPermissions').click()
    cy.wait(1500)
    cy.findByText('Edit', { exact: true }).should('exist')
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(0)
        .click()
    })
    cy.logout()

    /*
            Login as member and check that the word is now visible and enabled.
         */
    cy.login({
      userName: 'TESTLANGUAGETWO_MEMBER',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: true }).click()
    cy.get('div.Header.row').within(() => {
      cy.findByText('Words', { exact: true }).click()
    })
    cy.wait(3500)
    cy.findByText('TestWordForPermissions')
      .parent()
      .parent()
      .within(() => {
        cy.findByText('TestTranslation').should('exist')
        cy.findByText('Enabled').should('exist')
      })
    cy.logout()

    /*
            Login as Admin and publish the word.
        */
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/learn/words')
    cy.wait(2500)
    cy.findByText('TestWordForPermissions', { exact: true }).click()
    cy.wait(1500)
    cy.get('div.hidden-xs').within(() => {
      cy.get('input[type=checkbox]')
        .eq(1)
        .click()
    })
    cy.findByTestId('ViewWithActions__buttonPublish').within(() => {
      cy.findByText('Publish', { exact: true }).click()
    })
    cy.wait(1000)

    /*
      Check that the word is now visible to the public.
     */
    cy.findByText('Public View')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.wait(1500)
    cy.get('div.row.Navigation__dialectContainer')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(58, 104, 128)')
    cy.findByText('TestWordForPermissions').should('exist')
    cy.findByText('TestTranslation').should('exist')
    cy.findByText('TestCulturalNote').should('exist')
    cy.findByText('TestLiteralTranslation').should('exist')
    cy.findByText('TestPronunciation').should('exist')
    cy.findByText('TestWordForPermissionsImage').should('exist')
    cy.findByText('TestWordForPermissionsVideo').should('exist')
    cy.findByText('TestAcknowledgement').should('exist')
  })
})
