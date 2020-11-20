import React from 'react'
import PhrasesListPresentation from './PhrasesListPresentation'
import PhrasesListData from './PhrasesListData'
import PromiseWrapper from 'components/PromiseWrapper'

/**
 * @summary PhrasesListContainer
 * @version 1.0.1
 * @component
 *
 *
 * @returns {node} jsx markup
 */
function PhrasesListContainer() {
  return (
    <PhrasesListData>
      {({
        columns,
        computeEntities,
        dialect,
        dialectClassName,
        fetcher,
        fetcherParams,
        filter,
        handleCreateClick,
        handleSearch,
        items,
        listViewMode,
        metadata,
        navigationRouteSearch,
        pageTitle,
        pushWindowPath,
        resetSearch,
        routeParams,
        searchDialectDataType,
        searchUi,
        setListViewMode,
        setRouteParams,
        sortHandler,
      }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <PhrasesListPresentation
              dialectClassName={dialectClassName}
              filter={filter}
              handleCreateClick={handleCreateClick}
              clickHandlerViewMode={setListViewMode}
              dictionaryListViewMode={listViewMode}
              pageTitle={pageTitle}
              dialect={dialect}
              navigationRouteSearch={navigationRouteSearch}
              pushWindowPath={pushWindowPath}
              routeParams={routeParams}
              setRouteParams={setRouteParams}
              // ==================================================
              // Search
              // --------------------------------------------------
              handleSearch={handleSearch}
              resetSearch={resetSearch}
              searchDialectDataType={searchDialectDataType}
              searchUi={searchUi}
              // ==================================================
              // Table data
              // --------------------------------------------------
              items={items}
              columns={columns}
              // ===============================================
              // Pagination
              // -----------------------------------------------
              hasPagination
              fetcher={fetcher}
              fetcherParams={fetcherParams}
              metadata={metadata}
              // ===============================================
              // Sort
              // -----------------------------------------------
              sortHandler={sortHandler}
              // ===============================================
            />
          </PromiseWrapper>
        )
      }}
    </PhrasesListData>
  )
}

export default PhrasesListContainer
