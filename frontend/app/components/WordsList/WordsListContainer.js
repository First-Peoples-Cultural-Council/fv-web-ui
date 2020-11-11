import React from 'react'
// import PropTypes from 'prop-types'
import WordsListPresentation from './WordsListPresentation'
import WordsListData from './WordsListData'
import PromiseWrapper from 'components/PromiseWrapper'

/**
 * @summary WordsListContainer
 * @version 1.0.1
 * @component
 *
 *
 * @returns {node} jsx markup
 */
function WordsListContainer() {
  return (
    <WordsListData>
      {({
        columns,
        computeEntities,
        dialect,
        dialectClassName,
        fetcher,
        fetcherParams,
        filter,
        handleSearch,
        hrefCreate,
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
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <WordsListPresentation
              dialectClassName={dialectClassName}
              filter={filter}
              hrefCreate={hrefCreate}
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
          </PromiseWrapper>
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
