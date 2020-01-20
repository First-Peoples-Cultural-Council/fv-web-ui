
const waitMedium = 2000
const waitShort = 50
function clearWordForm() {
  const prefix = '[RESET]'

  // Clear input texts
  cy.getByTestId('pageContainer').within(() => {
    cy.logger({type: 'header', text: `${prefix} clear inputs`})
    cy.getByTestId('dc-title').clear()
    cy.getByTestId('fv-word-pronunciation').clear()
    cy.getByTestId('fv-reference').clear()
    cy.getByTestId('fv-word-acknowledgement').clear()

    // Remove a x's
    cy.logger({type: 'header', text: `${prefix} Batch click all .btn-remove`})
    cy.get('.btn-remove').each(($el, index, $list) => {
      const reversedIndex = $list.length - 1 - index
      cy.wrap($list[reversedIndex]).click()
    })
    cy.get('[data-testid=IconButton__remove]').each(($el, index, $list) => {
      const reversedIndex = $list.length - 1 - index
      cy.wrap($list[reversedIndex]).click()
    })
  })

  // UPDATE > Part of speech
  cy.logger({type: 'subheader', text: `${prefix} Part of Speech`})
  cy.getByTestId('fv-word-part_of_speech').select('true')
}
function populateWordForm({
  prefix,
  title,
  definition,
  literalTranslation,
  pronounciation,
}) {
  // [POPULATE] Word
  cy.logger({type: 'subheader', text: `${prefix} Title`})
  cy.getByTestId('dc-title')
    .clear()
    .type(title)

  // [POPULATE] Part of speech
  cy.logger({type: 'subheader', text: `${prefix} Part of Speech`})
  cy.getByTestId('fv-word-part_of_speech').select('question_word')

  // [POPULATE] Pronunciation
  cy.logger({type: 'subheader', text: `${prefix} Pronounciation`})
  cy.getByTestId('fv-word-pronunciation')
    .clear()
    .type(pronounciation)

  // [POPULATE] Definition
  cy.logger({type: 'subheader', text: `${prefix} Definition`})
  cy.getByText('+ Add definition', { exact: false }).click()
  cy.getByTestId('fv-definitions0translation').type(definition)
  cy.getByText('+ Add definition', { exact: false }).click()
  cy.getByTestId('fv-definitions1translation').type(definition)

  // [POPULATE] Literal Translation
  cy.logger({type: 'subheader', text: `${prefix} Literal Translation`})
  cy.getByText('+ Add literal translation', { exact: false }).click()
  cy.getByTestId('fv-literal_translation0translation').type(literalTranslation)

  // [POPULATE] Audio
  cy.logger({type: 'subheader', text: `${prefix} Audio`})
  cy.getByText('+ Add related audio', { exact: false })
    .parents('button')
    .click()

  cy.getByText('upload audio', { exact: false }).click()
  cy.wait(waitShort)

  cy.getByTestId('AddMediaComponent')
    .parent()
    .parent()
    .parent()
    .within(() => {
      cy.getByLabelText('name', { exact: false }).type(`${prefix} AUDIO > NAME`)
      cy.getByLabelText('description', { exact: false }).type(`${prefix} AUDIO > DESCRIPTION`)
      cy.getByLabelText('Shared accross dialects', { exact: false }).check()
      cy.getByLabelText('Child focused', { exact: false }).check()

      const fileName = 'TestRelatedAudio.wav'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()


  // [POPULATE] picture
  cy.logger({type: 'subheader', text: `${prefix} Picture`})
  cy.getByText('+ Add related pictures', { exact: false })
    .parents('button')
    .click()

  cy.getByText('upload picture', { exact: false }).click()

  cy.getByTestId('AddMediaComponent')
    .parent()
    .parent()
    .parent()
    .within(() => {
      cy.getByLabelText('name', { exact: false }).type(`${prefix} PICTURE > NAME`)
      cy.getByLabelText('description', { exact: false }).type(`${prefix} PICTURE > DESCRIPTION`)
      cy.getByLabelText('Shared accross dialects', { exact: false }).check()
      cy.getByLabelText('Child focused', { exact: false }).check()
      const fileName = 'TestRelatedImage.png'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] video
  cy.logger({type: 'subheader', text: `${prefix} Video`})
  cy.getByText('+ Add related videos', { exact: false })
    .parents('button')
    .click()

  cy.getByText('upload video', { exact: false }).click()

  cy.getByTestId('AddMediaComponent')
    .parent()
    .parent()
    .parent()
    .within(() => {
      cy.getByLabelText('name', { exact: false }).type(`${prefix} VIDEO > NAME`)
      cy.getByLabelText('description', { exact: false }).type(`${prefix} VIDEO > DESCRIPTION`)
      cy.getByLabelText('Shared accross dialects', { exact: false }).check()
      cy.getByLabelText('Child focused', { exact: false }).check()
      const fileName = 'TestRelatedVideo.mp4'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] phrases
  cy.logger({type: 'subheader', text: `${prefix} Phrases`})
  cy.getByText('+ Add related phrases', { exact: false }).click()

  cy.getByText('create new phrase', { exact: false }).click()

  cy.getByTestId('PhrasesCreate__form').within(() => {
    cy.getByLabelText('phrase', { exact: false }).type(`${prefix} PHRASE`)
    cy.getByText('save', { exact: false }).click()
  })

  // [POPULATE] Cultural Note
  cy.logger({type: 'subheader', text: `${prefix} Cultural Note`})
  cy.getByText('Cultural note', { exact: false })
    .parent('fieldset')
    .within(() => {
      cy.getByText('+ Add cultural note', { exact: false }).click()
      cy.logger({type: 'subheader', text: 'Create 2 cultural notes'})
      cy.getByTestId('fv-cultural_note0').type(`${prefix} cultural note 0`)
      cy.getByText('+ Add cultural note', { exact: false }).click()
      cy.logger({type: 'subheader', text: 'Change order'})
      cy.getByTestId('fv-cultural_note1').type(`${prefix} cultural note 1`)
      cy.getByTestId('fv-cultural_note1')
        .parent()
        .parent()
        .parent()
        .parent()
        .within(() => {
          cy.getByText('▲').click()
        })
    })
  cy.logger({type: 'subheader', text: 'Confirm order'})
  cy.getByText('Cultural note', { exact: false })
    .parent('fieldset')
    .within(() => {
      cy.get('input.form-control[type=text]:first')
        .invoke('val')
        .should('be.eq', `${prefix} cultural note 1`)
    })

  // [POPULATE] Reference
  cy.logger({type: 'subheader', text: `${prefix} Reference`})
  cy.get('input[label="Reference"].form-control').type(`${prefix} Reference`)

  // [POPULATE] Source
  cy.logger({type: 'subheader', text: `${prefix} Source`})
  cy.getByText('Source', { exact: false })
    .parent('fieldset')
    .within(() => {
      cy.getByText('+ Add source', { exact: false }).click()
      cy.getByText('create new contributor', { exact: false }).click()
    })
  cy.getByTestId('DialogCreateForm__DialogContent').within(() => {
    cy.getByLabelText('Contributor name', { exact: false }).type(`${prefix} New Contributor > Contributor Name`)
    cy.getByText('save', { exact: false }).click()
  })
}

describe('word_crud.js > PageDialectWordsCreate', () => {
  it('CRUD', () => {
    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    const prefix = '[CREATE]'
    const title = `${prefix} Word`
    const definition = `${prefix} Definition`
    const literalTranslation = `${prefix} Literal Translation`
    const pronounciation = `${prefix} Pronounciation`

    const updatePrefix = '[UPDATE]'
    const updateTitle = '[UPDATE] Word'
    const updateDefinition = '[UPDATE] Definition'
    const updateLiteralTranslation = '[UPDATE] Literal Translation'
    const updatePronounciation = '[UPDATE] Pronounciation'

    // Login
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/words')
    cy.wait(waitMedium)

    // CREATE
    cy.logger({text: 'Create'})
    cy.getByText('Create New Word', { exact: false }).click()
    populateWordForm({
      prefix,
      title,
      definition,
      literalTranslation,
      pronounciation,
    })
    // CREATE children's archive
    cy.logger({type: 'subheader', text: `${prefix} Childrens\'s archive`})
    cy.getByLabelText("Available in children's archive", { exact: false }).check()
    // CREATE games
    cy.logger({type: 'subheader', text: `${prefix} Available in games`})
    cy.getByLabelText('Available in games', { exact: false }).check()

    cy.logger({type: 'subheader', text: `${prefix} Save`})
    cy.getByTestId('PageDialectWordsCreate__form').within(() => {
      cy.getByText('save', { exact: false }).click()
    })
    cy.wait(waitMedium)

    // Read
    cy.logger({text: 'READ'})
    cy.getByText(title).should('exist')
    cy.getByText(definition).should('exist')
    cy.getByText(literalTranslation).should('exist')
    cy.getByText(pronounciation).should('exist')

    // Update
    cy.logger({text: 'UPDATE'})
    cy.getByText('Edit word', { exact: false }).click()
    cy.wait(waitMedium)
    clearWordForm()
    populateWordForm({
      prefix: updatePrefix,
      title: updateTitle,
      definition: updateDefinition,
      literalTranslation: updateLiteralTranslation,
      pronounciation: updatePronounciation,
    })

    // UPDATE: save
    cy.logger({type: 'subheader', text: `${prefix} Save`})
    cy.getByTestId('withForm__btnGroup2').within(() => {
      cy.getByText('save', { exact: false }).click()
    })

    cy.wait(waitMedium)

    // UPDATE: verify
    cy.logger({type: 'subheader', text: `${prefix} VERIFY`})
    cy.getByText(updateTitle).should('exist')
    cy.getByText(updateDefinition).should('exist')
    cy.getByText(updateLiteralTranslation).should('exist')
    cy.getByText(updatePronounciation).should('exist')

    // DELETE
    cy.logger({text: 'DELETE'})

    cy.getByText('delete word', { exact: false }).click()

    // TODO: need more reliable hook
    cy.getByTestId('ViewWithActions__dialog').within(() => {
      cy.getByText('Delete').click()
    })
    cy.wait(waitShort)
    cy.getByText('Delete word success', { exact: false }).should('exist')

    // NOTE: reload can still access page (or with saved url)
    // cy.reload()
  })
})
