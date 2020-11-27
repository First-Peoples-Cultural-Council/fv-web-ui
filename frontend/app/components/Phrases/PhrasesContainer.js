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

// FPCC
// -------------------------------------------
import AlphabetCharactersPresentation from 'components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'components/AlphabetCharacters/AlphabetCharactersData'
import CategoriesData from 'components/Categories/CategoriesData'
import DialectFilterListData from 'components/DialectFilterList/DialectFilterListData'
import DialectFilterListPresentation from 'components/DialectFilterList/DialectFilterListPresentation'
import PhrasesList from 'components/PhrasesList'
import PhrasesData from 'components/Phrases/PhrasesData'

import { SEARCH_DATA_TYPE_PHRASE } from 'common/Constants'
import PromiseWrapper from 'components/PromiseWrapper'

function PhrasesContainer() {
  return (
    <PhrasesData>
      {({ computeEntities, handleAlphabetClick, intl, splitWindowPath }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
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
                <CategoriesData fetchPhraseBooks>
                  {({ categoriesData }) => {
                    let categoriesDataToRender = null
                    if (categoriesData && categoriesData.length > 0) {
                      categoriesDataToRender = (
                        <DialectFilterListData filterListData={categoriesData} queryParam="phraseBook">
                          {({ listItemData }) => {
                            return (
                              <DialectFilterListPresentation
                                title={intl.trans(
                                  'views.pages.explore.dialect.learn.phrases.browse_by_phrase_books',
                                  'Browse Phrasebooks',
                                  'phrases'
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
                <PhrasesList.Container searchDialectDataType={SEARCH_DATA_TYPE_PHRASE} />
              </div>
            </div>
          </PromiseWrapper>
        )
      }}
    </PhrasesData>
  )
}

export default PhrasesContainer
