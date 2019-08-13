/*
Do not add tests directly to this folder (or edit any tests found in here)
They will be deleted!

When Cypress is started 2 tasks are run:
- `cy:trashCopy` which deletes the contents of this folder (except for this file)
- `cy:copy` which scans the codebase for `__cypress__` directories and copies any files found to this directory
*/
it('README', () => {
  cy.log('**Do not add tests directly to this folder (or edit any tests found in here)**')
  cy.log('**They will be deleted!**')
  cy.log('')
  cy.log('When Cypress is started 2 tasks are run:')
  cy.log('- `cy:trashCopy` which deletes the contents of this folder (except for this file)')
  cy.log('- `cy:copy` which scans the codebase for `__cypress__` directories and copies any files found to this directory')
})

