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
import React from 'react'
import selectn from 'selectn'
// import Immutable from 'immutable'

// FPCC
// -------------------------------------------
import AlphabetCharactersPresentation from 'views/components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'views/components/AlphabetCharacters/AlphabetCharactersData'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import CategoriesData from 'components/Categories/CategoriesData'
import DialectFilterListData from 'views/components/DialectFilterList/DialectFilterListData'
import DialectFilterListPresentation from 'views/components/DialectFilterList/DialectFilterListPresentation'
import WordsList from 'components/WordsList'
import FVLabel from 'views/components/FVLabel/index'
import WordsData from './WordsData'

import NavigationHelpers, { appendPathArrayAfterLandmark, hasPagination } from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

function WordsContainer() {
  return (
    <WordsData>
      {({
        computeDocument,
        computeEntities,
        computeLogin,
        handleCategoryClick,
        handleAlphabetClick,
        intl,
        onNavigateRequest,
        pushWindowPath,
        routeParams,
        splitWindowPath,
      }) => {
        const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
        const wordsPage =
          computedDocument && computedDocument.response ? (
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
                      handleAlphabetClick(href, updateHistory)
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
                  <CategoriesData>
                    {({ categoriesData }) => {
                      let categoriesDataToRender = null
                      if (categoriesData && categoriesData.length > 0) {
                        categoriesDataToRender = (
                          <DialectFilterListData
                            selectedCategoryId={routeParams.category}
                            setDialectFilterCallback={handleCategoryClick}
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
                      return categoriesDataToRender
                    }}
                  </CategoriesData>
                </div>

                <div className="col-xs-12 col-md-9">
                  <WordsList.Container />
                </div>
              </div>
            </>
          ) : null
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            {wordsPage}
          </PromiseWrapper>
        )
      }}
    </WordsData>
  )
}

export default WordsContainer
