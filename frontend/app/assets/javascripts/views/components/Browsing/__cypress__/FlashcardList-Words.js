import 'cypress-testing-library/add-commands'
describe('FlashcardList-Words.js > FlashcardList', () => {
  it('Enter flashcard mode, confirm data, paginate, confirm data, leave flashcard mode', () => {
    cy.visit('http://0.0.0.0:3001/nuxeo/app/explore/FV/sections/Data/Haisla/Haisla/Haisla/learn/words')

    cy.FlashcardList({
      confirmData: true,
      shouldPaginate: true,
      clearFilter: true,
    })
  })
})
