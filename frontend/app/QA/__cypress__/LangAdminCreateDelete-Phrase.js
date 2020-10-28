// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
const click = ($el) => $el.click()

describe('LangAdminCreateDelete-Phrase.js > LangAdminCreateDelete-Phrase', () => {
  it('Test to check that a language admin can create and delete phrases.', () => {
    /*
                Login as Language Admin and check that no phrases currently exists.
            */
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/phrases')
    cy.wait(1000)
    cy.findByText('No Results Found', { exact: false }).should('be.visible')

    /*
                Going through the steps to create a phrase
            */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne')
    cy.wait(500)
    cy.findByText('Learn our Language', { exact: false }).click()
    cy.get('div.Header.row').within(() => {
      cy.findByText('Phrases', { exact: true }).click()
    })
    cy.wait(1500)
    cy.findByText('Create New Phrase', { exact: false }).click()
    cy.wait(3000)

    /*
            Enter data to create a new phrase
         */
    cy.get('fieldset.fieldset').within(() => {
      cy.get('[name="dc:title"]').type('TestPhrase')
      cy.findByText('+ Add definition', { exact: true }).click()
      cy.get('[name="fv:definitions[0][translation]"]').type('TestTranslation')
    })

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
                Finishing the phrase creation form and save
            */
    cy.findByText('+ Add cultural note', { exact: true }).click()
    cy.findByTestId('fv-cultural_note0', { exact: true }).type('TestCulturalNote')
    cy.get('[name="fv:reference"]', { exact: true }).type('TestReference')
    cy.get('[name="fv-phrase:acknowledgement"]', { exact: true }).type('TestAcknowledgement')
    cy.findByText('Save', { exact: true }).click()
    cy.wait(500)

    /*
                Checking to see if the phrase now exists.
            */
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/phrases')
    cy.wait(3000)
    cy.findByTestId('DictionaryList__row').within(() => {
      cy.findByText('TestPhrase').should('exist')
      cy.findByText('TestTranslation').should('exist')
      cy.findByText('New').should('exist')
    })

    /*
                Check that edit phrase button is visible and functional.
                Check that the cancel button when editing phrase works.
            */
    cy.wait(500)
    cy.findByText('TestPhrase').click()
    cy.findByText('Edit')
      .should('exist')
      .click()
    cy.get('div.form-horizontal').within(() => {
      cy.findByText('Phrase', { exact: true }).should('exist')
      cy.findByText('Definitions', { exact: true }).should('exist')
      cy.findByText('Phrase books', { exact: true }).should('exist')
    })
    cy.get('[name="dc:title"]').type('ShouldNotShow')
    cy.wait(500)
    cy.findByTestId('withForm__btnGroup1').within(() => {
      cy.findByText('Cancel').click()
    })
    cy.findByText('Yes').click()
    cy.findByText('TestPhraseShouldNotShow').should('not.exist')

    /*
                Check that edit phrase saves properly.
            */
    cy.findByText('Edit')
      .should('exist')
      .click()
    cy.get('[name="dc:title"]').type('TestPhrase1')
    cy.wait(500)
    cy.findByTestId('withForm__btnGroup1').within(() => {
      cy.findByText('Save').click()
    })
    cy.findByText('TestPhraseTestPhrase1', { exact: true }).should('exist')

    /*
                Delete the phrase and check that it no longer exists.
            */
    cy.findByText('Delete phrase').click()
    cy.wait(300)
    cy.findByTestId('ViewWithActions__dialog').within(() => {
      cy.findByTestId('ViewWithActions__buttonDelete').click()
    })
    cy.wait(500)
    cy.findByText('Delete phrase success').should('exist')

    // https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
    cy.findByText('Return To Previous Page')
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.be.visible
      })
    cy.findByText('No Results Found', { exact: false }).should('be.visible')
  })
})
