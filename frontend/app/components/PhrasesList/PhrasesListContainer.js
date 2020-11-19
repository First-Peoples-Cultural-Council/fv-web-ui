import React from 'react'
import PropTypes from 'prop-types'
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
function PhrasesListContainer({ searchDialectDataType }) {
  return (
    <PhrasesListData searchDialectDataType={searchDialectDataType}>
      {({
        columns,
        computeEntities,
        dialect,
        dialectClassName,
        entryType,
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
        searchUi,
        setListViewMode,
        setRouteParams,
        smallScreenTemplate,
        sortHandler,
      }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <PhrasesListPresentation
              dialectClassName={dialectClassName}
              entryType={entryType}
              filter={filter}
              handleCreateClick={handleCreateClick}
              wordsListClickHandlerViewMode={setListViewMode}
              dictionaryListViewMode={listViewMode}
              smallScreenTemplate={smallScreenTemplate}
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
// PROPTYPES
const { number } = PropTypes
PhrasesListContainer.propTypes = {
  searchDialectDataType: number.isRequired,
}

export default PhrasesListContainer
