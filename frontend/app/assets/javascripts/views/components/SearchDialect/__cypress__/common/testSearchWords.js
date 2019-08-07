export const testSearchWords = (searchConfig) => {
  const _searchConfig = Object.assign(
    {
      search8: {
        searchWord: true,
        searchDefinitions: true,
        searchPartsOfSpeech: 'Particle - Modal',
        searchingText: 'Showing all words',
        confirmData: false,
        confirmNoData: true,
        shouldPaginate: false,
        clearFilter: false,
      },
      search9: {
        searchWord: true,
        searchDefinitions: true,
        searchPartsOfSpeech: 'Noun',
        searchingText: 'Showing all words',
        confirmData: true,
        shouldPaginate: false,
        clearFilter: true,
      },
    },
    searchConfig
  )
  cy.log("8) Search (nothing), Word & Parts of speech = 'Particle - Modal'; confirm no data; no reset")
  cy.browseSearch(_searchConfig.search8)

  cy.log("9) Search (nothing), Word & Parts of speech = 'Noun'; confirm data")
  cy.browseSearch(_searchConfig.search9)
}
export default testSearchWords
