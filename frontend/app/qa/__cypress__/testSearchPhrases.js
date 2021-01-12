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
      log: '1) Search for phrases',
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
      log: '2) Search for phrase in definitions',
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
      log: '3) Search for specific phrase',
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
      log: '4) Search by translation in phrase',
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
      log: '5) Search by translation in translation',
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
      log: '6) Search by cultural note in phrase',
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
      log: '7) Search by cultural note in cultural note',
    },
  }

  cy.log(_searchConfig.search1.log)
  cy.browseSearch(_searchConfig.search1)
  cy.log(_searchConfig.search2.log)
  cy.browseSearch(_searchConfig.search2)
  cy.log(_searchConfig.search3.log)
  cy.browseSearch(_searchConfig.search3)
  cy.log(_searchConfig.search4.log)
  cy.browseSearch(_searchConfig.search4)
  cy.log(_searchConfig.search5.log)
  cy.browseSearch(_searchConfig.search5)
  cy.log(_searchConfig.search6.log)
  cy.browseSearch(_searchConfig.search6)
  cy.log(_searchConfig.search7.log)
  cy.browseSearch(_searchConfig.search7)
}
export default testSearchPhrases
