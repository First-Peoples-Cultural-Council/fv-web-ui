/*
Copyright 2016 First People's Cultural Council

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
import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import UIHelpers from 'common/UIHelpers'

import FVLabel from 'components/FVLabel'
import FVTab from 'components/FVTab'
import LiteralUnicodeData from 'components/LiteralUnicode/LiteralUnicodeData'
import LiteralUnicodePresentation from 'components/LiteralUnicode/LiteralUnicodePresentation'
import PageToolbar from 'components/PageToolbar'
import PhraseListView from 'components/PhrasesCreateEdit/list-view'
import Preview from 'components/Preview'
import PromiseWrapper from 'components/PromiseWrapper'
import WordListView from 'components/WordsCreateEdit/list-view'

import '!style-loader!css-loader!./AlphabetDetail.css'
/**
 * @summary AlphabetDetailPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {string} props.character Text of character
 * @param {object} props.computedCharacter See: PageToolbar > computeEntity
 * @param {object} props.computedDialect2 See: PageToolbar > computePermissionEntity & PhraseListView > dialect
 * @param {object} props.computeEntities See: PromiseWrapper
 * @param {object} props.computeLogin See: PageToolbar > computeLogin
 * @param {object} props.currentAppliedFilter See: WordListView > filter & PhraseListView > filter
 * @param {object} props.intl Intl service used in multiple locations/components
 * @param {func} props.onNavigateRequest See: PageToolbar > handleNavigateRequest
 * @param {func} props.publishChangesAction See: PageToolbar > publishChangesAction
 * @param {array} props.relatedAudio Populates Related Audio section: [{}]
 * @param {array} props.relatedVideos Populates Related Video section: [{}]
 * @param {array} props.relatedWords Populates Related Words section: [{uid, onClick, hrefPath, title}]
 * @param {object} props.routeParams See: WordListView > routeParams & PhraseListView > routeParams
 * @param {boolean} props.shouldRenderPageToolbar Bool to render the Workspace Toolbar
 * @param {func} props.tabsOnChange See: FVTab > tabsOnChange
 * @param {number} props.tabValue Controls rendering of selected tab, also see: FVTab > tabsValue
 *
 * @returns {node} jsx markup
 */
