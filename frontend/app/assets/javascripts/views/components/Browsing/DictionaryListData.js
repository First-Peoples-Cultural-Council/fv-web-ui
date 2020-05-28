import React, { Component } from 'react'
import Edit from '@material-ui/icons/Edit'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// REDUX: actions/dispatch/func
import { connect } from 'react-redux'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { fetchWords } from 'providers/redux/reducers/fvWord'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { setListViewMode } from 'providers/redux/reducers/listView'
import { setRouteParams } from 'providers/redux/reducers/navigation'

import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenTemplateWords,
} from 'views/components/Browsing/DictionaryListSmallScreen'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import FVButton from 'views/components/FVButton'
import Link from 'views/components/Link'
import NavigationHelpers, { appendPathArrayAfterLandmark, getSearchObject } from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import ProviderHelpers from 'common/ProviderHelpers'
import { sortHandler, useIdOrPathFallback } from 'views/pages/explore/dialect/learn/base'
import UIHelpers from 'common/UIHelpers'
import { WORKSPACES } from 'common/Constants'

class DictionaryListData extends Component {
  DEFAULT_SORT_COL = 'fv:custom_order' // NOTE: Used when paging
  DEFAULT_SORT_TYPE = 'asc'
  DIALECT_FILTER_TYPE = 'words'

  constructor(props) {
    super(props)

    this.computeDocumentkey = `${props.routeParams.dialect_path}/Dictionary`
    this.state = {
      columns: this.getColumns(),
    }
  }

  componentDidUpdate(prevProps) {
    const { routeParams: curRouteParams } = this.props
    const { routeParams: prevRouteParams } = prevProps

    const { letter: curLetter, category: curCategory } = curRouteParams
    const { letter: prevLetter, category: prevCategory } = prevRouteParams

    if (
      curRouteParams.page !== prevRouteParams.page ||
      curRouteParams.pageSize !== prevRouteParams.pageSize ||
      curRouteParams.category !== prevRouteParams.category ||
      curRouteParams.area !== prevRouteParams.area ||
      curCategory !== prevCategory ||
      curLetter !== prevLetter
    ) {
      this.fetchListViewData({ pageIndex: curRouteParams.page, pageSize: curRouteParams.pageSize })
    }
  }

