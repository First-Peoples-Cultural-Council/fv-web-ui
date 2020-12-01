import React, { Suspense } from 'react'
import PhrasesListPresentation from './PhrasesListPresentation'
import PhrasesListData from './PhrasesListData'
import PromiseWrapper from 'components/PromiseWrapper'

const SearchDialectMessage = React.lazy(() => import('components/SearchDialect/SearchDialectMessage'))
const SearchDialectContainer = React.lazy(() => import('components/SearchDialect/SearchDialectContainer'))
const SearchDialectCheckbox = React.lazy(() => import('components/SearchDialect/SearchDialectCheckbox'))
import { SEARCHDIALECT_CHECKBOX, SEARCH_DATA_TYPE_PHRASE } from 'common/Constants'
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
        browseMode,
        checkboxNames,
        columns,
        computeEntities,
        dialect,
        dialectClassName,
        fetcher,
        fetcherParams,
        filter,
        hrefCreate,
        incrementResetCount,
        items,
        listViewMode,
        metadata,
        navigationRouteSearch,
        onClickCreate,
        pageTitle,
        pushWindowPath,
        queryLetter,
        queryPhraseBook,
        querySearchByCulturalNotes,
        querySearchByDefinitions,
        querySearchByTitle,
        querySearchStyle,
        querySearchTerm,
        resetCount,
        routeParams,
        searchUiSecondary,
        setListViewMode,
        setRouteParams,
        sortHandler,
      }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <PhrasesListPresentation
              dialectClassName={dialectClassName}
              filter={filter}
              hrefCreate={hrefCreate}
              clickHandlerViewMode={setListViewMode}
              dictionaryListViewMode={listViewMode}
              pageTitle={pageTitle}
              dialect={dialect}
              navigationRouteSearch={navigationRouteSearch}
              onClickCreate={onClickCreate}
              pushWindowPath={pushWindowPath}
              routeParams={routeParams}
              setRouteParams={setRouteParams}
              // ==================================================
              // Search
              // --------------------------------------------------
              childrenSearch={
                <Suspense fallback={<div>loading...</div>}>
                  <SearchDialectContainer
                    checkboxNames={checkboxNames}
                    key={`forceRender${resetCount}`}
                    incrementResetCount={incrementResetCount}
                    browseMode={browseMode}
                    childrenSearchMessage={
                      <SearchDialectMessage
                        dialectClassName={dialectClassName}
                        letter={queryLetter}
                        phraseBook={queryPhraseBook}
                        searchStyle={querySearchStyle}
                        searchTerm={querySearchTerm}
                        shouldSearchCulturalNotes={querySearchByCulturalNotes}
                        shouldSearchDefinitions={querySearchByDefinitions}
                        shouldSearchTitle={querySearchByTitle}
                        searchDialectDataType={SEARCH_DATA_TYPE_PHRASE}
                      />
                    }
                    childrenUiSecondary={searchUiSecondary.map(({ defaultChecked, idName, labelText, type }, index) => {
                      if (type === SEARCHDIALECT_CHECKBOX) {
                        return (
                          <SearchDialectCheckbox
                            key={index}
                            defaultChecked={defaultChecked}
                            idName={idName}
                            labelText={labelText}
                          />
                        )
                      }
                      return null
                    })}
                    searchDialectDataType={SEARCH_DATA_TYPE_PHRASE}
                  />
                </Suspense>
              }
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
