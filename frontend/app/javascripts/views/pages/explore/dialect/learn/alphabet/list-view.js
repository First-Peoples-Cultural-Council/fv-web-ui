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
import Immutable, { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

import DocumentListView from 'views/components/Document/DocumentListView'

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'

import Preview from 'views/components/Editor/Preview'

/**
 * List view for alphabet
 */

const { array, bool, func, number, object, string } = PropTypes
export class AlphabetListView extends DataListView {
  static propTypes = {
    data: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DISABLED_SORT_COLS: array,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    filter: object,
    gridListTile: func,
    gridListView: bool,
    gridViewProps: object,
    pagination: bool,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeCharacters: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchCharacters: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'related_audio'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fvcharacter:alphabet_order',
    DEFAULT_SORT_TYPE: 'asc',
    filter: new Map(),
    dialect: null,
    gridListView: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      columns: [
        {
          name: 'title',
          title: props.intl.trans('character', 'Character', 'first'),
          render: (v /*, data, cellProps*/) => v,
          sortName: 'fvcharacter:alphabet_order',
        },
        {
          name: 'fvcharacter:upper_case_character',
          title: props.intl.trans(
            'views.pages.explore.dialect.learn.alphabet.uppercase_character',
            'Uppercase Character',
            'words'
          ),
          render: (v, data, cellProps) => selectn('properties.' + cellProps.name, data),
          sortName: 'fvcharacter:alphabet_order',
        },
        {
          name: 'related_words',
          title: props.intl.trans('related_words', 'Related Words', 'words'),
          render: (v, data, cellProps) =>
            UIHelpers.renderComplexArrayRow(selectn('contextParameters.character.' + cellProps.name, data), (entry) => (
              <li key={selectn('uid', entry)}>{selectn('dc:title', entry)}</li>
            )),
          sortName: 'fv:literal_translation/0/translation',
        },
        {
          name: 'related_audio',
          title: props.intl.trans('audio', 'Audio', 'words'),
          render: (v, data, cellProps) => {
            const firstAudio = selectn('contextParameters.character.' + cellProps.name + '[0]', data)
            if (firstAudio)
              return (
                <Preview
                  minimal
                  tagStyles={{ width: '300px', maxWidth: '100%' }}
                  key={selectn('uid', firstAudio)}
                  expandedValue={firstAudio}
                  type="FVAudio"
                />
              )
          },
        },
      ],
      sortInfo: {
        uiSortOrder: [],
        currentSortCols: this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.DEFAULT_SORT_TYPE,
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE,
      },
    }

    // Reduce the number of columns displayed for mobile
    if (UIHelpers.isViewSize('xs')) {
      this.state.columns = this.state.columns.filter((v) => ['title', 'related_words'].indexOf(v.name) != -1)
      this.state.hideStateColumn = true
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      ProviderHelpers.fetchIfMissing(this.props.routeParams.dialect_path, this.props.fetchDialect2)
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: `${this.props.routeParams.dialect_path}/Alphabet`,
        entity: this.props.computeCharacters,
      },
    ])

    // If dialect not supplied, promise wrapper will need to wait for compute dialect
    if (!this.props.dialect) {
      computeEntities.push(
        new Map({
          id: this.props.routeParams.dialect_path,
          entity: this.props.computeDialect2,
        })
      )
    }

    const computeCharacters = ProviderHelpers.getEntry(
      this.props.computeCharacters,
      `${this.props.routeParams.dialect_path}/Alphabet`
    )
    const computeDialect2 =
      this.props.dialect || ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {(() => {
          if (selectn('response.entries', computeCharacters)) {
            return (
              <DocumentListView
                // objectDescriptions="characters"
                // onSelectionChange={this._onEntryNavigateRequest}
                // onSortChange={this._handleSortChange}
                // sortInfo={this.state.sortInfo.uiSortOrder}
                className="browseDataGrid"
                columns={this.state.columns}
                data={computeCharacters}
                dialect={selectn('response', computeDialect2)}
                gridListTile={this.props.gridListTile}
                gridListView={this.props.gridListView}
                gridViewProps={this.props.gridViewProps}
                page={this.state.pageInfo.page}
                pageSize={this.state.pageInfo.pageSize}
                pagination={this.props.pagination}
                refetcher={this._handleRefetch}
                type="FVCharacter"
              />
            )
          }
        })()}
      </PromiseWrapper>
    )
  }

  // NOTE: DataListView calls `fetchData`
  fetchData = (newProps) => {
    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  _fetchListViewData = (props, pageIndex, pageSize, sortOrder, sortBy) => {
    const _pageIndex = 0
    const _pageSize = 100
    props.fetchCharacters(
      `${props.routeParams.dialect_path}/Alphabet`,
      `&currentPageIndex=${_pageIndex}&pageSize=${_pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
    )
  }

  _onEntryNavigateRequest = (item) => {
    this.props.pushWindowPath(`/${this.props.routeParams.siteTheme}${item.path.replace('Alphabet', 'learn/alphabet')}`)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCharacter, fvDialect, navigation, nuxeo, windowPath, locale } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computeCharacters } = fvCharacter
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeCharacters,
    computeDialect2,
    computeLogin,
    properties,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCharacters,
  fetchDialect2,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetListView)