  async componentDidMount() {
    const { routeParams, computeDocument, computePortal } = this.props
    // Document
    await ProviderHelpers.fetchIfMissing(this.computeDocumentkey, this.props.fetchDocument, computeDocument)

    // Portal
    await ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, this.props.fetchPortal, computePortal)
    // Words
    this.fetchListViewData()
  }
  render() {
    const {
      computeDialect2,
      computeDocument,
      computePortal,
      computeSearchDialect,
      computeWords,
      intl,
      listView,
      routeParams,
    } = this.props

    const { dialect_path, page, pageSize } = routeParams

    // Parsing computeDocument
    const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, `${dialect_path}/Dictionary`)
    const computeDocumentResponse = selectn('response', extractComputeDocument)
    const dialectUid = selectn('response.contextParameters.ancestry.dialect.uid', extractComputeDocument)
    const parentId = selectn('uid', computeDocumentResponse)

    // Parsing computePortal
    const extractComputePortal = ProviderHelpers.getEntry(computePortal, `${dialect_path}/Portal`)
    const dialectClassName = getDialectClassname(extractComputePortal)
    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', extractComputePortal) ||
      ''} ${intl.trans('words', 'Words', 'first')}`

    // Parsing computeDialect2
    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const dialect = selectn('response', computedDialect2)

    const { searchNxqlSort = {} } = computeSearchDialect
    const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort

    const computedWords = ProviderHelpers.getEntry(computeWords, parentId)
    const items = selectn('response.entries', computedWords)
    const metadata = selectn('response', computedWords)

    return this.props.children({
      columns: this.state.columns,
      computeDocumentResponse,
      dialect,
      dialectClassName,
      dialectUid,
      fetcher: this.fetcher,
      fetcherParams: { currentPageIndex: routeParams.page, pageSize: routeParams.pageSize },
      items,
      listViewMode: listView.mode,
      metadata,
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      pageTitle,
      parentId,
      routeParams,
      setListViewMode: this.props.setListViewMode,
      smallScreenTemplate: dictionaryListSmallScreenTemplateWords,
      sortCol: DEFAULT_SORT_COL,
      sortHandler: this._sortHandler,
      sortType: DEFAULT_SORT_TYPE,
    })
  }
  fetcher = ({ currentPageIndex, pageSize }) => {
    const { routeParams, splitWindowPath } = this.props
    const newUrl = appendPathArrayAfterLandmark({
      pathArray: [pageSize, currentPageIndex],
      splitWindowPath,
      landmarkArray: [routeParams.category, 'words'],
    })
    if (newUrl) {
      NavigationHelpers.navigate(`/${newUrl}`, this.props.pushWindowPath)
    }
  }

  fetchListViewData({ pageIndex = 1, pageSize = 10 } = {}) {
    const { computeDocument, navigationRouteSearch, routeParams } = this.props

    let currentAppliedFilter = ''
    if (routeParams.category) {
      // Private
      if (routeParams.area === 'Workspaces') {
        currentAppliedFilter = ` AND fv-word:categories/* IN ("${routeParams.category}")`
      }
      // Public
      if (routeParams.area === 'sections') {
        currentAppliedFilter = ` AND fvproxy:proxied_categories/* IN ("${routeParams.category}")`
      }
    }

    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

    const searchObj = getSearchObject()
    // 1st: redux values, 2nd: url search query, 3rd: defaults
    const sortOrder = navigationRouteSearch.sortOrder || searchObj.sortOrder || this.DEFAULT_SORT_TYPE
    const sortBy = navigationRouteSearch.sortBy || searchObj.sortBy || this.DEFAULT_SORT_COL

    const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
    const uid = useIdOrPathFallback({ id: selectn('response.uid', computedDocument), routeParams })

    // const nql = `${currentAppliedFilter}&currentPageIndex=${
    //   pageIndex - 1
    // }&pageSize=${
    //   pageSize
    // }&sortOrder=${
    //   sortOrder
    // }&sortBy=${
    //   sortBy
    // }&enrichment=category_children${
    //   startsWithQuery
    // }`

    const dialectId = selectn(
      'response.contextParameters.ancestry.dialect.uid',
      ProviderHelpers.getEntry(this.props.computeDocument, this.computeDocumentkey)
    )

    const nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&dialectId=${dialectId}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&enrichment=category_children${
      this.props.routeParams.letter
        ? `&letter=${this.props.routeParams.letter}&starts_with_query=Document.CustomOrderQuery`
        : startsWithQuery
    }`

    this.props.fetchWords(uid, nql)
  }
  getColumns = () => {
    const { intl, computeDialect2, DEFAULT_LANGUAGE, computeLogin, routeParams } = this.props

    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const computedDialect2Response = selectn('response', computedDialect2)
    const columns = [
      {
        name: 'title',
        title: intl.trans('word', 'Word', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const isWorkspaces = routeParams.area === WORKSPACES
          const href = NavigationHelpers.generateUIDPath(routeParams.siteTheme, data, 'words')
          const hrefEdit = NavigationHelpers.generateUIDEditPath(routeParams.siteTheme, data, 'words')
          const hrefEditRedirect = `${hrefEdit}?redirect=${encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
          )}`
          const editButton =
            isWorkspaces && hrefEdit ? (
              <AuthorizationFilter
                filter={{
                  entity: computedDialect2Response,
                  login: computeLogin,
                  role: ['Record', 'Approve', 'Everything'],
                }}
                hideFromSections
                routeParams={routeParams}
              >
                <FVButton
                  type="button"
                  variant="flat"
                  size="small"
                  component="a"
                  className="DictionaryList__linkEdit PrintHide"
                  href={hrefEditRedirect}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(hrefEditRedirect, this.props.pushWindowPath, false)
                  }}
                >
                  <Edit title={intl.trans('edit', 'Edit', 'first')} />
                </FVButton>
              </AuthorizationFilter>
            ) : null
          return (
            <>
              <Link className="DictionaryList__link DictionaryList__link--indigenous" href={href}>
                {v}
              </Link>
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
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
        render: (v, data, cellProps) => {
          return UIHelpers.generateOrderedListFromDataset({
            dataSet: selectn(`properties.${cellProps.name}`, data),
            extractDatum: (entry, i) => {
              if (entry.language === DEFAULT_LANGUAGE && i < 2) {
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
        title: intl.trans('audio', 'Audio', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomAudio,
        render: (v, data, cellProps) => {
          const firstAudio = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
          if (firstAudio) {
            return (
              <Preview
                key={selectn('uid', firstAudio)}
                minimal
                tagProps={{ preload: 'none' }}
                styles={{ padding: 0 }}
                tagStyles={{ width: '100%', minWidth: '230px' }}
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
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data, cellProps) => {
          const firstPicture = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
          if (firstPicture) {
            return (
              <img
                className="PrintHide itemThumbnail"
                key={selectn('uid', firstPicture)}
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
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => selectn('contextParameters.word.part_of_speech', data),
        sortBy: 'fv-word:part_of_speech',
      },
    ]

    // NOTE: Append `categories` & `state` columns if on Workspaces
    if (routeParams.area === WORKSPACES) {
      columns.push({
        name: 'fv-word:categories',
        title: intl.trans('categories', 'Categories', 'first'),
        render: (v, data) => {
          return UIHelpers.generateDelimitedDatumFromDataset({
            dataSet: selectn('contextParameters.word.categories', data),
            extractDatum: (entry) => selectn('dc:title', entry),
          })
        },
      })

      columns.push({
        name: 'state',
        title: intl.trans('state', 'State', 'first'),
      })
    }

    return columns
  }

  _sortHandler = async ({ page, pageSize, sortBy, sortOrder } = {}) => {
    sortHandler({
      page,
      pageSize,
      pushWindowPath: this.props.pushWindowPath,
      routeParams: this.props.routeParams,
      setRouteParams: this.props.setRouteParams,
      sortBy,
      sortOrder,
      splitWindowPath: this.props.splitWindowPath,
    })
  }
}

// PROPTYPES
const { any, array, func, object } = PropTypes
DictionaryListData.propTypes = {
  children: any,
  DEFAULT_LANGUAGE: any, // TODO ?
  // REDUX: reducers/state
  computeDialect2: object.isRequired,
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  computeSearchDialect: object.isRequired,
  computeWords: object.isRequired,
  intl: object.isRequired,
  listView: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  navigationRouteSearch: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  fetchWords: func.isRequired,
  pushWindowPath: func.isRequired,
  setListViewMode: func.isRequired,
  setRouteParams: func.isRequired,
}
DictionaryListData.defaultProps = {
  searchDialectUpdate: () => {},
  DEFAULT_LANGUAGE: 'english',
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const {
    document,
    fvDialect,
    fvPortal,
    fvWord,
    listView,
    locale,
    navigation,
    nuxeo,
    searchDialect,
    windowPath,
  } = state

  const { computeDialect2 } = fvDialect
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { computeWords } = fvWord
  const { intlService } = locale
  const { route } = navigation
  const { splitWindowPath } = windowPath

  return {
    computeDialect2,
    computeDocument,
    computeLogin,
    computePortal,
    computeSearchDialect,
    computeWords,
    intl: intlService,
    listView,
    routeParams: route.routeParams,
    splitWindowPath,
    navigationRouteSearch: route.search,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchPortal,
  fetchWords,
  pushWindowPath,
  setListViewMode,
  setRouteParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryListData)
