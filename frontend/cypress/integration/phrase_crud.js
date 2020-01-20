// const waitLong = 5000
const waitMedium = 2000
const waitShort = 50

function clearPhraseForm() {
  const prefix = '[RESET]'

  // Clear input texts
  cy.getByTestId('pageContainer').within(() => {
    cy.logger({type: 'header', text: `${prefix} clear inputs`})
    cy.get('input[name="dc:title"]').clear()
    cy.get('input[name="fv:reference"]').clear()
    cy.get('input[name="fv-phrase:acknowledgement"]').clear()

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
}
function populatePhraseForm({
  prefix,
  title,
  definition,
}) {
  // [POPULATE] Title
  cy.logger({type: 'subheader', text: `${prefix} Title`})
  cy.getByText('Phrase').parent().find('input[type=text]').type(title)

  // [POPULATE] Definition
  cy.logger({type: 'subheader', text: `${prefix} Definition`})
  cy.getByText('Definitions', { exact: false })
    .parents('fieldset:first')
    .within(() => {
      cy.getByText('+ Add definition', { exact: false }).click()
      cy.getByLabelText('translation', { exact: false }).type(definition)
    })

  // [POPULATE] Phrase Book
  cy.logger({type: 'subheader', text: `${prefix} Phrase Book`})
  cy.getByText('Phrase books', { exact: false })
    .parents('fieldset:first')
    .within(() => {
      cy.getByText('+ Add phrase book', { exact: false }).click()

      cy.getByText('create new phrase book', { exact: false }).click()
    })
  cy.getByTestId('PageDialectPhraseBooksCreate').within(() => {
    cy.getByText('Phrase book name', { exact: false })
      .parent()
      .find('input[type=text]').type(`${prefix} Phrase book name`)
    cy.getByText('Phrase book description', { exact: false })
      .parent()
      .find('textarea').type(`${prefix} Phrase book description`)
    cy.getByText('save', { exact: false }).click()
  })

  // [POPULATE] Related Audio
  cy.logger({type: 'subheader', text: `${prefix} Related Audio`})
  cy.getByText('Related Audio', { exact: false })
    .parents('fieldset:first')
    .within(() => {
      cy.getByText('+ Add Related Audio', { exact: false })
        .parents('button:first')
        .click()

      cy.getByText('upload audio', { exact: false }).click()
    })
  cy.getByTestId('AddMediaComponent')
    .within(() => {
      // Note: There are duplicate IDs because of modals & tcomb-form
      // So we can't use getByLabelText. Have to getByText and move up the dom
      cy.getByText('name', { exact: false }).parent().find('input[type=text]').type(`${prefix} AUDIO > NAME`)
      cy.getByText('description', { exact: false }).parent().find('textarea').type(`${prefix} AUDIO > DESCRIPTION`)
      cy.getByText('Shared accross dialects', { exact: false }).parent().find('input[type=checkbox]').check()
      cy.getByText('Child focused', { exact: false }).parent().find('input[type=checkbox]').check()

      const fileName = 'TestRelatedAudio.wav'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('input[type=file]').upload({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] Related pictures
  cy.logger({type: 'subheader', text: `${prefix} Related pictures`})
  cy.getByText('Related pictures', { exact: false })
    .parents('fieldset:first')
    .within(() => {
      cy.getByText('+ Add Related pictures', { exact: false })
        .parents('button:first')
        .click()

      cy.getByText('upload picture', { exact: false }).click()
    })
  cy.getByTestId('AddMediaComponent')
    .within(() => {
      // Note: There are duplicate IDs because of modals & tcomb-form
      // So we can't use getByLabelText. Have to getByText and move up the dom
      cy.getByText('name', { exact: false }).parent().find('input[type=text]').type(`${prefix} Related pictures > Name`)
      cy.getByText('description', { exact: false }).parent().find('textarea').type(
        `${prefix} Related pictures > Description`
      )
      cy.getByText('Shared accross dialects', { exact: false }).parent().find('input[type=checkbox]').check()
      cy.getByText('Child focused', { exact: false }).parent().find('input[type=checkbox]').check()
      const fileName = 'TestRelatedImage.png'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] Related videos
  cy.logger({type: 'subheader', text: `${prefix} Related videos`})
  cy.getByText('Related videos', { exact: false })
    .parents('fieldset:first')
    .within(() => {
      cy.getByText('+ Add Related videos', { exact: false })
        .parents('button:first')
        .click()

      cy.getByText('upload video', { exact: false }).click()
    })
  cy.getByTestId('AddMediaComponent')
    .within(() => {
      // Note: There are duplicate IDs because of modals & tcomb-form
      // So we can't use getByLabelText. Have to getByText and move up the dom
      cy.getByText('name', { exact: false }).parent().find('input[type=text]').type(`${prefix} Related videos > Name`)
      cy.getByText('description', { exact: false }).parent().find('textarea').type(
        `${prefix} Related videos > Description`
      )
      cy.getByText('Shared accross dialects', { exact: false }).parent().find('input[type=checkbox]').check()
      cy.getByText('Child focused', { exact: false }).parent().find('input[type=checkbox]').check()
      const fileName = 'TestRelatedVideo.mp4'
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[name="file"]').upload({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
      })
      cy.getByText('Upload Media', { exact: true }).click()
    })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] Cultural Note
  cy.logger({type: 'subheader', text: `${prefix} Cultural Note`})
  cy.getByText('Cultural note', { exact: false })
    .parent()
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
    .parent()
    .within(() => {
      cy.get('input.form-control[type=text]:first')
        .invoke('val')
        .should('be.eq', `${prefix} cultural note 1`)
    })

  // [POPULATE] Reference
  cy.logger({type: 'subheader', text: `${prefix} Reference`})
  cy.getByLabelText('Reference', { exact: false }).type(`${prefix} Reference`)

  // [POPULATE] Acknowledgement
  cy.logger({type: 'subheader', text: `${prefix} Acknowledgement`})
  cy.getByLabelText('Acknowledgement', { exact: false }).type(`${prefix} Acknowledgement`)


  // [POPULATE] Source
  cy.logger({type: 'subheader', text: `${prefix} Source`})
  cy.getByText('Source', { exact: false })
    .parent()
    .within(() => {
      cy.getByText('+ Add source', { exact: false }).click()
      cy.getByText('create new contributor', { exact: false }).click()
    })
  cy.getByTestId('DialogCreateForm__DialogContent').within(() => {
    cy.getByText('Contributor name', { exact: false }).parent().within(()=>{
      cy.get('input[type=text]').type(`${prefix} New Contributor > Contributor Name`)
    })
    cy.getByText('save', { exact: false }).click()
  })
}
describe('phrase_crud.js > PageDialectPhrasesCreate', () => {
  it('CRUD', () => {
    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // Login
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })


    const prefix = '[CREATE]'
    const title = `${prefix} Phrase`
    const definition = `${prefix} Definition`

    const updatePrefix = '[UPDATE]'
    const updateTitle = '[UPDATE] Phrase'
    const updateDefinition = '[UPDATE] Definition'
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/phrases')

    // Create
    cy.logger({type: 'header', text: 'CREATE'})
    cy.getByText('create new phrase', { exact: false }).click()
    cy.getByText('Add New Phrase to TestLanguageOne').should('exist')
    populatePhraseForm({
      prefix,
      title,
      definition,
    })
    // CREATE > children's archive
    cy.logger({type: 'subheader', text: `${prefix} Children's archive`})
    cy.getByLabelText("Available in children's archive", { exact: false }).check()

    // CREATE: save
    cy.logger({type: 'subheader', text: `${prefix} Save`})
    cy.getByText('save', { exact: false }).click()

    cy.wait(waitMedium)

    // READ
    cy.logger({type: 'header', text: 'READ'})
    cy.getByText(title).should('exist')
    cy.getByText(definition).should('exist')


    // UPDATE
    cy.logger({type: 'header', text: 'UPDATE'})
    cy.getByText('Edit phrase', { exact: false })
      .parents('button:first')
      .click()
    cy.wait(waitShort)

    clearPhraseForm()

    populatePhraseForm({
      prefix: updatePrefix,
      title: updateTitle,
      definition: updateDefinition,
    })

    // UPDATE: save
    cy.getByText('save', { exact: false }).click()

    cy.wait(waitMedium)

    // UPDATE: verify
    cy.getByText(updateTitle).should('exist')
    cy.getByText(updateDefinition).should('exist')

    // DELETE
    cy.logger({type: 'header', text: 'DELETE'})

    cy.getByText('delete phrase', { exact: false }).click()
    cy.wait(waitShort)

    // TODO: need more reliable hook
    cy.getByTestId('ViewWithActions__dialog').within(() => {
      cy.getByText('Delete').click()
    })
    cy.wait(waitShort)
    cy.getByText('Delete phrase success', { exact: false }).should('exist')
  })
})
