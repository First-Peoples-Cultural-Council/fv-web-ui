import PropTypes from 'prop-types'

import React, { useEffect, useState } from 'react'
import Edit from '@material-ui/icons/Edit'
import selectn from 'selectn'
import Immutable from 'immutable'

// FPCC

//DataSources
import useDialect from 'DataSource/useDialect'
import useDocument from 'DataSource/useDocument'
import useIntl from 'DataSource/useIntl'
import useListView from 'DataSource/useListView'
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import usePortal from 'DataSource/usePortal'
import useSearchDialect from 'DataSource/useSearchDialect'
import useWindowPath from 'DataSource/useWindowPath'
import useWord from 'DataSource/useWord'

// Helpers
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import NavigationHelpers, {
  appendPathArrayAfterLandmark,
  getSearchObject,
  hasPagination,
  updateUrlIfPageOrPageSizeIsDifferent,
} from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import { WORKSPACES } from 'common/Constants'

// Components
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import FVButton from 'views/components/FVButton'
import Link from 'views/components/Link'
import Preview from 'views/components/Editor/Preview'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenTemplateWords,
  dictionaryListSmallScreenColumnDataTemplateCustomState,
} from 'views/components/Browsing/DictionaryListSmallScreen'

/**
 * @summary WordsListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */

