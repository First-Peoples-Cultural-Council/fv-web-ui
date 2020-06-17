/* Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// 3rd party
// -------------------------------------------
import React, { Component, Suspense } from 'react'
import selectn from 'selectn'

// FPCC
// -------------------------------------------
import AlphabetCharactersPresentation from 'views/components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'views/components/AlphabetCharacters/AlphabetCharactersData'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import CategoriesDataLayer from 'views/pages/explore/dialect/learn/words/categoriesDataLayer'
import DialectFilterListData from 'views/components/DialectFilterList/DialectFilterListData'
import DialectFilterListPresentation from 'views/components/DialectFilterList/DialectFilterListPresentation'
import DictionaryListData from 'views/components/Browsing/DictionaryListData'
import FVLabel from 'views/components/FVLabel/index'
import WordsData from 'views/pages/explore/dialect/learn/words/WordsData'

import NavigationHelpers, { appendPathArrayAfterLandmark, hasPagination } from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'

const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))

class WordsLayout extends Component {
  render() {
    return (
      <WordsData>
        {({
          changeFilter,
          computeDocument,
          computeLogin,
          dialectFilterListWillUnmount, // TODO: why this can't be handled by setDialectFilter?
          filterInfo,
          intl,
          isKidsTheme,
          onNavigateRequest,
          pushWindowPath,
          resetSearch,
          routeParams,
          setDialectFilter,
          splitWindowPath,
        }) => {
          const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
          return (
            <>
              <div className="row row-create-wrapper">
                <div className="col-xs-12 col-md-4 col-md-offset-8 text-right">
                  <AuthorizationFilter
                    filter={{
                      entity: selectn('response', computedDocument),
                      login: computeLogin,
                      role: ['Record', 'Approve', 'Everything'],
                    }}
                    hideFromSections
                    routeParams={routeParams}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const url = appendPathArrayAfterLandmark({
                          pathArray: ['create'],
                          splitWindowPath: splitWindowPath,
                        })
                        if (url) {
                          NavigationHelpers.navigate(`/${url}`, pushWindowPath, false)
                        } else {
                          onNavigateRequest({
                            hasPagination,
                            path: 'create',
                            pushWindowPath,
                            splitWindowPath,
                          })
                        }
                      }}
                      className="PrintHide buttonRaised"
                    >
                      <FVLabel
                        transKey="views.pages.explore.dialect.learn.words.create_new_word"
                        defaultStr="Create New Word"
                        transform="words"
                      />
                    </button>
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-3 PrintHide">
                  <AlphabetCharactersData
                    letterClickedCallback={({ href, updateHistory }) => {
                      changeFilter(href, updateHistory)
                    }}
                  >
                    {({ activeLetter, characters, generateAlphabetCharacterHref, letterClicked, dialectClassName }) => {
                      return (
                        <AlphabetCharactersPresentation
                          activeLetter={activeLetter}
                          characters={characters}
                          dialectClassName={dialectClassName}
                          generateAlphabetCharacterHref={generateAlphabetCharacterHref}
                          letterClicked={letterClicked}
                          splitWindowPath={splitWindowPath}
                        />
                      )
                    }}
                  </AlphabetCharactersData>
                  <CategoriesDataLayer>
                    {({ categoriesData }) => {
                      let categoriesDataLayerToRender = null
                      if (categoriesData && categoriesData.length > 0) {
                        categoriesDataLayerToRender = (
                          <DialectFilterListData
                            appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
                            dialectFilterListWillUnmount={dialectFilterListWillUnmount}
                            setDialectFilterCallback={changeFilter}
                            setDialectFilter={setDialectFilter}
                            facets={categoriesData}
                            facetType="category"
                            type="words"
                            workspaceKey="fv-word:categories"
                          >
                            {({ listItemData }) => {
                              return (
                                <DialectFilterListPresentation
                                  title={intl.trans(
                                    'views.pages.explore.dialect.learn.words.browse_by_category',
                                    'Browse Categories',
                                    'words'
                                  )}
                                  listItemData={listItemData}
                                />
                              )
                            }}
                          </DialectFilterListData>
                        )
                      }
                      return categoriesDataLayerToRender
                    }}
                  </CategoriesDataLayer>
                </div>

                <div className="col-xs-12 col-md-9">
                  <DictionaryListData>
                    {({
                      columns,
                      dialect,
                      dialectClassName,
                      fetcher,
                      fetcherParams,
                      items,
                      listViewMode,
                      metadata,
                      pageTitle,
                      parentId,
                      setListViewMode,
                      smallScreenTemplate,
                      sortHandler,
                    }) => {
                      const wordsListView = parentId ? (
                        <Suspense fallback={<div>Loading...</div>}>
                          <DictionaryList
                            dictionaryListClickHandlerViewMode={setListViewMode}
                            dictionaryListViewMode={listViewMode}
                            dictionaryListSmallScreenTemplate={smallScreenTemplate}
                            flashcardTitle={pageTitle}
                            dialect={dialect}
                            // ==================================================
                            // Search
                            // --------------------------------------------------
                            handleSearch={changeFilter}
                            resetSearch={resetSearch}
                            hasSearch
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
                      ) : null

                      // Render kids or mobile view
                      if (isKidsTheme) {
                        const cloneWordsListView = wordsListView
                          ? React.cloneElement(wordsListView, {
                              DEFAULT_PAGE_SIZE: 8,
                              disablePageSize: true,
                              filter: filterInfo.setIn(
                                ['currentAppliedFilter', 'kids'],
                                ' AND fv:available_in_childrens_archive=1'
                              ),
                              gridListView: true,
                            })
                          : null

                        return (
                          <div className="row" style={{ marginTop: '15px' }}>
                            <div className={`col-xs-12 col-md-8 col-md-offset-2 ${dialectClassName}`}>
                              {cloneWordsListView}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <>
                          <h1 className="DialectPageTitle">{pageTitle}</h1>
                          <div className={dialectClassName}>{wordsListView}</div>
                        </>
                      )
                    }}
                  </DictionaryListData>
                </div>
              </div>
            </>
          )
        }}
      </WordsData>
    )
  }
}

export default WordsLayout
