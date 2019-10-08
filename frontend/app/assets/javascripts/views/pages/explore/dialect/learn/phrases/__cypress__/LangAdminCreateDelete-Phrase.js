// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('LangAdminCreateDelete-Phrase.js > LangAdminCreateDelete-Phrase', () => {
  it('Test to check that a language admin can create and delete phrases.', () => {
    // TODO: Add database setup here.
    // Requires no phrases exist in database for SENCOTEN

    /*
                Login as Language Admin and check that no phrases currently exists.
            */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/phrases')
    cy.getByText('No results found.', { exact: true }).should('be.visible')

    /*
                Going through the steps to create a phrase
            */
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.getByText('Learn our Language', { exact: false }).click()
    cy.get('div.Header.row').within(() => {
      cy.getByText('Phrases', { exact: true }).click()
    })
    cy.wait(500)
    cy.getByText('Create New Phrase', { exact: false }).click()

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
                Checking to see if the phrase now exists.
            */
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten/learn/phrases')
    cy.getByTestId('DictionaryList__row').within(() => {
      cy.getByText('TestPhrase').should('exist')
      cy.getByText('TestTranslation').should('exist')
      cy.getByText('New').should('exist')
    })

    /*
                Check that edit phrase button is visible and functional.
                Check that the cancel button when editing phrase works.
            */
    cy.wait(500)
    cy.getByText('TestPhrase').click()
    cy.getByText('Edit phrase')
      .should('exist')
      .click()
    cy.get('div.form-horizontal').within(() => {
      cy.getByText('Phrase', { exact: true }).should('exist')
      cy.getByText('Definitions', { exact: true }).should('exist')
      cy.getByText('Phrase books', { exact: true }).should('exist')
    })
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Cancel').click()
    })

    /*
                Check that edit phrase saves properly.
            */
    cy.getByText('Edit phrase')
      .should('exist')
      .click()
    cy.get('[name="dc:title"]').type('TestPhrase1')
    cy.wait(500)
    cy.getByTestId('withForm__btnGroup1').within(() => {
      cy.getByText('Save').click()
    })
    cy.getByText('TestPhraseTestPhrase1', { exact: true }).should('exist')

    /*
                Delete the phrase and check that it no longer exists.
            */
    cy.getByText('Delete phrase').click()
    cy.getByTestId('ViewWithActions__buttonDelete').click()
    cy.getByText('Delete phrase success').should('exist')

    // Possible bug with first voices here requiring button to be clicked 3 times.
    cy.getByText('Return To Previous Page').click()
    cy.getByText('Return To Previous Page').click()
    cy.getByText('Return To Previous Page').click()

    cy.getByText('No results found.', { exact: true }).should('be.visible')
  })
})
