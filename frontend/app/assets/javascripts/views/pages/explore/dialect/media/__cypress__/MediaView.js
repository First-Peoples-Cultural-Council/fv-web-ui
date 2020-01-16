// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

import 'cypress-testing-library/add-commands'

describe('MediaView', () => {
  it("FW-750: Media page does not load media on first load (need to click 'Overview' for page to load)", () => {
    cy.login({
      userName: 'TESTLANGUAGETWO_ADMIN',
    })

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageTwo/media/405ab9de-ce39-4c82-890e-18ce0ee8f49f')

    cy.wait(500)

    cy.get('[data-testid=tabOverview][aria-selected=true]')
  })
})
