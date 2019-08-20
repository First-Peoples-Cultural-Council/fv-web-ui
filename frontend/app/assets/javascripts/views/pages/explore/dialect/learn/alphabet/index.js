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
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchDialect2, updateDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal, updatePortal } from 'providers/redux/reducers/fvPortal'
import { navigateTo } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import TextHeader from 'views/components/Document/Typography/text-header'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import AlphabetListView from 'views/pages/explore/dialect/learn/alphabet/list-view'

import Paper from 'material-ui/lib/paper'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import GridTile from 'material-ui/lib/grid-list/grid-tile'

import Header from 'views/pages/explore/dialect/header'
import ToolbarNavigation from 'views/pages/explore/dialect/learn/base/toolbar-navigation'
import LearningSidebar from 'views/pages/explore/dialect/learn/base/learning-sidebar'
import IntlService from 'views/services/intl'
import { SECTIONS } from 'common/Constants'
const intl = IntlService.instance
const { any, array, bool, func, object, string } = PropTypes
class AlphabetGridTile extends Component {
  static propTypes = {
    tile: any, // TODO: set appropriate propType
  }
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <GridTile
        key={selectn('uid', this.props.tile)}
        style={{
          border: '3px solid #e0e0e0',
          borderRadius: '5px',
          textAlign: 'center',
          paddingTop: '15px',
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
        {selectn('contextParameters.character.related_words[0].fv:definitions[0].translation', this.props.tile) ||
          selectn(
            'contextParameters.character.related_words[0].fv:literal_translation[0].translation',
            this.props.tile
          )}
      </GridTile>
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
    computeLogin: object.isRequired,
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

    const alphabetListView = <AlphabetListView pagination={false} dialect={selectn('response', _computeDialect2)} />

    if (this.props.print) {
      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row">
            <div className={classNames('col-xs-8', 'col-xs-offset-2')}>
              <h1>
                {intl.trans(
                  'views.pages.explore.dialect.learn.alphabet.x_alphabet',
                  selectn('response.title', _computeDialect2) + ' Alphabet',
                  'words',
                  [selectn('response.title', _computeDialect2)]
                )}
              </h1>
              {React.cloneElement(alphabetListView, {
                gridListView: true,
                gridViewProps: { style: { overflowY: 'auto', maxHeight: '100%' } },
                gridListTile: AlphabetGridTile,
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
          login={this.props.computeLogin}
          routeParams={this.props.routeParams}
        >
          <ToolbarNavigation showStats={this._showStats} routeParams={this.props.routeParams} />
        </Header>

        <div className={classNames('row', 'dialect-body-container')} style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-7')}>
            <div className="fontAboriginalSans">
              <TextHeader
                title={intl.trans(
                  'views.pages.explore.dialect.learn.alphabet.x_alphabet',
                  selectn('response.title', _computeDialect2) + ' Alphabet',
                  null,
                  [selectn('response.title', _computeDialect2)]
                )}
                tag="h1"
                properties={this.props.properties}
                appendToTitle={
                  <a href="alphabet/print" target="_blank">
                    <i className="material-icons">print</i>
                  </a>
                }
              />
            </div>

            {(() => {
              if (this.state.current_char !== null) {
                return (
                  <RaisedButton
                    primary
                    label={'View Words and Phrases that start with ' + this.state.current_char.title}
                    onClick={this._onNavigateRequest.bind(
                      this,
                      this.state.current_char.path.split('/')[this.state.current_char.path.split('/').length - 1]
                    )}
                    style={{ minWidth: 'inherit', textTransform: 'initial', margin: '10px 0' }}
                  />
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
                      const text = <span className="fontAboriginalSans">{char.title}</span>
                      const audioFile = selectn('contextParameters.character.related_audio[0].path', char)

                      return (
                        <Paper
                          key={char.uid}
                          style={{
                            textAlign: 'center',
                            margin: '5px',
                            padding: '5px 10px',
                            width: '100px',
                            display: 'inline-block',
                          }}
                        >
                          <FlatButton
                            icon={audioFile ? <FontIcon className="material-icons">play_arrow</FontIcon> : ''}
                            onClick={_this._onCharAudioTouchTap.bind(this, char)}
                            //onClick={this._onNavigateRequest.bind(this, char.path.split('/')[char.path.split('/').length - 1])}
                            label={text}
                            style={{ minWidth: 'inherit', textTransform: 'initial' }}
                          />
                          {audioFile ? (
                            <span>
                              <audio id={'charAudio' + char.uid} src={NavigationHelpers.getBaseURL() + audioFile} />
                            </span>
                          ) : (
                            ''
                          )}
                        </Paper>
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
  const { document, fvCharacter, fvDialect, fvPortal, navigation, nuxeo, windowPath } = state

  const { computeCharacters } = fvCharacter
  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeCharacters,
    computeDialect2,
    computeDocument,
    computeLogin,
    computePortal,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectLearnAlphabet)
