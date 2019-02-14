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
import React, { PropTypes } from 'react'
import Immutable, { Map } from 'immutable'
import provide from 'react-redux-provide'
import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

import DocumentListView from 'views/components/Document/DocumentListView'

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'

import Preview from 'views/components/Editor/Preview'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * List view for words
 */
@provide
export default class ListView extends DataListView {
  static defaultProps = {
    disableWordClick: true,
    DISABLED_SORT_COLS: ['state', 'fv-word:categories', 'related_audio', 'related_pictures', 'dc:modified'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    // DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    ENABLED_COLS: [
      'title',
      'related_pictures',
      'related_audio',
      'fv:definitions',
      'fv-word:pronunciation',
      'fv-word:categories',
      'fv-word:part_of_speech',
    ],
    dialect: null,
    filter: new Map(),
    gridListView: false,
    controlViaURL: false,
    renderSimpleTable: false,
    disablePageSize: false,
  }

  static propTypes = {
    action: PropTypes.func,
    computeDialect2: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    computeWords: PropTypes.object.isRequired,
    controlViaURL: PropTypes.bool,
    data: PropTypes.string,
    disableWordClick: PropTypes.bool,
    dialect: PropTypes.object,
    ENABLED_COLS: PropTypes.array,
    DISABLED_SORT_COLS: PropTypes.array,
    DEFAULT_PAGE: PropTypes.number,
    DEFAULT_PAGE_SIZE: PropTypes.number,
    DEFAULT_SORT_COL: PropTypes.string,
    DEFAULT_SORT_TYPE: PropTypes.string,
    disablePageSize: PropTypes.bool,
    fetchWords: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    filter: PropTypes.object,
    gridListView: PropTypes.bool,
    onPaginationReset: PropTypes.func,
    onPagePropertiesChange: PropTypes.func,
    pageProperties: PropTypes.object,
    parentID: PropTypes.string,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    renderSimpleTable: PropTypes.bool,
    splitWindowPath: PropTypes.array.isRequired,
    windowPath: PropTypes.string.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    // TODO: Remove `let language` below?
    /*
    let language

    switch (intl.locale) {
    case 'en':
      language = 'english'
      break

        case 'fr':
      language = 'french'
      break
    }
    */
    this.state = {
      columns: [
        {
          name: 'title',
          title: intl.trans('word', 'Word', 'first'),
          render: (v, data) => {
            const href = NavigationHelpers.generateUIDPath(this.props.routeParams.theme, data, 'words')
            const clickHandler = props.disableWordClick
              ? NavigationHelpers.disable
              : (e) => {
                e.preventDefault()
                NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
              }
            return (
              <a onClick={clickHandler} href={href}>
                {v}
              </a>
            )
          },
          sortName: 'fv:custom_order',
        },
        {
          name: 'fv:definitions',
          title: intl.trans('definitions', 'Definitions', 'first'),
          render: (v, data, cellProps) => {
            return UIHelpers.renderComplexArrayRow(selectn(`properties.${cellProps.name}`, data), (entry, i) => {
              if (entry.language === this.props.DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>
              }
            })
          },
          sortName: 'fv:definitions/0/translation',
        },
        {
          name: 'related_audio',
          title: intl.trans('audio', 'Audio', 'first'),
          render: (v, data, cellProps) => {
            const firstAudio = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
            if (firstAudio) {
              return (
                <Preview
                  key={selectn('uid', firstAudio)}
                  minimal
                  tagProps={{ preload: 'none' }}
                  tagStyles={{ width: '250px', maxWidth: '100%' }}
                  expandedValue={firstAudio}
                  type="FVAudio"
                />
              )
            }
          },
        },
        {
          name: 'related_pictures',
          width: 72,
          textAlign: 'center',
          title: intl.trans('picture', 'Picture', 'first'),
          render: (v, data, cellProps) => {
            const firstPicture = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
            if (firstPicture) {
              return (
                <img
                  key={selectn('uid', firstPicture)}
                  style={{ maxWidth: '62px', maxHeight: '45px' }}
                  src={UIHelpers.getThumbnail(firstPicture, 'Thumbnail')}
                  alt=""
                />
              )
            }
          },
        },
        {
          name: 'fv-word:part_of_speech',
          title: intl.trans('part_of_speech', 'Part of Speech', 'first'),
          render: (v, data) => selectn('contextParameters.word.part_of_speech', data),
        },
        {
          name: 'dc:modified',
          width: 210,
          title: intl.trans('date_modified', 'Date Modified'),
          render: function(v, data, cellProps) {
            return StringHelpers.formatUTCDateString(selectn('lastModified', data))
          },
        },
        {
          name: 'dc:created',
          width: 210,
          title: intl.trans('date_created', 'Date Created'),
          render: function(v, data, cellProps) {
            return StringHelpers.formatUTCDateString(selectn('properties.dc:created', data))
          },
        },
        {
          name: 'fv-word:categories',
          title: intl.trans('categories', 'Categories', 'first'),
          render: (v, data) =>
            UIHelpers.renderComplexArrayRow(selectn('contextParameters.word.categories', data), (entry, i) => (
              <li key={i}>{selectn('dc:title', entry)}</li>
            )),
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
      this.state.columns = this.state.columns.filter((v) => ['title', 'fv:literal_translation'].indexOf(v.name) !== -1)
      this.state.hideStateColumn = true
    }

    // Only show enabled cols if specified
    if (this.props.ENABLED_COLS.length > 0) {
      this.state.columns = this.state.columns.filter((v, k) => this.props.ENABLED_COLS.indexOf(v.name) != -1)
    }

    // Bind methods to 'this'
    [
      '_onNavigateRequest',
      '_onEntryNavigateRequest',
      '_handleRefetch',
      '_handleSortChange',
      '_handleColumnOrderChange',
      '_resetColumns',
      '_fetchData2',
      '_getPathOrParentID',
    ].forEach((method) => (this[method] = this[method].bind(this))) // eslint-disable-line
  }

  _getPathOrParentID(newProps) {
    return newProps.parentID ? newProps.parentID : `${newProps.routeParams.dialect_path}/Dictionary`
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    // console.log('!!! fetchData 1')
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      // console.log('!!! fetchData 2')
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }
    // console.log('!!! fetchData 3')
    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  _onEntryNavigateRequest(item) {
    if (this.props.action) {
      this.props.action(item)
    } else {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.theme, item, 'words'),
        this.props.pushWindowPath,
        true
      )
    }
  }

