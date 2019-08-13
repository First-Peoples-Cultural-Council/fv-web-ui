describe('word_crud.js > PageDialectWordsCreate', () => {
  const host = 'http://0.0.0.0:3001'
  const create =
    'https://preprod.firstvoices.com/nuxeo/api/v1/path/FV/Workspaces/Data/Athabascan/Dene/Dene/Dictionary'
  const prefix = '/nuxeo/app'
  // const waitLong = 5000
  const waitMedium = 2000
  const waitShort = 50

  it('CRUD', () => {
    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // Login
    cy.login()

    // Create
    cy.log('--- CREATE ---')

    const nowCreate = Date.now()
    const title = `Cypress: Word > CRUD | Test ran at ${nowCreate}`
    const word = {
      'entity-type': 'document',
      type: 'FVWord',
      name: '1553060181758',
      properties: {
        'dc:title': title,
        'fv-word:pronunciation': 'Auto created by Cypress test',
        'fv-word:part_of_speech': 'verb',
      },
    }
    cy.request({
      method: 'POST',
      url: create,
      body: word,
    }).then((response) => {
      const page = `${host}${prefix}/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/${response.body.uid}`
      cy.visit(page)

      // Read
      cy.log('--- READ ---')

      cy.wait(waitMedium)
      cy.getByText(title).should('exist')

      // Update
      cy.log('--- UPDATE ---')
      cy.getByText('Edit word', { exact: false }).click()

      // UPDATE > Word
      cy.getByTestId('dc-title')
        .clear()
        .type('UPDATE > Word')

      // UPDATE > Part of speech
      cy.getByTestId('fv-word-part_of_speech').select('question_word')

      // UPDATE > Pronounciation
      cy.getByTestId('fv-word-pronunciation')
        .clear()
        .type('UPDATE > Pronounciation')

      // UPDATE > Definition
      cy.getByText('+ Add definition', { exact: false }).click()
      cy.getByTestId('fv-definitions0translation').type('UPDATE > Definition')

      // UPDATE > Literal Translation
      cy.getByText('+ Add literal translation', { exact: false }).click()
      cy.getByTestId('fv-literal_translation0translation').type('UPDATE > Literal Translation')

      // UPDATE > Audio
      cy.getByText('+ Add related audio', { exact: false })
        .parents('button')
        .click()

      cy.getByText('upload audio', { exact: false }).click()

      cy.getByText('Create new audio in the dene dialect', { exact: false })
        .parent()
        .within(() => {
          cy.getByLabelText('name', { exact: false }).type('UPDATE > AUDIO > NAME')
          cy.getByLabelText('description', { exact: false }).type('UPDATE > AUDIO > DESCRIPTION')
          // NOTE: Not certain how to (or if should) test uploading of audio
          // cy.getByLabelText('FILE', { exact: false }).click()
          cy.getByLabelText('Shared accross dialects', { exact: false }).check()
          cy.getByLabelText('Child focused', { exact: false }).check()
          cy.getByText('cancel', { exact: false }).click()
        })

      cy.getByText('Related audio', { exact: false })
        .parents('.row')
        .within(() => {
          cy.getByText('clear', { exact: false }).click()
        })

      // UPDATE > picture
      cy.getByText('+ Add related pictures', { exact: false })
        .parents('button')
        .click()

      cy.getByText('upload picture', { exact: false }).click()

      cy.getByText('Create new picture in the dene dialect', { exact: false })
        .parent()
        .within(() => {
          cy.getByLabelText('name', { exact: false }).type('UPDATE > PICTURE > NAME')
          cy.getByLabelText('description', { exact: false }).type('UPDATE > PICTURE > DESCRIPTION')
          cy.getByLabelText('Shared accross dialects', { exact: false }).check()
          cy.getByLabelText('Child focused', { exact: false }).check()
          cy.getByText('cancel', { exact: false }).click()
        })

      cy.getByText('Related pictures', { exact: false })
        .parents('.row')
        .within(() => {
          cy.getByText('clear', { exact: false }).click()
        })

      // UPDATE > video
      cy.getByText('+ Add related videos', { exact: false })
        .parents('button')
        .click()

      cy.getByText('upload video', { exact: false }).click()

      cy.getByText('Create new video in the dene dialect', { exact: false })
        .parent()
        .within(() => {
          cy.getByLabelText('name', { exact: false }).type('UPDATE > VIDEO > NAME')
          cy.getByLabelText('description', { exact: false }).type('UPDATE > VIDEO > DESCRIPTION')
          cy.getByLabelText('Shared accross dialects', { exact: false }).check()
          cy.getByLabelText('Child focused', { exact: false }).check()
          cy.getByText('cancel', { exact: false }).click()
        })

      cy.getByText('Related videos', { exact: false })
        .parents('.row')
        .within(() => {
          cy.getByText('clear', { exact: false }).click()
        })

      // UPDATE > phrases
      cy.getByText('+ Add related phrases', { exact: false }).click()

      cy.getByText('create new phrase', { exact: false }).click()

      cy.getByText('Add New Phrase to Dene', { exact: false })
        .parent()
        .parent()
        .parent()
        .parent()
        .within(() => {
          cy.getByLabelText('phrase', { exact: false }).type('UPDATE > PHRASE')
          cy.getByText('cancel', { exact: false }).click()
        })

      cy.getByText('Related phrases', { exact: false })
        .parent('fieldset')
        .within(() => {
          cy.getByText('X', { exact: false }).click()
        })

      // UPDATE > Category
      cy.getByText('+ Add categories', { exact: false }).click()
      cy.getByText('Browse categories', { exact: false }).click()

      cy.getByText('Select Categories', { exact: false })
        .parent()
        .within(() => {
          cy.getByText('cancel', { exact: false }).click()
        })

      cy.getByText('Categories', { exact: false })
        .parent('fieldset')
        .within(() => {
          cy.getByText('X', { exact: false }).click()
        })

      // UPDATE > Cultural Note
      cy.getByText('Cultural note', { exact: false })
        .parent('fieldset')
        .within(() => {
          cy.getByText('+ Add cultural note', { exact: false }).click()
          cy.getByText('X', { exact: false }).click()
        })
      // UPDATE > Reference
      cy.get('input[label="Reference"].form-control').type('UPDATE > Reference')

      // UPDATE > Source
      cy.getByText('Source', { exact: false })
        .parent('fieldset')
        .within(() => {
          cy.getByText('+ Add source', { exact: false }).click()
          cy.getByText('X', { exact: false }).click()
        })
      // UPDATE > children's archive
      cy.getByLabelText("Available in children's archive", { exact: false }).check()
      // UPDATE > games
      cy.getByLabelText('Available in games', { exact: false }).check()

      // UPDATE: save
      cy.getByText('save', { exact: false }).click()

      cy.wait(waitMedium)

      // UPDATE: verify
      cy.getByText('UPDATE > Word').should('exist')
      cy.getByText('UPDATE > Definition').should('exist')
      cy.getByText('UPDATE > Literal Translation').should('exist')
      cy.getByText('UPDATE > Pronounciation').should('exist')
      cy.getByText('Question word').should('exist')

      // DELETE
      cy.log('--- DELETE ---')

      cy.getByText('delete word', { exact: false }).click()
      cy.wait(waitShort)

      // TODO: need more reliable hook
      cy.getByText('Deleting word', { exact: false })
        .parent()
        .within(() => {
          cy.getByText('Delete')
            .click()
        })
      cy.wait(waitShort)
      cy.getByText('Delete word success', { exact: false }).should('exist')
    })
  })
})
