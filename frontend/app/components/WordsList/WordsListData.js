import PropTypes from 'prop-types'

import React, { useEffect, useState } from 'react'
import Edit from '@material-ui/icons/Edit'
import selectn from 'selectn'
import Immutable from 'immutable'

// FPCC

import useDialect from 'dataSources/useDialect'
import useDocument from 'dataSources/useDocument'
import useIntl from 'dataSources/useIntl'
import useListView from 'dataSources/useListView'
import useLogin from 'dataSources/useLogin'
import useRoute from 'dataSources/useRoute'
import usePortal from 'dataSources/usePortal'
import useSearchDialect from 'dataSources/useSearchDialect'
import useWindowPath from 'dataSources/useWindowPath'
import useWord from 'dataSources/useWord'
import useNavigationHelpers from 'common/useNavigationHelpers'

// Helpers
import { getDialectClassname } from 'common/Helpers'
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import { WORKSPACES } from 'common/Constants'

// Components
import AuthorizationFilter from 'components/AuthorizationFilter'
import FVButton from 'components/FVButton'
import Link from 'components/Link'
import Preview from 'components/Preview'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenTemplateWords,
  dictionaryListSmallScreenColumnDataTemplateCustomState,
} from 'components/DictionaryList/DictionaryListSmallScreen'

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
  const { routeParams, setRouteParams } = useRoute()
  const { computePortal, fetchPortal } = usePortal()
  const { computeSearchDialect } = useSearchDialect()
  const { pushWindowPath } = useWindowPath()
  const { computeWords, fetchWords } = useWord()
  const { getSearchAsObject, convertObjToUrlQuery, navigate } = useNavigationHelpers()
  const { siteTheme, dialect_path: dialectPath, area } = routeParams
  // const { searchNxqlQuery = '' } = computeSearchDialect
  const {
    category: queryCategory,
    letter: queryLetter,
    page: queryPage,
    pageSize: queryPageSize,
    sortBy: querySortBy,
    sortOrder: querySortOrder,
  } = getSearchAsObject({
    category: routeParams.category,
    page: 1,
    pageSize: 10,
    sortBy: 'dc:title',
    sortOrder: 'desc',
  })
  const dictionaryKey = `${dialectPath}/Dictionary`
  const portalKey = `${dialectPath}/Portal`

  // Fetch Dialect, Document, Portal
  useEffect(() => {
    ProviderHelpers.fetchIfMissing(dialectPath, fetchDialect2, computeDialect2)
    ProviderHelpers.fetchIfMissing(dictionaryKey, fetchDocument, computeDocument)
    ProviderHelpers.fetchIfMissing(portalKey, fetchPortal, computePortal)
  }, [])

  // Parse Dialect
  const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, dialectPath)
  const dialect = selectn('response', computedDialect2)

  // Parse Document
  const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, dictionaryKey)
  const dialectUid = selectn('response.contextParameters.ancestry.dialect.uid', extractComputeDocument)
  const curFetchDocumentAction = selectn('action', extractComputeDocument)
  const dictionary = selectn('response', extractComputeDocument)
  const dictionaryId = selectn('uid', dictionary)

  // Parse Portal
  const extractComputePortal = ProviderHelpers.getEntry(computePortal, portalKey)
  const dialectClassName = getDialectClassname(extractComputePortal)
  const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', extractComputePortal) ||
    ''} ${intl.trans('words', 'Words', 'first')}`

  // Parse Words
  const computedWords = ProviderHelpers.getEntry(computeWords, dictionaryKey)
  const items = selectn('response.entries', computedWords)
  const metadata = selectn('response', computedWords)

  useEffect(() => {
    if (curFetchDocumentAction === 'FV_DOCUMENT_FETCH_SUCCESS') {
      let currentAppliedFilter = ''
      if (queryCategory) {
        currentAppliedFilter = ` AND ${
          area === 'Workspaces' ? 'fv-word:categories' : 'fvproxy:proxied_categories'
        }/* IN ("${queryCategory}") &enrichment=category_children`
      }
      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

      const nql = `${currentAppliedFilter}&currentPageIndex=${queryPage -
        1}&dialectId=${dialectUid}&pageSize=${queryPageSize}&sortOrder=${querySortOrder}&sortBy=${querySortBy}${
        queryLetter ? `&letter=${queryLetter}&starts_with_query=Document.CustomOrderQuery` : startsWithQuery
      }`

      fetchWords(dictionaryKey, nql)
    }
  }, [curFetchDocumentAction, area, queryCategory, queryLetter, queryPage, queryPageSize, querySortOrder, querySortBy])

  const DEFAULT_LANGUAGE = 'english'
  const { searchNxqlSort = {} } = computeSearchDialect
  const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort

  const [columns] = useState(getColumns())

  const computeEntities = Immutable.fromJS([
    {
      id: dictionaryKey,
      entity: computeWords,
    },
  ])
  /*
  function fetchListViewData({ category, letter, pageIndex, pageSize, sortOrder, sortBy, resetSearch}) {
    let currentAppliedFilter = ''

    if (searchNxqlQuery && resetSearch !== true) {
      currentAppliedFilter = ` AND ${searchNxqlQuery}`
    }

    if (category && resetSearch !== true) {
      // Private
      if (area === 'Workspaces') {
        currentAppliedFilter = ` AND fv-word:categories/* IN ("${category}") &enrichment=category_children`
      }
      // Public
      if (area === 'sections') {
        currentAppliedFilter = ` AND fvproxy:proxied_categories/* IN ("${category}") &enrichment=category_children`
      }
    }
    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

    const nql = `${currentAppliedFilter}&currentPageIndex=${
      pageIndex - 1
    }&dialectId=${dialectUid}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}${
      letter ? `&letter=${letter}&starts_with_query=Document.CustomOrderQuery` : startsWithQuery
    }`

    fetchWords(dictionaryKey, nql)
  }
  */

  // Filter for AuthorizationFilter
  const filter = {
    entity: dictionary,
    login: computeLogin,
    role: ['Record', 'Approve', 'Everything'],
  }

  function getColumns() {
    const columnsArray = [
      {
        name: 'title',
        title: intl.trans('word', 'Word', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const isWorkspaces = area === WORKSPACES
          const href = NavigationHelpers.generateUIDPath(siteTheme, data, 'words')
          const hrefEdit = NavigationHelpers.generateUIDEditPath(siteTheme, data, 'words')
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
                    navigate(hrefEditRedirect)
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
    if (area === WORKSPACES) {
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
        title: 'Visibility',
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomState,
      })
    }
    return columnsArray
  }

  function fetcher({ currentPageIndex, pageSize }) {
    navigate(
      `${window.location.pathname}?${convertObjToUrlQuery(
        Object.assign({}, getSearchAsObject(), { page: currentPageIndex, pageSize })
      )}`
    )
  }

  const sortHandler = ({ page, pageSize, sortBy, sortOrder } = {}) => {
    navigate(
      `${window.location.pathname}?${convertObjToUrlQuery(
        Object.assign({}, getSearchAsObject(), { page, pageSize, sortBy, sortOrder })
      )}`
    )
  }

  const _resetSearch = () => {
    const searchObj = getSearchAsObject()
    const filterOut = ['category', 'letter', 'page', 'sortBy', 'sortOrder']
    const filteredByKey = Object.fromEntries(
      Object.entries(searchObj).filter(([key]) => {
        return filterOut.includes(key) === false
      })
    )
    navigate(
      `${window.location.pathname}?${convertObjToUrlQuery(
        Object.assign({}, filteredByKey, { page: 1, pageSize: searchObj.pageSize })
      )}`
    )
  }

  // TODO: Will be updated over in FW-1188-search-dialect-url
  const handleSearch = (/*{ href, updateUrl = true } = {}*/) => {
    // console.log('handleSearch', {href, updateUrl})
    // if (href && updateUrl) {
    //   navigate(href)
    // } else {
    //   resetURLPagination({ preserveSearch: true })
    // }
    // // fetchListViewData({ pageIndex: queryPage, pageSize: queryPageSize })
  }
  const hrefCreate = `/explore${dialectPath}/learn/words/create`
  return children({
    columns: columns,
    computeEntities,
    dialect,
    dialectClassName,
    dialectUid,
    fetcher,
    fetcherParams: {
      currentPageIndex: queryPage,
      pageSize: queryPageSize,
    },
    filter,
    hrefCreate,
    handleSearch,
    isKidsTheme: siteTheme === 'kids',
    items,
    listViewMode: listView.mode,
    metadata,
    navigationRouteSearch: getSearchAsObject(), // TODO REMOVE?
    page: parseInt(queryPage, 10),
    pageSize: parseInt(queryPageSize, 10),
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
