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
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchPhrases } from 'providers/redux/reducers/fvPhrase'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import Edit from '@material-ui/icons/Edit'

import { WORKSPACES } from 'common/Constants'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import DocumentListView from 'views/components/Document/DocumentListView'
import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
import NavigationHelpers, { getSearchObject } from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'
import { SEARCH_DATA_TYPE_PHRASE } from 'views/components/SearchDialect/constants'
import { dictionaryListSmallScreenTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
const intl = IntlService.instance
/**
 * List view for phrases
 */

const { array, bool, func, number, object, string } = PropTypes
export class PhrasesListView extends DataListView {
  static propTypes = {
    action: func,
    data: string,
    controlViaURL: bool,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    disableClickItem: bool,
    // DISABLED_SORT_COLS: array,
    ENABLED_COLS: array,
    filter: object,
    flashcard: bool,
    flashcardTitle: string,
    gridCols: number,
    gridListView: bool,
    parentID: string,
    onPagePropertiesChange: func,
    pageProperties: object,
    routeParams: object.isRequired,

    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePhrases: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPhrases: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    disableClickItem: true,
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_TYPE: 'asc',
    ENABLED_COLS: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'fv-phrase:phrase_books'],
    dialect: null,
    filter: new Map(),
    gridListView: false,
    gridCols: 4,
    controlViaURL: false,
    flashcard: false,
    flashcardTitle: '',
  }

  constructor(props, context) {
    super(props, context)

    const currentTheme = this.props.routeParams.siteTheme

    // NOTE: searchObj used below in setting state
    const searchObj = getSearchObject()

    this.state = {
      columns: [
        {
          name: 'title',
          title: intl.trans('phrase', 'Phrase', 'first'),
          render: (v, data) => {
            const href = NavigationHelpers.generateUIDPath(currentTheme, data, 'phrases')
            const clickHandler = props.disableClickItem ? NavigationHelpers.disable : null

            const isWorkspaces = this.props.routeParams.area === WORKSPACES
            const hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, 'phrases')
            const computeDialect2 = this.props.dialect || this.getDialect()

            const editButton =
              isWorkspaces && hrefEdit ? (
                <AuthorizationFilter
                  filter={{
                    entity: selectn('response', computeDialect2),
                    login: this.props.computeLogin,
                    role: ['Record', 'Approve', 'Everything'],
                  }}
                  hideFromSections
                  routeParams={this.props.routeParams}
                >
                  <FVButton
                    type="button"
                    variant="flat"
                    size="small"
                    component="a"
                    href={hrefEdit}
                    onClick={(e) => {
                      e.preventDefault()
                      NavigationHelpers.navigate(hrefEdit, this.props.pushWindowPath, false)
                    }}
                  >
                    <Edit title={intl.trans('edit', 'Edit', 'first')} />
                    {/* <span>{intl.trans('edit', 'Edit', 'first')}</span> */}
                  </FVButton>
                </AuthorizationFilter>
              ) : null
            return (
              <>
                <a className="DictionaryList__link" onClick={clickHandler} href={href}>
                  {v}
                </a>
                {editButton}
              </>
            )
          },
          sortName: 'fv:custom_order',
          sortBy: 'fv:custom_order',
        },
        {
          name: 'fv:definitions',
          title: intl.trans('definitions', 'Definitions', 'first'),
          render: (v, data, cellProps) => {
            return UIHelpers.renderComplexArrayRow(selectn('properties.' + cellProps.name, data), (entry, i) => {
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
            const firstAudio = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
            if (firstAudio) {
              return (
                <Preview
                  minimal
                  tagStyles={{ width: '300px', maxWidth: '100%' }}
                  key={selectn('uid', firstAudio)}
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
            const firstPicture = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
            if (firstPicture) {
              return (
                <img
                  style={{ maxWidth: '62px', maxHeight: '45px' }}
                  key={selectn('uid', firstPicture)}
                  src={UIHelpers.getThumbnail(firstPicture, 'Thumbnail')}
                />
              )
            }
          },
        },
        {
          name: 'fv-phrase:phrase_books',
          title: intl.trans('phrase_books', 'Phrase Books', 'words'),
          render: (v, data) => {
            return UIHelpers.renderComplexArrayRow(
              selectn('contextParameters.phrase.phrase_books', data),
              (entry, i) => <li key={i}>{selectn('dc:title', entry)}</li>
            )
          },
        },
        {
          name: 'dc:modified',
          width: 210,
          title: intl.trans('date_modified', 'Date Modified'),
          render: (v, data) => {
            return StringHelpers.formatUTCDateString(selectn('lastModified', data))
          },
        },
        {
          name: 'dc:created',
          width: 210,
          title: intl.trans('date_created', 'Date Created'),
          render: (v, data) => {
            return StringHelpers.formatUTCDateString(selectn('properties.dc:created', data))
          },
        },
      ],
      sortInfo: {
        uiSortOrder: [],
        currentSortCols: searchObj.sortBy || this.props.DEFAULT_SORT_COL,
        currentSortType: searchObj.sortOrder || this.props.DEFAULT_SORT_TYPE,
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE,
      },
    }

    // Reduce the number of columns displayed for mobile
    if (UIHelpers.isViewSize('xs')) {
      this.state.columns = this.state.columns.filter((v) => ['title', 'fv:definitions'].indexOf(v.name) !== -1)
      this.state.hideStateColumn = true
    }

    // Only show enabled cols if specified
    if (this.props.ENABLED_COLS.length > 0) {
      this.state.columns = this.state.columns.filter((v) => this.props.ENABLED_COLS.indexOf(v.name) !== -1)
    }

    // Bind methods to 'this'
    ;[
      '_onEntryNavigateRequest',
      '_handleRefetch',
      '_handleSortChange',
      '_handleColumnOrderChange',
      '_getPathOrParentID',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getPathOrParentID(this.props),
        entity: this.props.computePhrases,
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

    const computePhrases = ProviderHelpers.getEntry(this.props.computePhrases, this._getPathOrParentID(this.props))
    const computeDialect2 = this.props.dialect || this.getDialect()

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computePhrases) && (
          <DocumentListView
            // className={'browseDataGrid'}
            // objectDescriptions="phrases"
            // onSelectionChange={this._onEntryNavigateRequest}
            // onSortChange={this._handleSortChange}
            // sortInfo={this.state.sortInfo.uiSortOrder}
            columns={this.state.columns}
            data={computePhrases}
            dialect={selectn('response', computeDialect2)}
            flashcard={this.props.flashcard}
            flashcardTitle={this.props.flashcardTitle}
            gridCols={this.props.gridCols}
            gridListView={this.props.gridListView}
            page={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.pageSize}
            // refetcher: this._handleRefetch,
            // NOTE: Pagination === refetcher
            refetcher={(dataGridProps, page, pageSize) => {
              this._handleRefetch2({
                page,
                pageSize,
                preserveSearch: true,
              })
            }}
            sortHandler={async ({
              page = '1',
              pageSize = '10',
              sortBy = 'fv:custom_order',
              sortOrder = 'asc',
            } = {}) => {
              await this._fetchListViewData(this.props, page, pageSize, sortOrder, sortBy)

              const newSortInfo = {
                currentSortCols: sortBy,
                currentSortType: sortOrder,
              }

              this.setState({
                sortInfo: newSortInfo,
              })
            }}
            type={'FVPhrase'}
            // SEARCH:
            handleSearch={this.props.handleSearch}
            hasSearch={this.props.hasSearch}
            searchDialectDataType={SEARCH_DATA_TYPE_PHRASE}
            resetSearch={this.props.resetSearch}
            searchByMode={this.props.searchByMode}
            searchUi={this.props.searchUi}
            // List view
            hasViewModeButtons={this.props.hasViewModeButtons}
            hasSorting={this.props.hasSorting}
            rowClickHandler={this.props.rowClickHandler}
            dictionaryListSmallScreenTemplate={dictionaryListSmallScreenTemplate.phrase}
          />
        )}
      </PromiseWrapper>
    )
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }
    const searchObj = getSearchObject()
    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      searchObj.sortOrder || newProps.DEFAULT_SORT_TYPE,
      searchObj.sortBy || newProps.DEFAULT_SORT_COL
    )
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

    props.fetchPhrases(
      this._getPathOrParentID(props),
      `${currentAppliedFilter}&currentPageIndex=${pageIndex -
        1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}${startsWithQuery}`
    )
  }

  _getPathOrParentID(newProps) {
    return newProps.parentID ? newProps.parentID : newProps.routeParams.dialect_path + '/Dictionary'
  }

  _onEntryNavigateRequest(item) {
    if (this.props.action) {
      this.props.action(item)
    } else {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, item, 'phrases'),
        this.props.pushWindowPath,
        true
      )
    }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computePhrases } = fvPhrase
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computePhrases,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPhrases,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhrasesListView)