function AlphabetDetailPresentation({
  character,
  computedCharacter,
  computedDialect2,
  computeEntities,
  computeLogin,
  currentAppliedFilter,
  intl,
  onNavigateRequest,
  publishChangesAction,
  relatedAudio,
  relatedVideos,
  relatedWords,
  routeParams,
  shouldRenderPageToolbar,
  tabsOnChange,
  tabValue,
}) {
  return (
    <PromiseWrapper computeEntities={computeEntities}>
      {shouldRenderPageToolbar && (
        <div className="row">
          <PageToolbar
            label={intl.trans('character', 'Character', 'first')}
            handleNavigateRequest={onNavigateRequest}
            computeEntity={computedCharacter}
            computePermissionEntity={computedDialect2}
            computeLogin={computeLogin}
            actions={['edit', 'publish']}
            publishChangesAction={publishChangesAction}
            // {...props}
          />
        </div>
      )}
      <div className="row">
        <div className="col-xs-12">
          <div>
            <Card>
              <FVTab
                tabItems={[
                  { label: intl.trans('definition', 'Definition', 'first') },
                  {
                    label: UIHelpers.isViewSize('xs')
                      ? intl.trans('words', 'Words', 'first')
                      : intl.trans(
                          'views.pages.explore.dialect.learn.alphabet.words_starting_with_x',
                          'Words Starting with ' + character,
                          'words',
                          [character]
                        ),
                    id: 'find_words',
                    className: 'fontBCSans',
                  },
                  {
                    label: UIHelpers.isViewSize('xs')
                      ? intl.trans('phrases', 'Phrases', 'first')
                      : intl.trans(
                          'views.pages.explore.dialect.learn.alphabet.phrases_starting_with_x',
                          'Phrases Starting with ' + character,
                          'words',
                          [character]
                        ),
                    id: 'find_phrases',
                    className: 'fontBCSans',
                  },
                ]}
                tabsValue={tabValue}
                tabsOnChange={tabsOnChange}
              />

              {/* TAB: DEFINITION */}
              {tabValue === 0 && (
                <Typography component="div">
                  <CardContent>
                    <div className="fontBCSans">
                      <div className="AlphabetDetail__row">
                        <div className="AlphabetDetail__rowItem">
                          <Typography component="h2" variant="h5">
                            {character}
                          </Typography>
                        </div>
                      </div>

                      <div className="AlphabetDetail__row">
                        <div className="AlphabetDetail__rowItem">
                          <h3>
                            <FVLabel transKey="audio" defaultStr="Audio" transform="first" />
                          </h3>

                          <div>
                            {relatedAudio.length === 0 ? (
                              <span>
                                <FVLabel
                                  transKey="views.pages.explore.dialect.learn.words.no_audio_yet"
                                  defaultStr="No audio is available yet"
                                  transform="first"
                                />
                                .
                              </span>
                            ) : (
                              relatedAudio.map((audio) => {
                                return (
                                  <Preview
                                    styles={{ maxWidth: '350px' }}
                                    key={selectn('uid', audio)}
                                    expandedValue={audio}
                                    type="FVAudio"
                                  />
                                )
                              })
                            )}
                          </div>
                        </div>

                        {relatedVideos.length > 0 && (
                          <div className="AlphabetDetail__rowItem">
                            <h3>
                              <FVLabel transKey="video" defaultStr="Video" transform="first" />
                            </h3>
                            {relatedVideos.map((video, key) => {
                              return (
                                <Preview
                                  styles={{ maxWidth: '350px' }}
                                  key={`video${key}`}
                                  expandedValue={video}
                                  type="FVVideo"
                                />
                              )
                            })}
                          </div>
                        )}

                        {relatedWords.length !== 0 && (
                          <div className="AlphabetDetail__rowItem">
                            <h3>
                              <FVLabel transKey="featured_words" defaultStr="Featured Words" transform="words" />:
                            </h3>
                            <ul>
                              {relatedWords.map(({ uid, hrefPath, onClick, title }) => {
                                return (
                                  <li key={uid}>
                                    <a href={hrefPath} onClick={onClick}>
                                      {title}
                                    </a>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}

                        {character && (
                          <LiteralUnicodeData character={character}>
                            {(literalUnicode) => (
                              <LiteralUnicodePresentation
                                literalUnicode={literalUnicode}
                                className="AlphabetDetail__rowItem"
                              />
                            )}
                          </LiteralUnicodeData>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Typography>
              )}

              {/* TAB: WORDS */}
              {tabValue === 1 && (
                <Typography component="div" style={{ padding: 8 * 3 }}>
                  <div className="fontBCSans">
                    <CardContent>
                      <h2>
                        <FVLabel
                          transKey="views.pages.explore.dialect.learn.alphabet.words_starting_with_x"
                          defaultStr={'Words Starting with ' + character}
                          transform="words"
                          params={[character]}
                        />
                      </h2>
                      <div className="row">
                        <WordListView
                          filter={currentAppliedFilter}
                          routeParams={routeParams}
                          disableClickItem={false}
                        />
                      </div>
                    </CardContent>
                  </div>
                </Typography>
              )}

              {tabValue === 2 && (
                <Typography component="div" style={{ padding: 8 * 3 }}>
                  <div className="fontBCSans">
                    <CardContent>
                      <h2>
                        <FVLabel
                          transKey="views.pages.explore.dialect.learn.alphabet.phrases_starting_with_x"
                          defaultStr={'Phrases Starting with ' + character}
                          transform="words"
                          params={[character]}
                        />
                      </h2>
                      <div className="row">
                        <PhraseListView
                          dialect={selectn('response', computedDialect2)}
                          filter={currentAppliedFilter}
                          routeParams={routeParams}
                          disableClickItem={false}
                        />
                      </div>
                    </CardContent>
                  </div>
                </Typography>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PromiseWrapper>
  )
}
// PROPTYPES
const { array, func, boolean, number, string, object } = PropTypes
AlphabetDetailPresentation.propTypes = {
  character: string,
  computedCharacter: object,
  computedDialect2: object,
  computeEntities: object,
  computeLogin: object,
  currentAppliedFilter: object,
  intl: object,
  onNavigateRequest: func,
  publishChangesAction: func,
  relatedAudio: array,
  relatedVideos: array,
  relatedWords: array,
  routeParams: object,
  shouldRenderPageToolbar: boolean,
  tabsOnChange: func,
  tabValue: number,
}

export default AlphabetDetailPresentation
