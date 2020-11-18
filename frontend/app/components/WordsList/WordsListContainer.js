import React, { Suspense } from 'react'
// import PropTypes from 'prop-types'
import WordsListPresentation from './WordsListPresentation'
import WordsListData from './WordsListData'
import PromiseWrapper from 'components/PromiseWrapper'

const SearchDialectMessage = React.lazy(() => import('components/SearchDialect/SearchDialectMessage'))
const SearchDialectContainer = React.lazy(() => import('components/SearchDialect/SearchDialectContainer'))
const SearchDialectCheckbox = React.lazy(() => import('components/SearchDialect/SearchDialectCheckbox'))
const SearchDialectSelect = React.lazy(() => import('components/SearchDialect/SearchDialectSelect'))
import {
  SEARCHDIALECT_CHECKBOX,
  SEARCHDIALECT_SELECT,
  // SEARCH_PART_OF_SPEECH_ANY,
  // SEARCH_BY_ALPHABET,
  // SEARCH_BY_CATEGORY,
  // SEARCH_BY_CUSTOM,
  // SEARCH_BY_PHRASE_BOOK,
  // SEARCH_DATA_TYPE_PHRASE,
  SEARCH_DATA_TYPE_WORD,
  // SEARCH_TYPE_DEFAULT_SEARCH,
  // SEARCH_TYPE_APPROXIMATE_SEARCH,
  // SEARCH_TYPE_EXACT_SEARCH,
  // SEARCH_TYPE_CONTAINS_SEARCH,
  // SEARCH_TYPE_STARTS_WITH_SEARCH,
  // SEARCH_TYPE_ENDS_WITH_SEARCH,
  // SEARCH_TYPE_WILDCARD_SEARCH,
} from 'common/Constants'

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
        hrefCreate,
        incrementResetCount,
        items,
        listViewMode,
        metadata,
        navigationRouteSearch,
        pageTitle,
        pushWindowPath,
        resetCount,
        routeParams,
        searchUiSecondary,
        setListViewMode,
        setRouteParams,
        smallScreenTemplate,
        sortHandler,
        queryCategory,
        queryLetter,
        querySearchByDefinitions,
        querySearchByTitle,
        querySearchByTranslations,
        querySearchPartOfSpeech,
        querySearchStyle,
        querySearchTerm,
        browseMode,
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
              childrenSearch={
                <Suspense fallback={<div>loading...</div>}>
                  <SearchDialectContainer
                    key={`forceRender${resetCount}`}
                    incrementResetCount={incrementResetCount}
                    browseMode={browseMode}
                    childrenSearchMessage={
                      <SearchDialectMessage
                        dialectClassName={dialectClassName}
                        letter={queryLetter}
                        category={queryCategory}
                        partOfSpeech={querySearchPartOfSpeech}
                        searchStyle={querySearchStyle}
                        searchTerm={querySearchTerm}
                        shouldSearchCulturalNotes // TODO: is this a bug?
                        shouldSearchDefinitions={querySearchByDefinitions}
                        shouldSearchLiteralTranslations={querySearchByTranslations}
                        shouldSearchTitle={querySearchByTitle}
                        searchDialectDataType={SEARCH_DATA_TYPE_WORD}
                      />
                    }
                    childrenUiSecondary={searchUiSecondary.map(
                      ({ defaultChecked, defaultValue, idName, labelText, options, type }, index) => {
                        switch (type) {
                          case SEARCHDIALECT_CHECKBOX:
                            return (
                              <SearchDialectCheckbox
                                key={index}
                                defaultChecked={defaultChecked}
                                idName={idName}
                                labelText={labelText}
                              />
                            )
                          case SEARCHDIALECT_SELECT: {
                            return (
                              <SearchDialectSelect
                                key={`forceRenderSelect${resetCount}`}
                                defaultValue={defaultValue}
                                idName={idName}
                                labelText={labelText}
                              >
                                {options.map(({ value, text }, key) => {
                                  return (
                                    <option key={key} value={value} disabled={value === null}>
                                      {text}
                                    </option>
                                  )
                                })}
                              </SearchDialectSelect>
                            )
                          }
                          default:
                            return null
                        }
                      }
                    )}
                    searchDialectDataType={SEARCH_DATA_TYPE_WORD}
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
    </WordsListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
WordsListContainer.propTypes = {
  //   something: string,
}

export default WordsListContainer