  // NOTE: DataListView calls `_fetchListViewData`
  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    // console.log('!!! _fetchListViewData 1')
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      // console.log('!!! _fetchListViewData 2')
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }
    const nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
    // console.log('!!! _fetchListViewData 3')
    props.fetchWords(this._getPathOrParentID(props), nql)
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  _fetchData2(fetcherParams, props = this.props) {
    this.setState({
      fetcherParams: fetcherParams,
    })

    this._handleRefetch()

    /*props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
          ProviderHelpers.filtersToNXQL(fetcherParams.filters)  +
          '&currentPageIndex=' + (fetcherParams.currentPageIndex - 1) +
          '&pageSize=' + fetcherParams.pageSize +
          '&sortOrder=' + fetcherParams.sortOrder +
          '&sortBy=' + fetcherParams.sortBy
      );*/

    //this._fetchListViewData(props, fetcherParams.currentPageIndex, fetcherParams.pageSize, fetcherParams.sortOrder, fetcherParams.sortBy);
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getPathOrParentID(this.props),
        entity: this.props.computeWords,
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

    const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this._getPathOrParentID(this.props))
    const computeDialect2 = this.props.dialect || this.getDialect()

    const listViewProps = {
      className: 'browseDataGrid',
      columns: this.state.columns,
      data: computeWords,
      dialect: selectn('response', computeDialect2),
      disablePageSize: this.props.disablePageSize,
      gridListView: this.props.gridListView,
      objectDescriptions: 'words',
      onColumnOrderChange: this._handleColumnOrderChange,
      onSelectionChange: this._onEntryNavigateRequest,
      onSortChange: this._handleSortChange,
      page: this.state.pageInfo.page,
      pageSize: this.state.pageInfo.pageSize,
      refetcher: this._handleRefetch,
      refetcher2: this._handleRefetch,
      renderSimpleTable: this.props.renderSimpleTable,
      sortInfo: this.state.sortInfo.uiSortOrder,
      type: 'FVWord',
    }
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computeWords) && <DocumentListView {...listViewProps} />}
      </PromiseWrapper>
    )
  }
}
