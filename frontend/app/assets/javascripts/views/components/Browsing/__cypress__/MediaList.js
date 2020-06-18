function formBrowseMedia({ sectionTitle, sectionTitleExact = false, addButtonText, browseButtonText, mediaTitle }) {
  cy.findByText(sectionTitle, { exact: sectionTitleExact })
    .parents('fieldset:first')
    .within(() => {
      cy.findByText(addButtonText, { exact: false })
        .parents('button:first')
        .click()
      cy.wait(500)

      cy.findByText(browseButtonText, { exact: false }).click()
      cy.wait(1000)
    })
  cy.findByText('select existing', { exact: false }).should('exist')
  cy.findByTestId('withFilter').within(() => {
    cy.findByText('Name/Description', { exact: false })
      .parent()
      .within(() => {
        cy.get('input[type=text]').type(mediaTitle)
      })
    cy.findByText('Filter').click()
    cy.wait(1000)
  })
}

describe('media-list.js > MediaList', () => {
  it('Clicking between browse components should show only that media type', () => {
    cy.login({
      userName: 'TESTLANGUAGESEVEN_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSeven/learn/phrases')

    // Create
    cy.logger({ type: 'header', text: 'CREATE' })
    cy.findByText('create new phrase', { exact: false }).click()
    cy.findByText('Add New Phrase to TestLanguageSeven').should('exist')

    const prefix = 'FW-889'

    // [POPULATE] Related Audio
    cy.logger({ type: 'subheader', text: `${prefix} Related Audio` })
    cy.formPopulateRelatedAudio({
      name: `${prefix} AUDIO > NAME`,
      description: `${prefix} AUDIO > DESCRIPTION`,
    })
    cy.wait(500)
    cy.findByTestId('Dialog__AddMediaComponentCancel').click()

    // [POPULATE] Related pictures
    cy.logger({ type: 'subheader', text: `${prefix} Related pictures` })
    cy.formPopulateRelatedPictures({
      name: `${prefix} Related pictures > Name`,
      description: `${prefix} Related pictures > Description`,
    })
    cy.wait(500)
    cy.findByTestId('Dialog__AddMediaComponentCancel').click()

    // BROWSE > PICTURES
    formBrowseMedia({
      sectionTitle: 'Related pictures',
      addButtonText: '+ Add Related pictures',
      browseButtonText: 'browse pictures',
      mediaTitle: prefix,
    })

    cy.findByTestId('MediaList').within(() => {
      cy.get('audio').should('not.exist')
    })
    cy.findByTestId('Dialog__SelectMediaComponentCancel').click()

    // BROWSE > AUDIO
    formBrowseMedia({
      sectionTitle: 'Related audio',
      sectionTitleExact: true,
      addButtonText: '+ Add Related Audio',
      browseButtonText: 'browse audio',
      mediaTitle: prefix,
    })

    cy.findByTestId('MediaList').within(() => {
      cy.get('audio').should('exist')
    })
    cy.findByTestId('Dialog__SelectMediaComponentCancel').click()

    // BROWSE > PICTURES
    formBrowseMedia({
      sectionTitle: 'Related pictures',
      addButtonText: '+ Add Related pictures',
      browseButtonText: 'browse pictures',
      mediaTitle: prefix,
    })

    cy.findByTestId('MediaList').within(() => {
      cy.get('audio').should('not.exist')
    })
  })
})
