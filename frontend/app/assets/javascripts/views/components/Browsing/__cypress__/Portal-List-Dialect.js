import 'cypress-testing-library/add-commands'
describe('Portal List Dialect Test', () => {
  it('Toggles between new and old view', () => {
    cy.visit('http://127.0.0.1:3001/home')
    cy.wait(500)
    cy.getByText('EXPLORE LANGUAGES').click()
    cy.wait(500)
    cy.get('[data-cy="language_group_view"]').should('not.exist')
    cy.get('[data-cy="old_view"]').should('exist')
    cy.getByText('Organize by language').click()
    cy.get('[data-cy="language_group_view"]').should('exist')
    cy.get('[data-cy="old_view"]').should('not.exist')
  })

  // This cy test will work when the language sort is toggled by default
  // it('Scrolls into view when accessing with #', () => {
  //   cy.visit('/explore/FV/sections/Data#Other')
  //   cy.wait(9000)

  //   cy.window().then(($window) => {
  //     expect($window.scrollY).to.be.greaterThan(2000)
  //   })
  // })
})
