import 'cypress-testing-library/add-commands'
describe('PageDialectLearnStoriesAndSongs.js > PageDialectLearnStoriesAndSongs', () => {
  it('FW-257: On the Browse > Songs page, the user can click a button to get to Create Song page', () => {
    cy.login({
      userName: 'SENCOTEN_USERNAME',
      userPassword: 'SENCOTEN_PASSWORD',
    })
    cy.visit(
      'http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/THE%20SEN%C4%86O%C5%A6EN%20LANGUAGE/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/songs'
    )

    cy.getByText('create song book', { exact: false }).click()
    cy.getByText('Add new song book to', { exact: false }).should('exist')
  })

  it('FW-257: On the Browse > Stories page, the user can click a button to get to Create Story page', () => {
    cy.login({
      userName: 'SENCOTEN_USERNAME',
      userPassword: 'SENCOTEN_PASSWORD',
    })
    cy.visit(
      'http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/THE%20SEN%C4%86O%C5%A6EN%20LANGUAGE/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/stories'
    )

    cy.getByText('create story book', { exact: false }).click()
    cy.getByText('Add new story book to', { exact: false }).should('exist')
  })
})
