// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
const click = ($el) => $el.click()

describe('LangAdminCreateDelete-Word.js > LangAdminCreateDelete-Word', () => {
  it('Test to check language admin creation and deletion of words.', () => {
    /*
            Login as Language Admin and check that no word currently exists.
        */
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/words')
    cy.wait(1000)
    cy.getByText('No Results Found', { exact: false }).should('be.visible')

    /*
            Going through the steps to create a word
        */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne')
    cy.wait(500)
    cy.getByText('Learn our Language', { exact: false }).click()
    cy.wait(1000)
    cy.getByText('Words', { exact: true }).click()
    cy.wait(1000)
    cy.getByText('Create New Word', { exact: false }).click()
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
            Checking to see if the word now exists.
        */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/words')
    cy.wait(3500)
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestWord').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('Noun').should('exist')
      cy.getByText('New').should('exist')
    })

    /*
            Check that edit word button is visible and functional.
            Check that the cancel button when editing word works.
        */
    cy.wait(500)
    cy.getByText('TestWord').click()
    cy.getByText('Edit')
      .should('exist')
      .click()
    cy.get('div.form-horizontal').within(() => {
      cy.getByText('Word', { exact: true }).should('exist')
      cy.getByText('Part of speech', { exact: true }).should('exist')
      cy.getByText('Pronunciation', { exact: true }).should('exist')
    })
    cy.getByTestId('dc-title').type('ShouldNotShow')
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Cancel').click()
    })
    cy.getByText('Yes').click()
    cy.queryByText('TestWordShouldNotShow').should('not.exist')

    /*
            Check that edit word saves properly.
        */
    cy.getByText('TestWord').click()
    cy.getByText('Edit')
      .should('exist')
      .click()
    cy.getByTestId('dc-title').type('TestWord1')
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Save').click()
    })
    cy.getByText('TestWordTestWord1', { exact: true }).should('exist')

    /*
            Delete the word and check that it no longer exists.
        */
    cy.getByText('Delete word').click()
    cy.getByTestId('ViewWithActions__dialog').within(() => {
      cy.getByTestId('ViewWithActions__buttonDelete').click()
    })
    cy.wait(500)
    cy.getByText('Delete word success').should('exist')

    // https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
    cy.getByText('Return To Previous Page')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.getByText('No Results Found', { exact: false }).should('be.visible')
  })
})
