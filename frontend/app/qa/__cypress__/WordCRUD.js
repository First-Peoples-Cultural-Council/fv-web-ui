const waitMedium = 1000
const waitShort = 50

// ===============================================
// WordCRUD
// ===============================================
describe('WordCRUD.js > PageDialectWordsCreate', () => {
  it('CRUD', () => {
    // Login
    cy.login({
      userName: 'TestDialectPublic_language_administrators',
      userPassword: 'TestDialectPublic_language_administrators',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/learn/words')
    cy.wait(waitMedium)
    cy.findByText('TestDialectPublic Words', { exact: false }).should('exist')
    cy.findByText('Create New Word', { exact: false }).click()
    cy.findByText('Add New Word to TestDialectPublic').should('exist')

    // Test validation
    cy.logger({ type: 'subheader', text: 'Empty Save' })
    cy.findByTestId('PageDialectWordsCreate__form').within(() => {
      cy.findByText('save', { exact: false }).click()
    })
    cy.findByText('Value in field "Word" cannot be empty.').should('exist')

    // CREATE
    cy.logger({ text: 'Create' })
    const initialContent = getContent('[CREATE]')

    populateWordForm(initialContent)

    // CREATE children's archive
    cy.logger({ type: 'subheader', text: "[CREATE] Childrens's archive" })
    cy.findByLabelText("Available in children's archive", { exact: false }).check()

    // CREATE games
    cy.logger({ type: 'subheader', text: '[CREATE] Available in games' })
    cy.findByLabelText('Available in games', { exact: false }).check()

    cy.logger({ type: 'subheader', text: '[CREATE] Save' })
    cy.findByTestId('PageDialectWordsCreate__form').within(() => {
      cy.findByText('save', { exact: false }).click()
    })
    cy.wait(waitMedium)

    // Read
    cy.logger({ text: 'READ' })
    cy.findAllByText(initialContent.title).should('exist')
    cy.findByText(initialContent.definition).should('exist')
    cy.findByText(initialContent.literalTranslation).should('exist')
    cy.findByText(initialContent.pronounciation).should('exist')

    cy.findByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.findByLabelText('Show Audio Information', { exact: false }).each(($el) => {
        cy.wrap($el).click()
      })
    })
    cy.findByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.findByText(initialContent.descriptionAudio).should('exist')
    })
    cy.findByText(initialContent.titlePicture).should('exist')

    cy.findByText('metadata', { exact: false }).click()
    cy.findByText(initialContent.titleSource).should('exist')

    // Update
    cy.logger({ text: 'UPDATE' })
    cy.findByText('Edit', { exact: false }).click()
    cy.wait(waitMedium)
    clearWordForm()
    const updatedContent = getContent('[UPDATE]')
    populateWordForm(updatedContent)

    // UPDATE: save
    cy.logger({ type: 'subheader', text: '[CREATE] Save' })
    cy.findByTestId('withForm__btnGroup2').within(() => {
      cy.findByText('save', { exact: false }).click()
    })

    cy.wait(waitMedium)

    // UPDATE: verify
    cy.logger({ type: 'subheader', text: '[CREATE] VERIFY' })
    cy.findAllByText(updatedContent.title).should('exist')
    cy.findByText(updatedContent.definition).should('exist')
    cy.findByText(updatedContent.literalTranslation).should('exist')
    cy.findByText(updatedContent.pronounciation).should('exist')

    // DELETE
    cy.logger({ text: 'DELETE' })

    cy.findByText('delete word', { exact: false }).click()

    cy.findByTestId('ViewWithActions__dialog').within(() => {
      cy.findByText('delete').click()
    })
    cy.wait(waitShort)
    cy.findByText('Delete word success', { exact: false }).should('exist')
  })
})

// ===============================================
// clearWordForm
// ===============================================
function clearWordForm() {
  cy.logger({ type: 'subheader', text: 'clearWordForm' })
  cy.findByTestId('pageContainer').within(() => {
    // Clear input texts
    cy.findByTestId('dc-title').clear()
    cy.findByTestId('fv-word-pronunciation').clear()
    cy.findByTestId('fv-reference').clear()
    cy.findByTestId('fv-word-acknowledgement').clear()

    // Remove x's
    cy.formClickAllXs()
  })
  // reset select
  cy.findByTestId('fv-word-part_of_speech').select('true')
}

// ===============================================
// getContent
// ===============================================
function getContent(prefix) {
  return {
    prefix: prefix,
    title: `${prefix} Word Title`,
    definition: `${prefix} Definition`,
    literalTranslation: `${prefix} Literal Translation`,
    pronounciation: `${prefix} Pronounciation`,
    titleAudio: `${prefix} Related audio title`,
    descriptionAudio: `${prefix} Related audio description`,
    titlePicture: `${prefix} Related picture title`,
    descriptionPicture: `${prefix} Related picture description`,
    titleSource: `${prefix} Contributor name`,
  }
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
  titleAudio,
  descriptionAudio,
  titlePicture,
  descriptionPicture,
  titleSource,
}) {
  // [POPULATE] Word
  cy.logger({ type: 'subheader', text: `${prefix} Title` })
  cy.findByTestId('dc-title').clear().type(title)

  // [POPULATE] Part of speech
  cy.logger({ type: 'subheader', text: `${prefix} Part of Speech` })
  cy.findByTestId('fv-word-part_of_speech').select('question_word')

  // [POPULATE] Pronunciation
  cy.logger({ type: 'subheader', text: `${prefix} Pronounciation` })
  cy.findByTestId('fv-word-pronunciation').clear().type(pronounciation)

  // [POPULATE] Definition
  cy.logger({ type: 'subheader', text: `${prefix} Definition` })
  cy.formPopulateDefinitions({ definition })

  // [POPULATE] Literal Translation
  cy.logger({ type: 'subheader', text: `${prefix} Literal Translation` })
  cy.findByText('+ Add literal translation', { exact: false }).click()
  cy.findByTestId('fv-literal_translation0translation').type(literalTranslation)

  // [POPULATE] Audio
  cy.logger({ type: 'subheader', text: `${prefix} Audio` })
  cy.formPopulateRelatedAudio({
    name: titleAudio,
    description: descriptionAudio,
  })
  cy.wait(waitMedium)
  cy.findByText('Insert into entry').click()

  // [POPULATE] picture
  cy.logger({ type: 'subheader', text: `${prefix} Picture` })
  cy.formPopulateRelatedPictures({
    name: titlePicture,
    description: descriptionPicture,
  })
  cy.wait(waitMedium)
  cy.findByText('Insert into entry').click()

  // [POPULATE] phrases
  cy.logger({ type: 'subheader', text: `${prefix} Phrases` })
  cy.findByText('+ Add related phrases', { exact: false }).click()

  cy.findByText('create new phrase', { exact: false }).click()

  cy.findByTestId('PhrasesCreate__form').within(() => {
    cy.findByLabelText('phrase', { exact: false }).type(`${prefix} PHRASE`)
    cy.findByText('save', { exact: false }).click()
  })

  // [POPULATE] Cultural Note
  cy.logger({ type: 'subheader', text: `${prefix} Cultural Note` })
  cy.formPopulateCulturalNotes({ prefix })

  // [POPULATE] Reference
  cy.logger({ type: 'subheader', text: `${prefix} Reference` })
  cy.get('input[label="Reference"].form-control').type(`${prefix} Reference`)

  // [POPULATE] Source
  cy.logger({ type: 'subheader', text: `${prefix} Source` })
  cy.formPopulateSource({ name: titleSource })
}
