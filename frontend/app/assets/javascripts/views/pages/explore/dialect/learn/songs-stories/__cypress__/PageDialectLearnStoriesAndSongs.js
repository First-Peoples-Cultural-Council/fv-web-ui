// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('PageDialectLearnStoriesAndSongs.js > PageDialectLearnStoriesAndSongs', () => {
  it('FW-257: On the Browse > Songs page, the user can click a button to get to Create Song page', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/songs')

    cy.getByText('create song book', { exact: false }).click()
    cy.getByText('Add new song book to', { exact: false }).should('exist')
  })

  it('FW-257: On the Browse > Stories page, the user can click a button to get to Create Story page', () => {
    cy.login({
      userName: 'TESTLANGUAGESIX_ADMIN',
    })
    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageSix/learn/stories')

    cy.getByText('create story book', { exact: false }).click()
    cy.getByText('Add new story book to', { exact: false }).should('exist')
  })
})
