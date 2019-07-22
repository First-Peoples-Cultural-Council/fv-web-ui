export const testSearch = () => {
  cy.log("1) Search 'a'; Word, Definitions; confirm data; paginate; reset")
  cy.browseSearch({
    term: 'a',
    searchWord: true,
    searchDefinitions: true,
    confirmData: true,
    shouldPaginate: true,
    clearFilter: true,
  })

  cy.log("2) Search 'k̓ak̓ack̓ana'; only Definitions; confirm no data; no reset")
  cy.browseSearch({
    term: 'k̓ak̓ack̓ana',
    searchWord: false,
    searchDefinitions: true,
    confirmData: false,
    confirmNoData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("3) Search 'k̓ak̓ack̓ana'; Word & Definitions; confirm data; no pagination, reset")
  cy.browseSearch({
    term: 'k̓ak̓ack̓ana',
    searchWord: true,
    searchDefinitions: true,
    confirmData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("4) Search 'wrist', Only Word; confirm no data; no reset")
  cy.browseSearch({
    term: 'wrist',
    searchWord: true,
    searchDefinitions: false,
    confirmData: false,
    confirmNoData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("5) Search 'wrist', Word & Definitions; confirm data; no pagination, reset")
  cy.browseSearch({
    term: 'wrist',
    searchWord: true,
    searchDefinitions: true,
    confirmData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("6) Search 'refers to other', Only Definitions; confirm no data; no reset")
  cy.browseSearch({
    term: 'refers to other',
    searchWord: false,
    searchDefinitions: true,
    confirmData: false,
    confirmNoData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("7) Search 'refers to other', Only Literal translations; confirm data; no pagination, reset")
  cy.browseSearch({
    term: 'refers to other',
    searchWord: false,
    searchDefinitions: false,
    searchLiteralTranslations: true,
    confirmData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("8) Search (nothing), Word & Parts of speech = 'Particle - Modal'; confirm no data; no reset")
  cy.browseSearch({
    searchWord: true,
    searchDefinitions: true,
    searchPartsOfSpeech: 'Particle - Modal',
    searchingText: 'Showing all words',
    confirmData: false,
    confirmNoData: true,
    shouldPaginate: false,
    clearFilter: false,
  })

  cy.log("9) Search (nothing), Word & Parts of speech = 'Noun'; confirm data")
  cy.browseSearch({
    searchWord: true,
    searchDefinitions: true,
    searchPartsOfSpeech: 'Noun',
    searchingText: 'Showing all words',
    confirmData: true,
    shouldPaginate: false,
    clearFilter: true,
  })
}
export default testSearch
