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
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import Immutable, { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDocuments } from 'providers/redux/reducers/search'

import classNames from 'classnames'
import Edit from '@material-ui/icons/Edit'
import selectn from 'selectn'

import AnalyticsHelpers from 'common/AnalyticsHelpers'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import FVButton from 'views/components/FVButton'
import FVLabel from '../../components/FVLabel/index'
import Link from 'views/components/Link'
import NavigationHelpers from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers, { CLEAN_FULLTEXT } from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'
import URLHelpers from 'common/URLHelpers'
import { getListSmallScreen } from 'views/components/Browsing/DictionaryList'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
} from 'views/components/Browsing/DictionaryListSmallScreen'
import { SECTIONS, WORKSPACES } from 'common/Constants'

import '!style-loader!css-loader!./Search.css'

export class Search extends DataListView {
  constructor(props, context) {
    super(props, context)

    this.state = {
      pageInfo: {
        page: selectn('routeParams.page', props) || props.DEFAULT_PAGE,
        pageSize: selectn('routeParams.pageSize', props) || props.DEFAULT_PAGE_SIZE,
      },
    }
  }

  componentDidUpdate(prevProps) {
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
            page: this.state.pageInfo.page,
            pageSize: this.state.pageInfo.pageSize,
          },
        },
        () => {
          this._fetchListViewData(
            this.props,
            this.state.pageInfo.page,
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
    const entries = selectn('response.entries', computeSearchDocuments) || []

    return (
      <div className="Search">
        <div className="row">
          <div className={classNames('search-results', 'col-xs-12', 'col-md-12')}>
            <h1>
              <FVLabel transKey="search_results" defaultStr="Search results" transform="first" /> -{' '}
              <span className="fontAboriginalSans">{this.props.routeParams.searchTerm}</span>
            </h1>

            <PromiseWrapper renderOnError computeEntities={computeEntities}>
              {entries.length === 0 ? (
                <div>
                  <p>Sorry, no results were found for this search.</p>
                </div>
              ) : (
                <Suspense fallback={<div>Loading...</div>}>{this._generateMarkup()}</Suspense>
              )}
            </PromiseWrapper>
          </div>
        </div>
      </div>
    )
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

  async _fetchListViewData(props = this.props, pageIndex, pageSize) {
    if (props.routeParams.searchTerm && props.routeParams.searchTerm !== '') {
      await props.searchDocuments(
        this._getQueryPath(props),
        `${
          props.routeParams.area === SECTIONS ? ' AND ecm:isLatestVersion = 1' : ' '
        } AND ecm:primaryType IN ('FVWord','FVPhrase','FVBook','FVPortal') AND ecm:fulltext LIKE '${StringHelpers.clean(
          props.routeParams.searchTerm,
          CLEAN_FULLTEXT
          // More specific:
          // ` AND (ecm:fulltext_description = '${props.routeParams.searchTerm}' OR ecm:fulltext_title = '${props.routeParams.searchTerm}'`
        )}'&currentPageIndex=${pageIndex - 1}&pageSize=${pageSize}&sortBy=ecm:fulltextScore`
      )

      // Update url
      const href = `${URLHelpers.getContextPath()}/explore${this._getQueryPath()}/search/${
        this.props.routeParams.searchTerm
      }/${pageSize}/${pageIndex}`
      NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
    }
  }

  _generateMarkup = () => {
    const computeSearchDocuments = ProviderHelpers.getEntry(this.props.computeSearchDocuments, this._getQueryPath())
    const entries = selectn('response.entries', computeSearchDocuments) || []

    return getListSmallScreen({
      hasPagination: true,
      pageSize: 10,
      dictionaryListSmallScreenProps: {
        fetcher: ({ currentPageIndex, pageSize } = {}) => {
          this.setState(
            {
              pageInfo: {
                page: currentPageIndex,
                pageSize: pageSize,
              },
            },
            () => {
              this._fetchListViewData(
                this.props,
                currentPageIndex,
                pageSize,
                this.props.DEFAULT_SORT_TYPE,
                this.props.DEFAULT_SORT_COL
              )
            }
          )
        },
        fetcherParams: {
          currentPageIndex: this.state.pageInfo.page,
          pageSize: this.state.pageInfo.pageSize,
        },
        metadata: selectn('response', computeSearchDocuments),
        // List: small screen
        // --------------------
        items: entries,
        columns: [
          {
            name: 'type',
            title: 'Type',
            columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
            render: (v, data) => {
              const family = selectn(['contextParameters', 'ancestry', 'family', 'dc:title'], data)
              const language = selectn(['contextParameters', 'ancestry', 'language', 'dc:title'], data)
              let itemType
              switch (data.type) {
                case 'FVPhrase':
                  itemType = `${language} » Phrase`
                  break
                case 'FVWord':
                  itemType = `${language} » Word`
                  break
                case 'FVBook':
                  itemType = `${language} » ${data.properties['fvbook:type']}`
                  break
                case 'FVPortal': {
                  itemType = `${family} » ${language}`
                  break
                }
                default:
                  itemType = '-'
              }
              return itemType
            },
          },
          {
            name: 'title',
            title: 'Title',
            columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
            render: (v, data) => {
              let alternateContent
              let href = null
              let hrefEdit = null
              const currentTheme = this.props.routeParams.siteTheme
              if (data.type === 'FVPhrase') {
                href = NavigationHelpers.generateUIDPath(currentTheme, data, 'phrases')
                hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, 'phrases')
              }
              if (data.type === 'FVWord') {
                href = NavigationHelpers.generateUIDPath(currentTheme, data, 'words')
                hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, 'words')
              }
              if (data.type === 'FVBook') {
                let bookType = null
                switch (data.properties['fvbook:type']) {
                  case 'song':
                    bookType = 'songs'
                    break
                  case 'story':
                    bookType = 'stories'
                    break

                  default:
                    break
                }
                href = NavigationHelpers.generateUIDPath(currentTheme, data, bookType)
                hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, bookType)
              }
              if (data.type === 'FVPortal') {
                // Generate URL
                const siteTheme = this.props.routeParams.siteTheme
                const area = this.props.routeParams.area
                const family = (selectn(['contextParameters', 'ancestry', 'family', 'dc:title'], data) || '').replace(
                  /\//g,
                  '_'
                )

                const language = (
                  selectn(['contextParameters', 'ancestry', 'language', 'dc:title'], data) || ''
                ).replace(/\//g, '_')

                const dialect = (selectn(['contextParameters', 'ancestry', 'dialect', 'dc:title'], data) || '').replace(
                  /\//g,
                  '_'
                )

                href = `/${siteTheme}/FV/${area}/Data/${family}/${language}/${dialect}`
                // Pull title text from different location with Portal/Dialects
                alternateContent = selectn(['contextParameters', 'ancestry', 'dialect', 'dc:title'], data)
              }

              const isWorkspaces = this.props.routeParams.area === WORKSPACES

              const computeDialect2 = this.props.dialect /* || this.getDialect()*/

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
                      className="PrintHide"
                      href={hrefEdit}
                      onClick={(e) => {
                        e.preventDefault()
                        NavigationHelpers.navigate(hrefEdit, this.props.pushWindowPath, false)
                      }}
                    >
                      <Edit title={this.props.intl.trans('edit', 'Edit', 'first')} />
                    </FVButton>
                  </AuthorizationFilter>
                ) : null
              return (
                <>
                  <Link className="DictionaryList__link DictionaryList__link--indigenous" href={href}>
                    {alternateContent || v}
                  </Link>
                  {editButton}
                </>
              )
            },
          },
          {
            name: 'fv:definitions',
            title: this.props.intl.trans('definitions', 'Definitions', 'first'),
            columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
            columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
            render: (v, data, cellProps) => {
              return UIHelpers.generateOrderedListFromDataset({
                dataSet: selectn(`properties.${cellProps.name}`, data),
                extractDatum: (entry, i) => {
                  if (entry.language === this.props.DEFAULT_LANGUAGE && i < 2) {
                    return entry.translation
                  }
                  return null
                },
                classNameList: 'DictionaryList__definitionList',
                classNameListItem: 'DictionaryList__definitionListItem',
              })
            },
            sortName: 'fv:definitions/0/translation',
          },
          {
            name: 'related_audio',
            title: this.props.intl.trans('audio', 'Audio', 'first'),
            columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
            columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomAudio,
            render: (v, data, cellProps) => {
              let firstAudio = null
              if (data.type === 'FVPhrase') {
                firstAudio = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
              }
              if (data.type === 'FVWord') {
                firstAudio = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
              }

              if (firstAudio) {
                return (
                  <Preview
                    minimal
                    styles={{ padding: 0 }}
                    tagStyles={{ width: '100%', minWidth: '230px' }}
                    key={selectn('uid', firstAudio)}
                    expandedValue={firstAudio}
                    type="FVAudio"
                  />
                )
              }
            },
          },
        ],
        dictionaryListSmallScreenTemplate: ({ templateData }) => {
          return (
            <div className="DictionaryListSmallScreen__item">
              <div className="DictionaryListSmallScreen__groupMain">
                <div className="DictionaryListSmallScreen__groupMainMiscellaneous">
                  <div className="DictionaryListSmallScreen__searchType">{templateData.type}</div>
                </div>
                <div className="DictionaryListSmallScreen__groupData DictionaryListSmallScreen__groupData--noHorizPad">
                  {templateData.title}
                </div>
                {templateData.related_audio && (
                  <div className="DictionaryListSmallScreen__groupData DictionaryListSmallScreen__groupData--noHorizPad">
                    {templateData.related_audio}
                  </div>
                )}
                {templateData['fv:definitions'] && (
                  <div className="DictionaryListSmallScreen__groupData">
                    <h2 className="DictionaryListSmallScreen__definitionsHeading">Definitions</h2>
                    {templateData['fv:definitions']}
                  </div>
                )}
              </div>
            </div>
          )
        },
      },
    })
  }

  _getQueryPath = (props = this.props) => {
    return (
      props.routeParams.dialect_path ||
      props.routeParams.language_path ||
      props.routeParams.language_family_path ||
      `/${props.properties.domain}/${props.routeParams.area || SECTIONS}/Data`
    )
  }
}

// PROPTYPES
const { array, bool, func, number, object, string } = PropTypes
Search.propTypes = {
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
Search.defaultProps = {
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

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, navigation, nuxeo, search, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeSearchDocuments } = search
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computeSearchDocuments,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
  searchDocuments,
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
