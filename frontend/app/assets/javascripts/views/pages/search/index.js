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

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDocuments } from 'providers/redux/reducers/search'

import selectn from 'selectn'

import t from 'tcomb-form'

import fields from 'models/schemas/filter-fields'
import options from 'models/schemas/filter-options'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'

import StringHelpers, { CLEAN_FULLTEXT } from 'common/StringHelpers'
import FormHelpers from 'common/FormHelpers'
import AnalyticsHelpers from 'common/AnalyticsHelpers'

import SearchResultTile from './tile'

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import DocumentListView from 'views/components/Document/DocumentListView'

import withToggle from 'views/hoc/view/with-toggle'
import IntlService from 'views/services/intl'
import NavigationHelpers from 'common/NavigationHelpers'
import { SECTIONS } from 'common/Constants'
import '!style-loader!css-loader!./Search.css'

const FiltersWithToggle = withToggle()
const intl = IntlService.instance

const { array, bool, func, number, object, string } = PropTypes
export class Search extends DataListView {
  static propTypes = {
    action: func,
    data: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    DISABLED_SORT_COLS: array,
    filter: object,
    gridListView: bool,
    routeParams: object.isRequired,

    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeSearchDocuments: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    searchDocuments: func.isRequired,
  }
  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'fv-word:categories', 'related_audio', 'related_pictures'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_TYPE: 'asc',
    dialect: null,
    filter: new Map(),
    gridListView: false,
  }

  constructor(props, context) {
    super(props, context)

    this.formSearch = React.createRef()

    this.state = {
      pageInfo: {
        page: props.DEFAULT_PAGE,
        pageSize: props.DEFAULT_PAGE_SIZE,
      },
      formValue: {
        searchTerm: props.routeParams.searchTerm,
        documentTypes: ['FVWord', 'FVPhrase', 'FVBook', 'FVPortal'],
      },
      defaultFormValue: { searchTerm: '', documentTypes: ['FVWord', 'FVPhrase', 'FVBook', 'FVPortal'] },
      preparedFilters: null,
    }

    this.state.queryParam = this._computeQueryParam()
    this.state.queryPath = this._getQueryPath()

    // Bind methods to 'this'
    ;[
      '_handleRefetch',
      '_onSearchSaveForm',
      '_computeQueryParam',
      '_getQueryPath',
      '_onEntryNavigateRequest',
      '_onReset',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps = this.props) {
    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  _fetchListViewData(props = this.props, pageIndex, pageSize, sortOrder, sortBy, formValue = this.state.formValue) {
    if (props.routeParams.searchTerm && props.routeParams.searchTerm !== '') {
      const documentTypeFilter = "'" + (formValue.documentTypes || []).join("','") + "'"
      props.searchDocuments(
        this._getQueryPath(props),
        (props.routeParams.area === SECTIONS ? ' AND ecm:isLatestVersion = 1' : ' ') +
          ' AND ecm:primaryType IN (' +
          documentTypeFilter +
          ')' +
          " AND ecm:fulltext LIKE '" +
          StringHelpers.clean(props.routeParams.searchTerm, CLEAN_FULLTEXT) +
          "'" +
          // More specific: ' AND (ecm:fulltext_description = \'' + props.routeParams.searchTerm + '\' OR ecm:fulltext_title = \'' + props.routeParams.searchTerm + '\')' +
          '&currentPageIndex=' +
          (pageIndex - 1) +
          '&pageSize=' +
          pageSize +
          '&sortBy=ecm:fulltextScore'
      )

      // TODO: Update with path after filter.
    }
  }

  _onSearchSaveForm(e) {
    // Prevent default behaviour
    if (e) {
      e.preventDefault()
    }

    const form = this.formSearch.current
    const properties = FormHelpers.getProperties(form)

    if (Object.keys(properties).length !== 0) {
      this.setState({
        formValue: properties,
      })

      // If search term didn't change, but facets did - update results
      if (properties.searchTerm === this.props.routeParams.searchTerm && properties !== this.state.formValue) {
        this._fetchListViewData(
          this.props,
          this.state.pageInfo.page,
          this.state.pageInfo.pageSize,
          this.props.DEFAULT_SORT_TYPE,
          this.props.DEFAULT_SORT_COL,
          properties
        )
      }

      this.props.replaceWindowPath(
        `${NavigationHelpers.getContextPath()}/explore${this._getQueryPath()}/search/${properties.searchTerm}`
      )
    }
  }

  _onEntryNavigateRequest(path) {
    this.props.pushWindowPath(`/${this.props.routeParams.siteTheme}${path}`)
  }

  _getQueryPath(props = this.props) {
    return (
      props.routeParams.dialect_path ||
      props.routeParams.language_path ||
      props.routeParams.language_family_path ||
      `/${props.properties.domain}/${props.routeParams.area || SECTIONS}/Data`
    )
  }

  _computeQueryParam() {
    const lastPathSegment = this.props.splitWindowPath[this.props.splitWindowPath.length - 1]

    let queryParam = ''
    if (lastPathSegment !== 'search') {
      queryParam = lastPathSegment
    }

    return queryParam
  }

  _onReset() {
    // Reset all controlled inputs
    const inputs = selectn('refs.input.refs', this.formSearch.current)

    for (const inputKey in inputs) {
      if (typeof inputs[inputKey].reset === 'function') {
        inputs[inputKey].reset()
      }
    }

    this.setState({
      formValue: this.state.defaultFormValue || null,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const computeSearchDocuments = ProviderHelpers.getEntry(this.props.computeSearchDocuments, this._getQueryPath())

    if (selectn('response.totalSize', computeSearchDocuments) !== undefined) {
      // Track search event
      AnalyticsHelpers.trackSiteSearch({
        keyword: this.props.routeParams.searchTerm,
        category: false,
        results: selectn('response.totalSize', computeSearchDocuments),
      })
    }

    // if search came from nav bar
    if (prevProps.windowPath !== this.props.windowPath) {
      this.setState(
        {
          pageInfo: {
            page: 1,
            pageSize: this.state.pageInfo.pageSize,
          },
        },
        () => {
          this._fetchListViewData(
            this.props,
            1,
            this.state.pageInfo.pageSize,
            this.props.DEFAULT_SORT_TYPE,
            this.props.DEFAULT_SORT_COL
          )
        }
      )
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getQueryPath(),
        entity: this.props.computeSearchDocuments,
      },
    ])

    const computeSearchDocuments = ProviderHelpers.getEntry(this.props.computeSearchDocuments, this._getQueryPath())
    const _onEntryNavigateRequest = this._onEntryNavigateRequest
    const searchTerm = this.props.routeParams.searchTerm
    const SearchResultTileWithProps = React.Component({
      // Note: don't switch the render fn to a fat arrow, eg:
      // render: () => {
      // It breaks the search results display
      render: function SearchResultTileWithPropsRender() {
        return React.createElement(SearchResultTile, {
          searchTerm: searchTerm,
          action: _onEntryNavigateRequest,
          ...this.props,
        })
      },
    })

    return (
      <div className="Search">
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-3')}>
            <div className="col-xs-12">
              <form onSubmit={this._onSearchSaveForm}>
                <FiltersWithToggle
                  label={intl.trans('views.pages.search.filter_items', 'Filter items', 'first')}
                  mobileOnly
                >
                  <div className="fontAboriginalSans">
                    <t.form.Form
                      ref={this.formSearch}
                      value={Object.assign({}, this.state.formValue, { searchTerm: this.props.routeParams.searchTerm })}
                      type={t.struct(selectn('Search', fields))}
                      options={selectn('Search', options)}
                    />
                  </div>
                  <div className="Search__btnGroup">
                    <button
                      type="button"
                      className="Search__btn RaisedButton RaisedButton--primary"
                      onClick={this._onReset}
                    >
                      {intl.trans('reset', 'Reset', 'first')}
                    </button>
                    <button type="submit" className="Search__btn RaisedButton RaisedButton--primary">
                      {intl.trans('search', 'Search', 'first')}
                    </button>
                  </div>
                </FiltersWithToggle>
              </form>
            </div>
          </div>
          <div
            className={classNames('search-results', 'col-xs-12', 'col-md-6')}
            style={{ borderLeft: '5px solid #f7f7f7' }}
          >
            <h1>
              {intl.trans('search_results', 'Search results', 'first')} -{' '}
              <span className="fontAboriginalSans">{this.props.routeParams.searchTerm}</span>
            </h1>

            <PromiseWrapper renderOnError computeEntities={computeEntities}>
              {(() => {
                const entries = selectn('response.entries', computeSearchDocuments)

                if (entries) {
                  if (entries.length === 0) {
                    const suggestDocumentTypes =
                      this.state.formValue.documentTypes === undefined ? (
                        <div className="alert alert-info">
                          <span>
                            {
                              "Tip: Try searching again with a selected 'Document type'. Click the '+ ADD NEW' button if there are none displayed."
                            }
                          </span>
                        </div>
                      ) : null
                    return (
                      <div>
                        <p>Sorry, no results were found for this search.</p>
                        {suggestDocumentTypes}
                      </div>
                    )
                  }
                  return (
                    <DocumentListView
                      objectDescriptions="results"
                      type="Document"
                      data={computeSearchDocuments}
                      gridCols={1}
                      gridListView
                      gridListTile={SearchResultTileWithProps}
                      gridViewProps={{ cellHeight: 170, style: { overflowY: 'hidden', margin: '0 0 30px 0' } }}
                      refetcher={this._handleRefetch}
                      onSortChange={this._handleSortChange}
                      onSelectionChange={this._onEntryNavigateRequest}
                      page={this.state.pageInfo.page}
                      pageSize={this.state.pageInfo.pageSize}
                      onColumnOrderChange={this._handleColumnOrderChange}
                      usePrevResponse
                      className="browseDataGrid fontAboriginalSans"
                    />
                  )
                }
              })()}
            </PromiseWrapper>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, navigation, nuxeo, search, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeSearchDocuments } = search
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computeSearchDocuments,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
  searchDocuments,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
