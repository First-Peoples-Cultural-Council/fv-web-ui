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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCharacters } from 'reducers/fvCharacter'
import { fetchDialect2, updateDialect2 } from 'reducers/fvDialect'
import { fetchDocument } from 'reducers/document'
import { fetchPortal, updatePortal } from 'reducers/fvPortal'
import { navigateTo } from 'reducers/navigation'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import PromiseWrapper from 'components/PromiseWrapper'

import TextHeader from 'components/Typography/text-header'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PageDialectLearnBase from 'components/LearnBase'

import AlphabetListView from 'components/Alphabet/list-view'

import FVLabel from 'components/FVLabel'

import FVButton from 'components/FVButton'
import GridListTile from '@material-ui/core/GridListTile'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import Header from 'components/Header'
import ToolbarNavigation from 'components/LearnBase/toolbar-navigation'
import LearningSidebar from 'components/LearnBase/learning-sidebar'
import { SECTIONS } from 'common/Constants'

const { any, array, bool, func, object, string } = PropTypes
class AlphabetGridListTile extends Component {
  static propTypes = {
    tile: any, // TODO: set appropriate propType
  }
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <GridListTile
        key={selectn('uid', this.props.tile)}
        style={{
          border: '3px solid #e0e0e0',
          borderRadius: '5px',
          textAlign: 'center',
          paddingTop: '15px',
          width: '25%',
          height: '164px',
        }}
      >
        <span style={{ fontSize: '2em' }}>
          {selectn('properties.fvcharacter:upper_case_character', this.props.tile)}{' '}
          {selectn('properties.dc:title', this.props.tile)}
        </span>
        <br />
        <br />
        <strong style={{ fontSize: '1.3em' }}>
          {selectn('contextParameters.character.related_words[0].dc:title', this.props.tile)}
        </strong>
        <br />
        <>
          {selectn('contextParameters.character.related_words[0].fv:definitions[0].translation', this.props.tile) ||
            selectn(
              'contextParameters.character.related_words[0].fv:literal_translation[0].translation',
              this.props.tile
            )}
        </>
      </GridListTile>
    )
  }
}

/**
 * Learn alphabet
 */

export class PageDialectLearnAlphabet extends PageDialectLearnBase {
  static defaultProps = {
    print: false,
  }

  static propTypes = {
    routeParams: object.isRequired,
    print: bool,
    // REDUX: reducers/state
    computeCharacters: object.isRequired,
    computeDialect2: object.isRequired,
    computeDocument: object.isRequired,
    computePortal: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchCharacters: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    navigateTo: func.isRequired,
    pushWindowPath: func.isRequired,
    updateDialect2: func.isRequired,
    updatePortal: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      current_char: null,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', '_onCharAudioTouchTap'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')

    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary')

    newProps.fetchCharacters(
      newProps.routeParams.dialect_path + '/Alphabet',
      '&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )
  }

  _onCharAudioTouchTap(char) {
    const charElement = document.getElementById('charAudio' + char.uid)

    if (charElement) {
      document.getElementById('charAudio' + char.uid).play()
    }

    this.setState({
      current_char: char,
    })
  }

