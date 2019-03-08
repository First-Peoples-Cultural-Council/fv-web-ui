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
import React, { Component, PropTypes } from 'react'
import Immutable, { List, Map } from 'immutable'
import provide from 'react-redux-provide'
import selectn from 'selectn'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

import DocumentListView from 'views/components/Document/DocumentListView'

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'

import Preview from 'views/components/Editor/Preview'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * List view for alphabet
 */
@provide
export default class ListView extends DataListView {
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

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    dialect: PropTypes.object,
    computeCharacters: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    filter: PropTypes.object,
    data: PropTypes.string,
    gridListView: PropTypes.bool,
    gridListTile: PropTypes.func,
    gridViewProps: PropTypes.object,
    pagination: PropTypes.bool,

    DISABLED_SORT_COLS: PropTypes.array,
    DEFAULT_PAGE: PropTypes.number,
    DEFAULT_PAGE_SIZE: PropTypes.number,
    DEFAULT_SORT_COL: PropTypes.string,
    DEFAULT_SORT_TYPE: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      columns: [
        {
          name: 'title',
          title: intl.trans('character', 'Character', 'first'),
          render: (v, data, cellProps) => v,
          sortName: 'fvcharacter:alphabet_order',
        },
        {
          name: 'fvcharacter:upper_case_character',
          title: intl.trans(
            'views.pages.explore.dialect.learn.alphabet.uppercase_character',
            'Uppercase Character',
            'words'
          ),
          render: (v, data, cellProps) => selectn('properties.' + cellProps.name, data),
          sortName: 'fvcharacter:alphabet_order',
        },
        {
          name: 'related_words',
          title: intl.trans('related_words', 'Related Words', 'words'),
          render: (v, data, cellProps) => (
            UIHelpers.renderComplexArrayRow(
              selectn('contextParameters.character.' + cellProps.name, data),
              (entry, i) => <li key={selectn('uid', entry)}>{selectn('dc:title', entry)}</li>
            )
          ),
          sortName: 'fv:literal_translation/0/translation',
        },
        {
          name: 'related_audio',
          title: intl.trans('audio', 'Audio', 'words'),
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
      this.state.columns = this.state.columns.filter((v, k) => ['title', 'related_words'].indexOf(v.name) != -1)
      this.state.hideStateColumn = true
    }

    // Bind methods to 'this'
    [
      '_onNavigateRequest',
      '_onEntryNavigateRequest',
      '_handleRefetch',
      '_handleSortChange',
      '_handleColumnOrderChange',
      '_resetColumns',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    ProviderHelpers.fetchIfMissing(newProps.routeParams.dialect_path, newProps.fetchDialect2)

    // if (newProps.dialect == null) {
    //     newProps.fetchDialect2(newProps.routeParams.dialect_path);
    // }

    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  _onEntryNavigateRequest(item) {
    this.props.pushWindowPath(`/${this.props.routeParams.theme}${item.path.replace('Alphabet', 'learn/alphabet')}`)
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    const _pageIndex = 0
    const _pageSize = 100
    props.fetchCharacters(
      `${props.routeParams.dialect_path}/Alphabet`,
      `&currentPageIndex=${_pageIndex}&pageSize=${_pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
    )
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
                objectDescriptions="characters"
                type="FVCharacter"
                data={computeCharacters}
                gridListView={this.props.gridListView}
                gridViewProps={this.props.gridViewProps}
                refetcher={this._handleRefetch}
                onSortChange={this._handleSortChange}
                onSelectionChange={this._onEntryNavigateRequest}
                page={this.state.pageInfo.page}
                pageSize={this.state.pageInfo.pageSize}
                onColumnOrderChange={this._handleColumnOrderChange}
                pagination={this.props.pagination}
                columns={this.state.columns}
                sortInfo={this.state.sortInfo.uiSortOrder}
                gridListTile={this.props.gridListTile}
                className="browseDataGrid"
                dialect={selectn('response', computeDialect2)}
              />
            )
          }
        })()}
      </PromiseWrapper>
    )
  }
}
