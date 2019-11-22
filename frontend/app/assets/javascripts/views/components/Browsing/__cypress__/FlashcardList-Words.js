import 'cypress-testing-library/add-commands'
describe('FlashcardList-Words.js > FlashcardList', () => {
  it('Enter flashcard mode, confirm data, paginate, confirm data, leave flashcard mode', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.visit('/explore/FV/sections/Data/Haisla/Haisla/Haisla/learn/words')

    cy.FlashcardList({
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
    })
  })
})
