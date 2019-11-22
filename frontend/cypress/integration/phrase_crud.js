describe('phrase_crud.js > PageDialectPhrasesCreate', () => {
  // const waitLong = 5000
  const waitMedium = 2000
  const waitShort = 50

  it('CRUD', () => {
    /*
        Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // Login
    cy.login()

    // Create
    cy.log('--- CREATE ---')

    const nowCreate = Date.now()
    const testPrefix = 'PHRASE CRUD'
    const titleCreate = `${testPrefix} > CREATE: Phrase (${nowCreate})`
    const titleUpdate = `${testPrefix} > UPDATE: Phrase (${nowCreate})`

    cy.visit('/nuxeo/app/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/phrases')
    cy.getByText('create new phrase', { exact: false }).click()
    cy.getByText('Add New Phrase to Dene').should('exist')

    // CREATE > Phrase Title
    cy.getByLabelText('Phrase').type(titleCreate)

    // CREATE > Definition
    cy.getByText('Definitions', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add definition', { exact: false }).click()
        cy.getByLabelText('translation', { exact: false }).type(`${testPrefix} > CREATE: Definition`)
      })

    // CREATE > Phrase Book
    cy.getByText('Phrase books', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add phrase book', { exact: false }).click()

        cy.getByText('create new phrase book', { exact: false }).click()
      })
    // DIALOG: Phrase book
    cy.getByText('Add new phrase book to', { exact: false })
      // TODO: need more reliable hook
      .parent()
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.getByLabelText('Phrase book name', { exact: false }).type(`${testPrefix} > CREATE: Phrase book name`)
        cy.getByLabelText('Phrase book description', { exact: false }).type(
          `${testPrefix} > CREATE: Phrase book description`
        )
        // CANCEL: Add new phrase book
        cy.getByText('cancel', { exact: false })
          .parents('button:first')
          .click()
      })
    // CANCEL: add phrase book
    cy.getByText('Phrase books', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('X').click()
      })

    // CREATE > Related Audio
    cy.getByText('Related Audio', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add Related Audio', { exact: false })
          .parents('button:first')
          .click()

        cy.getByText('upload audio', { exact: false }).click()
      })
    // DIALOG: Related Audio
    cy.getByText('Create new audio in the', { exact: false })
      // TODO: need more reliable hook
      .parent()
      .within(() => {
        cy.getByLabelText('Name', { exact: false }).type(`${testPrefix} > CREATE: Related Audio > Name`)
        cy.getByLabelText('Description', { exact: false }).type(`${testPrefix} > CREATE: Related Audio > Description`)
        cy.getByText('Shared accross dialects', { exact: false })
          .parents('label:first')
          .click()
        cy.getByText('Child focused', { exact: false })
          .parents('label:first')
          .click()
        cy.getByText('Source', { exact: false })
          .parents('fieldset:first')
          .within(() => {
            cy.getByText('+ Add new', { exact: false }).click()
            cy.getByText('X').click()
          })
        cy.getByText('Recorder', { exact: false })
          .parents('fieldset:first')
          .within(() => {
            cy.getByText('+ Add new', { exact: false }).click()
            cy.getByText('X').click()
          })
        // CANCEL: Create new audio...
        cy.getByText('cancel', { exact: false })
          .parents('button:first')
          .click()
      })
    // CANCEL: Related Audio
    cy.getByText('Related Audio', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('clear').click()
      })

    // CREATE > Related pictures
    cy.getByText('Related pictures', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add Related pictures', { exact: false })
          .parents('button:first')
          .click()

        cy.getByText('upload picture', { exact: false }).click()
      })
    // DIALOG: Related pictures
    cy.getByText('Create new picture in the', { exact: false })
      // TODO: need more reliable hook
      .parent()
      .within(() => {
        cy.getByLabelText('Name', { exact: false }).type(`${testPrefix} > CREATE: Related pictures > Name`)
        cy.getByLabelText('Description', { exact: false }).type(
          `${testPrefix} > CREATE: Related pictures > Description`
        )
        cy.getByText('Shared accross dialects', { exact: false })
          .parents('label:first')
          .click()
        cy.getByText('Child focused', { exact: false })
          .parents('label:first')
          .click()
        cy.getByText('Source', { exact: false })
          .parents('fieldset:first')
          .within(() => {
            cy.getByText('+ Add new', { exact: false }).click()
            cy.getByText('X').click()
          })
        cy.getByText('Recorder', { exact: false })
          .parents('fieldset:first')
          .within(() => {
            cy.getByText('+ Add new', { exact: false }).click()
            cy.getByText('X').click()
          })
        // CANCEL: Create new picture...
        cy.getByText('cancel', { exact: false })
          .parents('button:first')
          .click()
      })
    // CANCEL: Related pictures
    cy.getByText('Related pictures', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('clear').click()
      })

    // CREATE > Related videos
    cy.getByText('Related videos', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add Related videos', { exact: false })
          .parents('button:first')
          .click()

        cy.getByText('upload video', { exact: false }).click()
      })
    // DIALOG: Related videos
    cy.getByText('Create new video in the', { exact: false })
      // TODO: need more reliable hook
      .parent()
      .within(() => {
        cy.getByLabelText('Name', { exact: false }).type(`${testPrefix} > CREATE: Related videos > Name`)
        cy.getByLabelText('Description', { exact: false }).type(`${testPrefix} > CREATE: Related videos > Description`)
        cy.getByText('Shared accross dialects', { exact: false })
          .parents('label:first')
          .click()
        cy.getByText('Child focused', { exact: false })
          .parents('label:first')
          .click()
        cy.getByText('Source', { exact: false })
          .parents('fieldset:first')
          .within(() => {
            cy.getByText('+ Add new', { exact: false }).click()
            cy.getByText('X').click()
          })
        cy.getByText('Recorder', { exact: false })
          .parents('fieldset:first')
          .within(() => {
            cy.getByText('+ Add new', { exact: false }).click()
            cy.getByText('X').click()
          })
        // CANCEL: Create new video...
        cy.getByText('cancel', { exact: false })
          .parents('button:first')
          .click()
      })
    // CANCEL: Related videos
    cy.getByText('Related videos', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('clear').click()
      })

    // CREATE > Cultural Note
    cy.getByText('Cultural note', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add cultural note', { exact: false }).click()
        cy.getByText('X', { exact: false }).click()
      })

    // CREATE > Reference
    cy.getByLabelText('Reference', { exact: false }).type('CREATE > Reference')

    // CREATE > Source
    cy.getByText('Source', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('+ Add source', { exact: false }).click()
        cy.getByText('X', { exact: false }).click()
      })

    // CREATE > children's archive
    cy.getByLabelText("Available in children's archive", { exact: false }).check()

    // CREATE: save
    cy.getByText('save', { exact: false }).click()

    cy.wait(waitMedium)

    // READ
    cy.log('--- READ ---')
    cy.getByText(titleCreate).should('exist')

    // UPDATE
    cy.log('--- UPDATE ---')
    cy.getByText('Edit phrase', { exact: false })
      .parents('button:first')
      .click()
    cy.wait(waitShort)

    // UPDATE > Phrase Title
    cy.getByLabelText('Phrase')
      .clear()
      .type(titleUpdate)

    // UPDATE > Definition
    cy.getByText('Definitions', { exact: false })
      .parents('fieldset:first')
      .within(() => {
        cy.getByText('X', { exact: false }).click()
      })
    // UPDATE > Reference
    cy.getByLabelText('Reference', { exact: false }).clear()

    // UPDATE > children's archive
    cy.getByLabelText("Available in children's archive", { exact: false }).check()

    // UPDATE: save
    cy.getByText('save', { exact: false }).click()

    cy.wait(waitMedium)

    // UPDATE: verify
    cy.getByText(titleUpdate).should('exist')

    // DELETE
    cy.log('--- DELETE ---')

    cy.getByText('delete phrase', { exact: false }).click()
    cy.wait(waitShort)

    // TODO: need more reliable hook
    cy.getByText('Deleting phrase', { exact: false })
      .parent()
      .within(() => {
        cy.getByText('Delete')
          .click()
      })
    cy.wait(waitShort)
    cy.getByText('Delete phrase success', { exact: false }).should('exist')
  })
})
