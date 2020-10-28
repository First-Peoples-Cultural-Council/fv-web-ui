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
import { fetchCategories } from 'reducers/fvCategory'
import { fetchDocument } from 'reducers/document'
import { fetchPortal } from 'reducers/fvPortal'
import { pushWindowPath } from 'reducers/windowPath'
import { updatePageProperties } from 'reducers/navigation'

import selectn from 'selectn'

import ReportsJson from 'components/Reports/ReportsQueries.json'

import PromiseWrapper from 'components/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import PageDialectLearnBase from 'components/LearnBase'

import WordsListView from 'components/WordsCreateEdit/list-view'
import PhraseListView from 'components/Phrases/list-view'
import SongsStoriesListViewAlt from 'components/SongsStories/list-view-alt'

import ReportsBrowser from 'components/Reports/ReportsBrowser'

import { WORKSPACES, SECTIONS } from 'common/Constants'

const { func, object, string } = PropTypes
export class ReportsView extends PageDialectLearnBase {
  static propTypes = {
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeCategories: object.isRequired,
    computeDocument: object,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategories: func.isRequired,
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    pushWindowPath: func.isRequired,
    updatePageProperties: func.isRequired,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.routeParams.reportName !== this.props.routeParams.reportName) {
      this.setState(this.getReports())
    }
  }
  constructor(props, context) {
    super(props, context)

    this.state = this.getReports()

    // Bind methods to 'this'
    ;[
      '_getPageKey', // NOTE: PageDialectLearnBase calls `_getPageKey`
      '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
      '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_onNavigateRequest', // NOTE: Also is defined in PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const { routeParams } = this.props
    const computeEntities = Immutable.fromJS([
      {
        id: routeParams.dialect_path,
        entity: this.props.computePortal,
      },
    ])

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, routeParams.dialect_path + '/Portal')
    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = this._getURLPageProps()

    let listView = null
    let exportDialectExportElement = undefined
    const extricateReportData = this.state.currentReport.toJS()
    const exportDialectQuery = extricateReportData.query
    let exportDialectLabel = undefined

    switch (this.state.currentReport.get('type')) {
      case 'words':
        exportDialectExportElement = 'FVWord'
        exportDialectLabel = 'Word Report'
        listView = (
          <WordsListView
            controlViaURL
            DEFAULT_PAGE_SIZE={DEFAULT_PAGE_SIZE}
            DEFAULT_PAGE={DEFAULT_PAGE}
            customSortBy={this.state.currentReport.get('sortBy')}
            customSortOrder={this.state.currentReport.get('sortOrder')}
            disableClickItem={false}
            ENABLED_COLS={this.state.currentReport.has('cols') ? this.state.currentReport.get('cols') : []}
            filter={this.state.filterInfo}
            hasSorting={false}
            hasViewModeButtons={false}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            onPaginationReset={this._resetURLPagination}
            routeParams={routeParams}
            // Export Dialect
            exportDialectExportElement={exportDialectExportElement}
            exportDialectLabel={exportDialectLabel}
            exportDialectQuery={`SELECT * FROM ${exportDialectExportElement} WHERE ecm:path STARTSWITH '${routeParams.dialect_path}/Dictionary' ${exportDialectQuery}`}
            exportDialectColumns={'*'}
          />
        )
        break

      case 'phrases':
        exportDialectExportElement = 'FVPhrase'
        exportDialectLabel = 'Phrase Report'
        listView = (
          <PhraseListView
            controlViaURL
            DEFAULT_PAGE_SIZE={DEFAULT_PAGE_SIZE}
            DEFAULT_PAGE={DEFAULT_PAGE}
            customSortBy={this.state.currentReport.get('sortBy')}
            customSortOrder={this.state.currentReport.get('sortOrder')}
            disableClickItem={false}
            ENABLED_COLS={this.state.currentReport.has('cols') ? this.state.currentReport.get('cols') : []}
            filter={this.state.filterInfo}
            hasSorting={false}
            hasViewModeButtons={false}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            onPaginationReset={this._resetURLPagination}
            routeParams={routeParams}
            // Export Dialect
            exportDialectExportElement={exportDialectExportElement}
            exportDialectLabel={exportDialectLabel}
            exportDialectQuery={`SELECT * FROM ${exportDialectExportElement} WHERE ecm:path STARTSWITH '${routeParams.dialect_path}/Dictionary' ${exportDialectQuery}`}
            exportDialectColumns={'*'}
          />
        )
        break

      case 'songs':
      case 'stories':
        listView = (
          <SongsStoriesListViewAlt
            controlViaURL
            DEFAULT_PAGE_SIZE={DEFAULT_PAGE_SIZE}
            DEFAULT_PAGE={DEFAULT_PAGE}
            DEFAULT_SORT_COL={this.state.currentReport.get('sortBy')}
            DEFAULT_SORT_TYPE={this.state.currentReport.get('sortOrder')}
            disableClickItem={false}
            filter={this.state.filterInfo}
            hasSorting={false}
            hasViewModeButtons={false}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            onPaginationReset={this._resetURLPagination}
            routeParams={routeParams}
            // TODO: endpdoint doesn't support FVBook exports
            hasExportDialect={false}
          />
        )
        break
      default: // NOTE: do nothing
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div className={classNames('col-xs-12')}>
            <h1>
              {selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal)}:{' '}
              {StringHelpers.toTitleCase(this.props.intl.searchAndReplace(this.state.currentReport.get('name')))}
            </h1>

            <div className="row">
              <div className={classNames('col-xs-12', 'col-md-3')}>
                <ReportsBrowser
                  style={{ maxHeight: '400px', overflowY: 'scroll' }}
                  routeParams={routeParams}
                  fullWidth
                />
              </div>
              <div className={classNames('col-xs-12', 'col-md-9')}>{listView}</div>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary')
  }

  // NOTE: PageDialectLearnBase calls `_getPageKey`
  _getPageKey() {
    const { routeParams } = this.props
    return routeParams.area + '_' + routeParams.dialect_name + '_reports'
  }

  getReports() {
    const { routeParams } = this.props
    const reports = Immutable.fromJS(ReportsJson)

    let report = reports.find((entry) => {
      return entry.get('name').toLowerCase() === decodeURI(routeParams.reportName).toLowerCase()
    })

    if (!report.has('cols')) {
      let defaultCols = null

      switch (report.get('type')) {
        case 'words':
          defaultCols = ['title', 'related_pictures', 'related_audio', 'fv:definitions', 'fv-word:part_of_speech']
          break

        case 'phrases':
          defaultCols = ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'fv-phrase:phrase_books']
          break
        default: // NOTE: do nothing
      }

      report = report.set('cols', defaultCols)
    } else {
      report = report.set('cols', report.get('cols').toJS())
    }
    return {
      currentReport: report,
      filterInfo: new Map({
        currentAppliedFilter: new Map({
          reports: report.get('query'),
        }),
      }),
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace(SECTIONS, WORKSPACES) + '/' + path)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvPortal, locale, navigation, nuxeo, windowPath } = state

  const { computeCategories } = fvCategory
  const { computePortal } = fvPortal
  const { route } = navigation
  const { computeLogin } = nuxeo
  const { computeDocument } = document
  const { _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeCategories,
    computeDocument,
    computeLogin,
    routeParams: route.routeParams,
    computePortal,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchDocument,
  fetchPortal,
  pushWindowPath,
  updatePageProperties,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsView)
