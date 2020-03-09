export const testSearchPhrases = () => {
  const btnSearch = 'Search Phrases'
  const searchingText = 'Showing phrases that'
  const postClearFilterText = 'Showing all phrases listed'

  const _searchConfig = {
    search1: {
      btnSearch,
      clearFilter: true,
      confirmData: true,
      postClearFilterText,
      searchDefinitions: true,
      searchingText,
      searchPhrase: true,
      shouldPaginate: true,
      term: 'TestPhrase',
    },
    search2: {
      btnSearch,
      clearFilter: false,
      confirmData: false,
      confirmNoData: true,
      postClearFilterText,
      searchDefinitions: true,
      searchingText,
      searchPhrase: false,
      shouldPaginate: false,
      term: 'TestPhraseOne',
    },
    search3: {
      btnSearch,
      clearFilter: false,
      confirmData: true,
      postClearFilterText,
      searchDefinitions: true,
      searchingText,
      searchPhrase: true,
      shouldPaginate: false,
      term: 'TestPhraseOne',
    },
    // Item only in Definitions
    search4: {
      btnSearch,
      clearFilter: false,
      confirmData: false,
      confirmNoData: true,
      postClearFilterText,
      searchDefinitions: false,
      searchingText,
      searchPhrase: true,
      shouldPaginate: false,
      term: 'TestTranslation',
    },
    search5: {
      btnSearch,
      clearFilter: false,
      confirmData: true,
      postClearFilterText,
      searchDefinitions: true,
      searchingText,
      searchPhrase: true,
      shouldPaginate: false,
      term: 'TestTranslation',
    },
    // Item only in Cultural Notes
    search6: {
      btnSearch,
      clearFilter: false,
      confirmData: false,
      confirmNoData: true,
      postClearFilterText,
      searchPhrase: true,
      searchDefinitions: true,
      searchingText,
      shouldPaginate: false,
      term: 'TestCulturalNote',
    },
    search7: {
      btnSearch,
      clearFilter: false,
      confirmData: true,
      postClearFilterText,
      searchingText,
      searchDefinitions: false,
      searchPhrase: false,
      searchCulturalNotes: true,
      shouldPaginate: false,
      term: 'TestCulturalNote',
    },
  }

  cy.browseSearch(_searchConfig.search1)
  cy.browseSearch(_searchConfig.search2)
  cy.browseSearch(_searchConfig.search3)
  cy.browseSearch(_searchConfig.search4)
  cy.browseSearch(_searchConfig.search5)
  cy.browseSearch(_searchConfig.search6)
  cy.browseSearch(_searchConfig.search7)
}
export default testSearchPhrases