  _onNavigateRequest(path) {
    const destination = this.props.navigateTo(path)
    const newPathArray = this.props.splitWindowPath.slice()

    newPathArray.push(destination.path)

    this.props.pushWindowPath('/' + newPathArray.join('/'))
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this.props.routeParams.dialect_path + '/Portal',
        entity: this.props.computePortal,
      },
    ])

    // const _computeDocument = ProviderHelpers.getEntry(
    //   this.props.computeDocument,
    //   this.props.routeParams.dialect_path + '/Dictionary'
    // )
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const _computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )
    const _computeCharacters = ProviderHelpers.getEntry(
      this.props.computeCharacters,
      this.props.routeParams.dialect_path + '/Alphabet'
    )

    const isSection = this.props.routeParams.area === SECTIONS

    // NOTE: when in print view we use AlphabetListView
    if (this.props.print) {
      const alphabetListView = <AlphabetListView pagination={false} dialect={selectn('response', _computeDialect2)} />
      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row">
            <div className={classNames('col-xs-8', 'col-xs-offset-2')}>
              <h1>
                <FVLabel
                  transKey="views.pages.explore.dialect.learn.alphabet.x_alphabet"
                  defaultStr={selectn('response.title', _computeDialect2) + ' Alphabet'}
                  transform="words"
                  params={[selectn('response.title', _computeDialect2)]}
                />
              </h1>
              {React.cloneElement(alphabetListView, {
                gridListView: true,
                gridViewProps: { style: { overflowY: 'auto', maxHeight: '100%' } },
                gridListTile: AlphabetGridListTile,
                dialect: selectn('response', _computeDialect2),
              })}
            </div>
          </div>
        </PromiseWrapper>
      )
    }

    return (
      <PromiseWrapper computeEntities={computeEntities}>
        <Header
          portal={{ compute: _computePortal, update: this.props.updatePortal }}
          dialect={{ compute: _computeDialect2, update: this.props.updateDialect2 }}
          routeParams={this.props.routeParams}
        >
          <ToolbarNavigation hideStatistics />
        </Header>

        <div className={classNames('row', 'dialect-body-container')} style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-7')}>
            <div className="fontBCSans">
              <TextHeader
                title={this.props.intl.trans(
                  'views.pages.explore.dialect.learn.alphabet.x_alphabet',
                  selectn('response.title', _computeDialect2) + ' Alphabet',
                  null,
                  [selectn('response.title', _computeDialect2)]
                )}
                tag="h1"
                properties={this.props.properties}
                appendToTitle={
                  <a className="PrintHide" href="alphabet/print" target="_blank">
                    <i className="material-icons">print</i>
                  </a>
                }
              />
            </div>

            {(() => {
              if (this.state.current_char !== null) {
                return (
                  <FVButton
                    className="fontBCSans"
                    variant="contained"
                    color="primary"
                    onClick={this._onNavigateRequest.bind(
                      this,
                      this.state.current_char.path.split('/')[this.state.current_char.path.split('/').length - 1]
                    )}
                    style={{
                      minWidth: 'inherit',
                      textTransform: 'initial',
                      margin: '10px 0',
                    }}
                  >
                    {'View Words and Phrases that start with ' + this.state.current_char.title}
                  </FVButton>
                )
              }
            })()}

            {(() => {
              const characters = selectn('response.entries', _computeCharacters)

              if (characters && characters.length > 0) {
                const _this = this
                return (
                  <div style={{ marginBottom: '20px' }}>
                    {selectn('response.entries', _computeCharacters).map((char) => {
                      const text = <span className="fontBCSans">{char.title}</span>
                      const audioFile = selectn('contextParameters.character.related_audio[0].path', char)

                      return (
                        <FVButton
                          key={char.uid}
                          variant="text"
                          onClick={_this._onCharAudioTouchTap.bind(this, char)}
                          //onClick={this._onNavigateRequest.bind(this, char.path.split('/')[char.path.split('/').length - 1])}
                          className="alphabet__character"
                        >
                          {audioFile ? <PlayArrowIcon className="material-icons PrintHide" /> : null}
                          {text}

                          {audioFile && (
                            <audio id={'charAudio' + char.uid} src={NavigationHelpers.getBaseURL() + audioFile} />
                          )}
                        </FVButton>
                      )
                    })}
                  </div>
                )
              }
            })()}
          </div>

          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>
            <LearningSidebar
              isSection={isSection}
              properties={this.props.properties}
              dialect={{ compute: _computeDialect2, update: this.props.updateDialect2 }}
            />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvCharacter, fvDialect, fvPortal, navigation, windowPath, locale } = state

  const { computeCharacters } = fvCharacter
  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { properties } = navigation
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeCharacters,
    computeDialect2,
    computeDocument,
    computePortal,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCharacters,
  fetchDialect2,
  fetchDocument,
  fetchPortal,
  navigateTo,
  pushWindowPath,
  updateDialect2,
  updatePortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLearnAlphabet)
