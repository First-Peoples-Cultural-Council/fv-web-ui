describe('Breadcrumb Category Word List Test', () => {
  it('Visit the word list page and check breadcrumb', () => {
    cy.visit('/explore/FV/sections/Data/Test/Test/TestLanguageEight/learn/words')

    const category = cy.findByTestId('DialectFilterListItem-0')
    let categoryName
    let page

    cy.findByTestId('DialectFilterListItem-0').then(($DialectFilterList) => {
      categoryName = $DialectFilterList.text()
    })

    category.click()

    cy.findByTestId('BreadcrumbCurrentPage').then(($CurrentPage) => {
      page = $CurrentPage.text()
      expect(page).to.contain(categoryName)
    })
  })
})
