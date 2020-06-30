import React, { Suspense } from 'react'
// import PropTypes from 'prop-types'
import WordsListPresentation from './WordsListPresentation'
import WordsListData from './WordsListData'

/**
 * @summary WordsListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordsListContainer() {
  return (
    <WordsListData>
      {({
        columns,
        computeSearchDialect,
        dialect,
        dialectClassName,
        fetcher,
        fetcherParams,
        handleSearch,
        items,
        listViewMode,
        metadata,
        navigationRouteSearch,
        pageTitle,
        pushWindowPath,
        resetSearch,
        routeParams,
        setListViewMode,
        setRouteParams,
        smallScreenTemplate,
        sortHandler,
      }) => {
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <WordsListPresentation
              computeSearchDialect={computeSearchDialect}
              dialectClassName={dialectClassName}
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
              searchUi={[
                {
                  defaultChecked: true,
                  idName: 'searchByTitle',
                  labelText: 'Word',
                },
                {
                  defaultChecked: true,
                  idName: 'searchByDefinitions',
                  labelText: 'Definitions',
                },
                {
                  idName: 'searchByTranslations',
                  labelText: 'Literal translations',
                },
                {
                  type: 'select',
                  idName: 'searchPartOfSpeech',
                  labelText: 'Parts of speech:',
                },
              ]}
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
          </Suspense>
        )
      }}
    </WordsListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
WordsListContainer.propTypes = {
  //   something: string,
}

export default WordsListContainer
