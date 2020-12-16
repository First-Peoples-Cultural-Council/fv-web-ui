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
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2, updateDialect2 } from 'reducers/fvDialect'
import { fetchDocument } from 'reducers/document'
import { fetchPortal, updatePortal } from 'reducers/fvPortal'

import GridListTile from '@material-ui/core/GridListTile'

import PromiseWrapper from 'components/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import PageDialectLearnBase from 'components/LearnBase'
import AlphabetListView from 'components/Alphabet/list-view'
import FVLabel from 'components/FVLabel'
import Header from 'components/Header'
import ToolbarNavigation from 'components/LearnBase/toolbar-navigation'
import AlphabetContainer from 'components/Alphabet/AlphabetContainer'

const { any, bool, func, object } = PropTypes
class AlphabetGridListTile extends Component {
  static propTypes = {
    tile: any, // TODO: set appropriate propType
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
    computeDialect2: object.isRequired,
    computeDocument: object.isRequired,
    computePortal: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    updateDialect2: func.isRequired,
    updatePortal: func.isRequired,
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary')
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
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const _computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

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
        <AlphabetContainer dialect={{ compute: _computeDialect2, update: this.props.updateDialect2 }} />
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvDialect, fvPortal } = state

  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { computeDialect2 } = fvDialect

  return {
    computeDialect2,
    computeDocument,
    computePortal,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchDocument,
  fetchPortal,
  updateDialect2,
  updatePortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLearnAlphabet)
