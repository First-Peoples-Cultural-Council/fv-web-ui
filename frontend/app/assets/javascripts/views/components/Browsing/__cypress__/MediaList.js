function formBrowseMedia({ sectionTitle, sectionTitleExact = false, addButtonText, browseButtonText, mediaTitle }) {
  cy.getByText(sectionTitle, { exact: sectionTitleExact })
    .parents('fieldset:first')
    .within(() => {
      cy.getByText(addButtonText, { exact: false })
        .parents('button:first')
        .click()

      cy.getByText(browseButtonText, { exact: false }).click()
    })
  cy.getByText('select existing', { exact: false }).should('exist')
  cy.getByTestId('withFilter').within(() => {
    cy.getByText('Name/Description', { exact: false })
      .parent()
      .within(() => {
        cy.get('input[type=text]').type(mediaTitle)
      })
    cy.getByText('Filter').click()
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
    cy.getByText('create new phrase', { exact: false }).click()
    cy.getByText('Add New Phrase to TestLanguageSeven').should('exist')

    const prefix = 'FW-889'

    // [POPULATE] Related Audio
    cy.logger({ type: 'subheader', text: `${prefix} Related Audio` })
    cy.formPopulateRelatedAudio({
      name: `${prefix} AUDIO > NAME`,
      description: `${prefix} AUDIO > DESCRIPTION`,
    })
    cy.wait(500)
    cy.getByTestId('Dialog__AddMediaComponentCancel').click()

    // [POPULATE] Related pictures
    cy.logger({ type: 'subheader', text: `${prefix} Related pictures` })
    cy.formPopulateRelatedPictures({
      name: `${prefix} Related pictures > Name`,
      description: `${prefix} Related pictures > Description`,
    })
    cy.wait(500)
    cy.getByTestId('Dialog__AddMediaComponentCancel').click()

    // BROWSE > PICTURES
    formBrowseMedia({
      sectionTitle: 'Related pictures',
      addButtonText: '+ Add Related pictures',
      browseButtonText: 'browse pictures',
      mediaTitle: prefix,
    })

    cy.getByTestId('MediaList').within(() => {
      cy.get('audio').should('not.exist')
    })
    cy.getByTestId('Dialog__SelectMediaComponentCancel').click()

    // BROWSE > AUDIO
    formBrowseMedia({
      sectionTitle: 'Related audio',
      sectionTitleExact: true,
      addButtonText: '+ Add Related Audio',
      browseButtonText: 'browse audio',
      mediaTitle: prefix,
    })

    cy.getByTestId('MediaList').within(() => {
      cy.get('audio').should('exist')
    })
    cy.getByTestId('Dialog__SelectMediaComponentCancel').click()

    // BROWSE > PICTURES
    formBrowseMedia({
      sectionTitle: 'Related pictures',
      addButtonText: '+ Add Related pictures',
      browseButtonText: 'browse pictures',
      mediaTitle: prefix,
    })

    cy.getByTestId('MediaList').within(() => {
      cy.get('audio').should('not.exist')
    })
  })
})
