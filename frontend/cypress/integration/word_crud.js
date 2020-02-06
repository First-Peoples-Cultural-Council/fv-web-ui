
const waitMedium = 2000
const waitShort = 50

// ===============================================
// clearWordForm
// ===============================================
function clearWordForm() {
  cy.logger({type: 'subheader', text: 'clearWordForm'})
  cy.getByTestId('pageContainer').within(() => {
    // Clear input texts
    cy.getByTestId('dc-title').clear()
    cy.getByTestId('fv-word-pronunciation').clear()
    cy.getByTestId('fv-reference').clear()
    cy.getByTestId('fv-word-acknowledgement').clear()

    // Remove x's
    cy.formClickAllXs()
  })
  // reset select
  cy.getByTestId('fv-word-part_of_speech').select('true')
}

// ===============================================
// populateWordForm
// ===============================================
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
  cy.formPopulateDefinitions({definition})

  // [POPULATE] Literal Translation
  cy.logger({type: 'subheader', text: `${prefix} Literal Translation`})
  cy.getByText('+ Add literal translation', { exact: false }).click()
  cy.getByTestId('fv-literal_translation0translation').type(literalTranslation)

  // [POPULATE] Audio
  cy.logger({type: 'subheader', text: `${prefix} Audio`})
  cy.formPopulateRelatedAudio({
    name: `${prefix} AUDIO > NAME`,
    description: `${prefix} AUDIO > DESCRIPTION`,
  })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()


  // [POPULATE] picture
  cy.logger({type: 'subheader', text: `${prefix} Picture`})
  cy.formPopulateRelatedPictures({
    name: `${prefix} Related pictures > Name`,
    description: `${prefix} Related pictures > Description`,
  })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] video
  cy.logger({type: 'subheader', text: `${prefix} Video`})
  cy.formPopulateRelatedVideos({
    name: `${prefix} Related videos > Name`,
    description: `${prefix} Related videos > Description`,
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
  cy.formPopulateCulturalNotes({prefix})

  // [POPULATE] Reference
  cy.logger({type: 'subheader', text: `${prefix} Reference`})
  cy.get('input[label="Reference"].form-control').type(`${prefix} Reference`)

  // [POPULATE] Source
  cy.logger({type: 'subheader', text: `${prefix} Source`})
  cy.formPopulateSource({name: `${prefix} New Contributor > Contributor Name`})
}


// ===============================================
// populateWordFormBrowse
// ===============================================
function populateWordFormBrowse({
  browseTitleAudio,
  browseDescriptionAudio,
  browseTitlePicture,
  browseTitleVideo,
  browseTitleSource,
  timestamp,
}) {
  // BROWSE CREATING
  // ------------------------------------------
  cy.formPopulateRelatedAudio({
    name: browseTitleAudio,
    description: browseDescriptionAudio,
  })
  cy.getByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateRelatedPictures({
    name: browseTitlePicture,
    description: `${timestamp} Related pictures > Description`,
  })
  cy.getByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateRelatedVideos({
    name: browseTitleVideo,
    description: `${timestamp} Related videos > Description`,
  })
  cy.getByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateSource({name: browseTitleSource})

  // BROWSE CLEARING
  // ------------------------------------------
  cy.logger({type: 'subheader', text: 'CREATE > BROWSE: clearing form'})
  clearWordForm()

  // BROWSE SELECTING
  // ------------------------------------------
  cy.logger({type: 'subheader', text: 'CREATE > BROWSE: selecting browse data'})

  // BROWSE > AUDIO
  cy.formBrowseMediaSelectItem({
    sectionTitle: 'Related audio',
    sectionTitleExact: true,
    addButtonText: '+ Add Related Audio',
    browseButtonText: 'browse audio',
    mediaTitle: timestamp,
  })

  // BROWSE > PICTURES
  cy.formBrowseMediaSelectItem({
    sectionTitle: 'Related pictures',
    addButtonText: '+ Add Related pictures',
    browseButtonText: 'browse pictures',
    mediaTitle: timestamp,
  })

  // BROWSE > VIDEOS
  cy.formBrowseMediaSelectItem({
    sectionTitle: 'Related videos',
    addButtonText: '+ Add Related videos',
    browseButtonText: 'browse videos',
    mediaTitle: timestamp,
  })

  // BROWSE > SOURCE
  cy.formBrowseTableSelectItem({
    sectionTitle: 'Source',
    addButtonText: '+ Add source',
    browseButtonText: 'browse contributors',
    itemTitle: timestamp,
  })
}
// ===============================================
// word_crud
// ===============================================
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
    const updateTitle = `${updatePrefix} Word`
    const updateDefinition = `${updatePrefix} Definition`
    const updateLiteralTranslation = `${updatePrefix} Literal Translation`
    const updatePronounciation = `${updatePrefix} Pronounciation`

    const timestamp = `${Date.now()}`
    const browseTitleAudio = `${timestamp} AUDIO > NAME`
    const browseDescriptionAudio = `${timestamp} AUDIO > DESCRIPTION`
    const browseTitlePicture = `${timestamp} PICTURE > NAME`
    const browseTitleVideo = `${timestamp} VIDEO > NAME`
    const browseTitleSource = `${timestamp} SOURCE > NAME`

    // Login
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/words')
    // cy.wait(waitMedium)
    cy.getByText('TestLanguageOne Words', { exact: false }).should('exist')
    cy.getByText('Create New Word', { exact: false }).click()
    cy.getByText('Add New Word to TestLanguageOne').should('exist')

    // Browse
    cy.logger({type: 'header', text: 'CREATE > BROWSE'})
    populateWordFormBrowse({
      browseTitleAudio,
      browseDescriptionAudio,
      browseTitlePicture,
      browseTitleVideo,
      browseTitleSource,
      timestamp,
    })

    // CREATE
    cy.logger({text: 'Create'})

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

    cy.getByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.getByLabelText('Show Audio Information', {exact: false}).each(($el) => {
        cy.wrap($el)
          .click()
      })
    })
    cy.getByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.getByText(browseDescriptionAudio).should('exist')
    })
    cy.getByText(browseTitlePicture).should('exist')
    cy.getByText(browseTitleVideo).should('exist')

    cy.getByText('metadata', { exact: false }).click()
    cy.getByText(browseTitleSource).should('exist')

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
