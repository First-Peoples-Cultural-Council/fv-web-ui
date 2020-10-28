// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import '@testing-library/cypress/add-commands'

describe('MediaView', () => {
  it("FW-750: Media page does not load media on first load (need to click 'Overview' for page to load)", () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/media')

    cy.wait(2000)

    cy.queryAllByText('TestWordImage', { exact: false })
      .eq(0)
      .click()

    cy.wait(1200)

    cy.get('[data-testid=tabOverview][aria-selected=true]')
  })
})
