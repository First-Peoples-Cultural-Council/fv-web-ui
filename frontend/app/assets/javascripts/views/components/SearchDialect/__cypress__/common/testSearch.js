export const testSearch = (searchConfig) => {
  const _searchConfig = Object.assign(
    {
      search1: {
        term: 'TestTranslation',
        searchWord: true,
        searchDefinitions: true,
        confirmData: true,
        shouldPaginate: true,
        clearFilter: true,
        log: "1) Search 'TestTranslation'; Word, Definitions; confirm data; paginate; reset",
      },
      search2: {
        term: 'Dog',
        searchWord: false,
        searchDefinitions: true,
        confirmData: false,
        confirmNoData: true,
        shouldPaginate: false,
        clearFilter: false,
        log: "2) Search 'Dog'; only Definitions; confirm no data; no reset",
      },
      search3: {
        term: 'Dog',
        searchWord: true,
        searchDefinitions: true,
        confirmData: true,
        shouldPaginate: false,
        clearFilter: false,
        log: "3) Search 'Dog'; Word & Definitions; confirm data; no pagination, reset",
      },
      search4: {
        term: 'TestTranslation',
        searchWord: true,
        searchDefinitions: false,
        confirmData: false,
        confirmNoData: true,
        shouldPaginate: false,
        clearFilter: false,
        log: "4) Search 'TestTranslation', Only Word; confirm no data; no reset",
      },
      search5: {
        term: 'Tiger',
        searchWord: true,
        searchDefinitions: true,
        confirmData: true,
        shouldPaginate: false,
        clearFilter: false,
        log: "5) Search 'Tiger', Word & Definitions; confirm data; no pagination, reset",
      },
      search6: {
        term: 'Tiger',
        searchWord: false,
        searchDefinitions: true,
        confirmData: false,
        confirmNoData: true,
        shouldPaginate: false,
        clearFilter: false,
        log: "6) Search 'Tiger', Only Definitions; confirm no data; no reset",
      },
      search7: {
        term: 'TestLiteralTranslation',
        searchWord: false,
        searchDefinitions: false,
        searchLiteralTranslations: true,
        confirmData: true,
        shouldPaginate: false,
        clearFilter: false,
        log: "7) Search 'TestLiteralTranslation', Only Literal translations; confirm data; no pagination, reset",
      },
    },
    searchConfig
  )
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
export default testSearch
