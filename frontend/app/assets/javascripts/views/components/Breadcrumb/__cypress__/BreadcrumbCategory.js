describe('Breadcrumb Category Word List Test', () => {
  it('Clicking through to the Word List page and check breadcrumb', () => {
    cy.visit('/home')
    cy.getByText('EXPLORE LANGUAGES').click()
    cy.getByText('TestLanguageFive').click()
    cy.getByText(/Learn Our Language/i).click()
    cy.getByText(/Words/i).click()
    cy.getByText(/TestCategory/i).click()
    cy.get('li')
      .eq(4)
      .should('contain', 'TestCategory')
  })
})