function WordsListData({ children }) {
  const { computeDocument, fetchDocument } = useDocument()
  const { computeDialect2, fetchDialect2 } = useDialect()
  const { intl } = useIntl()
  const { listView, setListViewMode } = useListView()
  const { computeLogin } = useLogin()
  const { routeParams, setRouteParams, navigationRouteSearch } = useRoute()
  const { computePortal, fetchPortal } = usePortal()
  const { computeSearchDialect } = useSearchDialect()
  const { pushWindowPath, splitWindowPath } = useWindowPath()
  const { computeWords, fetchWords } = useWord()

  const { searchNxqlQuery = '' } = computeSearchDialect
  //

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (curFetchDocumentAction === 'FV_DOCUMENT_FETCH_SUCCESS') {
      fetchListViewData({ pageIndex: routeParams.page, pageSize: routeParams.pageSize })
    }
  }, [
    curFetchDocumentAction,
    routeParams.area,
    routeParams.category,
    routeParams.letter,
    routeParams.page,
    routeParams.pageSize,
    navigationRouteSearch,
  ])

  const dictionaryKey = `${routeParams.dialect_path}/Dictionary`
  const DEFAULT_LANGUAGE = 'english'
  const { searchNxqlSort = {} } = computeSearchDialect
  const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort

  const [columns] = useState(getColumns())

  // Parsing computeDocument
  const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, dictionaryKey)
  const dialectUid = selectn('response.contextParameters.ancestry.dialect.uid', extractComputeDocument)
  const curFetchDocumentAction = selectn('action', extractComputeDocument)
  const dictionary = selectn('response', extractComputeDocument)
  const dictionaryId = selectn('uid', dictionary)

  // Parsing computePortal
  const extractComputePortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
  const dialectClassName = getDialectClassname(extractComputePortal)
  const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', extractComputePortal) ||
    ''} ${intl.trans('words', 'Words', 'first')}`

  // Parsing computeDialect2
  const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const dialect = selectn('response', computedDialect2)

  // Parsing computeWords
  const computedWords = ProviderHelpers.getEntry(computeWords, dictionaryKey)
  const items = selectn('response.entries', computedWords)
  const metadata = selectn('response', computedWords)

  const computeEntities = Immutable.fromJS([
    {
      id: dictionaryKey,
      entity: computeWords,
    },
  ])

  const fetchData = async () => {
    // Dialect
    await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
    // Document
    await ProviderHelpers.fetchIfMissing(dictionaryKey, fetchDocument, computeDocument)
    // Portal
    await ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, fetchPortal, computePortal)
    // Words
    fetchListViewData()
  }

  async function fetchListViewData({ pageIndex = 1, pageSize = 10, resetSearch = false } = {}) {
    let currentAppliedFilter = ''

    if (searchNxqlQuery && !resetSearch) {
      currentAppliedFilter = ` AND ${searchNxqlQuery}`
    }

    if (routeParams.category && !resetSearch) {
      // Private
      if (routeParams.area === 'Workspaces') {
        currentAppliedFilter = ` AND fv-word:categories/* IN ("${routeParams.category}") &enrichment=category_children`
      }
      // Public
      if (routeParams.area === 'sections') {
        currentAppliedFilter = ` AND fvproxy:proxied_categories/* IN ("${routeParams.category}") &enrichment=category_children`
      }
    }
    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)
    const searchObj = getSearchObject()
    // 1st: redux values, 2nd: url search query, 3rd: defaults
    const sortOrder = navigationRouteSearch.sortOrder || searchObj.sortOrder || DEFAULT_SORT_TYPE
    const sortBy = navigationRouteSearch.sortBy || searchObj.sortBy || DEFAULT_SORT_COL

    const nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&dialectId=${dialectUid}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}${
      routeParams.letter ? `&letter=${routeParams.letter}&starts_with_query=Document.CustomOrderQuery` : startsWithQuery
    }`

    fetchWords(dictionaryKey, nql)
  }

  function getColumns() {
    const columnsArray = [
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
                  entity: dialect,
                  login: computeLogin,
                  role: ['Record', 'Approve', 'Everything'],
                }}
                hideFromSections
                routeParams={routeParams}
              >
                <FVButton
                  type="button"
                  disableElevation
                  size="small"
                  component="a"
                  className="WordsList__linkEdit PrintHide"
                  href={hrefEditRedirect}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(hrefEditRedirect, pushWindowPath, false)
                  }}
                >
                  <Edit title={intl.trans('edit', 'Edit', 'first')} />
                </FVButton>
              </AuthorizationFilter>
            ) : null
          return (
            <>
              <Link className="WordsList__link WordsList__link--indigenous" href={href}>
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
            classNameList: 'WordsList__definitionList',
            classNameListItem: 'WordsList__definitionListItem',
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
      columnsArray.push({
        name: 'fv-word:categories',
        title: intl.trans('categories', 'Categories', 'first'),
        render: (v, data) => {
          return UIHelpers.generateDelimitedDatumFromDataset({
            dataSet: selectn('contextParameters.word.categories', data),
            extractDatum: (entry) => selectn('dc:title', entry),
          })
        },
      })
      columnsArray.push({
        name: 'state',
        title: intl.trans('state', 'State', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomState,
      })
    }
    return columnsArray
  }

  function fetcher({ currentPageIndex, pageSize }) {
    let newUrl = ''
    if (routeParams.letter) {
      newUrl = appendPathArrayAfterLandmark({
        pathArray: [pageSize, currentPageIndex],
        splitWindowPath: splitWindowPath,
        landmarkArray: [routeParams.letter],
      })
    } else if (routeParams.category) {
      newUrl = appendPathArrayAfterLandmark({
        pathArray: [pageSize, currentPageIndex],
        splitWindowPath: splitWindowPath,
        landmarkArray: [routeParams.category],
      })
    } else {
      newUrl = appendPathArrayAfterLandmark({
        pathArray: [pageSize, currentPageIndex],
        splitWindowPath: splitWindowPath,
        landmarkArray: ['words'],
      })
    }
    if (newUrl) {
      NavigationHelpers.navigate(`/${newUrl}`, pushWindowPath)
    }
  }

  const sortHandler = async ({ page, pageSize, sortBy, sortOrder } = {}) => {
    await setRouteParams({
      search: {
        pageSize,
        page,
        sortBy,
        sortOrder,
      },
    })
    // Conditionally update the url after a sort event
    updateUrlIfPageOrPageSizeIsDifferent({
      page,
      pageSize,
      pushWindowPath: pushWindowPath,
      routeParamsPage: routeParams.page,
      routeParamsPageSize: routeParams.pageSize,
      splitWindowPath: splitWindowPath,
      windowLocationSearch: window.location.search, // Set only if you want to append the search
    })
  }

  const _resetSearch = () => {
    // Remove alphabet/category filter urls
    if (routeParams.category || routeParams.letter) {
      let resetUrl = `/${splitWindowPath.join('/')}`
      const _splitWindowPath = [...splitWindowPath]
      const learnIndex = _splitWindowPath.indexOf('learn')
      if (learnIndex !== -1) {
        _splitWindowPath.splice(learnIndex + 2)
        resetUrl = `/${_splitWindowPath.join('/')}`
      }
      NavigationHelpers.navigate(`${resetUrl}/${routeParams.pageSize}/1`, pushWindowPath, false)
    } else {
      // When facets change, pagination should be reset.
      // In these pages (words/phrase), list views are controlled via URL
      fetchListViewData({ pageIndex: routeParams.page, pageSize: routeParams.pageSize, resetSearch: true })
      resetURLPagination()
    }
  }

  const resetURLPagination = ({ pageSize = null, preserveSearch = false } = {}) => {
    const urlPage = 1
    const urlPageSize = pageSize || routeParams.pageSize || 10

    const navHelperCallback = (url) => {
      pushWindowPath(`${url}${preserveSearch ? window.location.search : ''}`)
    }
    const hasPaginationUrl = hasPagination(splitWindowPath)
    if (hasPaginationUrl) {
      // Replace them
      NavigationHelpers.navigateForwardReplaceMultiple(splitWindowPath, [urlPageSize, urlPage], navHelperCallback)
    } else {
      // No pagination in url (eg: .../learn/words), append `urlPage` & `urlPageSize`
      NavigationHelpers.navigateForward(splitWindowPath, [urlPageSize, urlPage], navHelperCallback)
    }
  }

  const handleSearch = async ({ href, updateUrl = true } = {}) => {
    if (href && updateUrl) {
      NavigationHelpers.navigate(href, pushWindowPath, false)
    } else {
      resetURLPagination({ preserveSearch: true })
    }

    fetchListViewData({ pageIndex: routeParams.page, pageSize: routeParams.pageSize })
  }

  return children({
    columns: columns,
    computeEntities,
    dialect,
    dialectClassName,
    dialectUid,
    fetcher: fetcher,
    fetcherParams: {
      currentPageIndex: routeParams.page,
      pageSize: routeParams.pageSize,
    },
    handleSearch,
    isKidsTheme: routeParams.siteTheme === 'kids',
    items,
    listViewMode: listView.mode,
    metadata,
    navigationRouteSearch,
    page: parseInt(routeParams.page, 10),
    pageSize: parseInt(routeParams.pageSize, 10),
    pageTitle,
    dictionaryId,
    pushWindowPath,
    routeParams,
    resetSearch: _resetSearch,
    setRouteParams,
    setListViewMode: setListViewMode,
    smallScreenTemplate: dictionaryListSmallScreenTemplateWords,
    sortCol: DEFAULT_SORT_COL,
    sortHandler: sortHandler,
    sortType: DEFAULT_SORT_TYPE,
  })
}

// PROPTYPES
const { func } = PropTypes
WordsListData.propTypes = {
  children: func,
}

export default WordsListData
