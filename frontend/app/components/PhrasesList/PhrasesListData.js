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
import usePhrase from 'dataSources/usePhrase'
import usePortal from 'dataSources/usePortal'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'

// Helpers
import useSearchDialectHelpers from 'common/useSearchDialectHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
import { getDialectClassname } from 'common/Helpers'
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

// Components
import AuthorizationFilter from 'components/AuthorizationFilter'
import FVButton from 'components/FVButton'
import Link from 'components/Link'
import Preview from 'components/Preview'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomState,
} from 'components/DictionaryList/DictionaryListSmallScreen'

import {
  SEARCH_FILTERED_BY_CHARACTER,
  SEARCH_FILTERED_BY_PHRASE_BOOK,
  SEARCHDIALECT_CHECKBOX,
  WORKSPACES,
} from 'common/Constants'

/**
 * @summary PhrasesListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */

function PhrasesListData({ children }) {
  const { computeDocument, fetchDocument } = useDocument()
  const { computeDialect2, fetchDialect2 } = useDialect()
  const { intl } = useIntl()
  const { listView, setListViewMode } = useListView()
  const { computeLogin } = useLogin()
  const { routeParams, setRouteParams } = useRoute()
  const { computePortal, fetchPortal } = usePortal()
  const { pushWindowPath } = useWindowPath()
  const { computePhrases, fetchPhrases } = usePhrase()
  const { getSearchAsObject, convertObjToUrlQuery, navigate } = useNavigationHelpers()
  const [resetCount, setResetCount] = useState(0)
  const { area, dialect_path: dialectPath, siteTheme } = routeParams
  const { generateNxql } = useSearchDialectHelpers()
  const {
    phraseBook: queryPhraseBook,
    letter: queryLetter,
    page: queryPage,
    pageSize: queryPageSize,
    searchByDefinitions: querySearchByDefinitions,
    searchByTitle: querySearchByTitle,
    searchStyle: querySearchStyle,
    searchTerm: querySearchTerm,
    searchByCulturalNotes: querySearchByCulturalNotes,
    sortBy: querySortBy,
    sortOrder: querySortOrder,
  } = getSearchAsObject({
    defaults: {
      page: 1,
      pageSize: 10,
      sortBy: 'dc:title',
      sortOrder: 'desc',
    },
    boolean: ['searchByDefinitions', 'searchByTitle', 'searchByCulturalNotes'],
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

  // Parse Portal
  const extractComputePortal = ProviderHelpers.getEntry(computePortal, portalKey)
  const dialectClassName = getDialectClassname(extractComputePortal)
  const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', extractComputePortal) ||
    ''} ${intl.trans('phrases', 'Phrases', 'first')}`

  // Parse Phrases
  const computedEntries = ProviderHelpers.getEntry(computePhrases, dictionaryKey)
  const items = selectn('response.entries', computedEntries)
  const metadata = selectn('response', computedEntries)

  useEffect(() => {
    if (curFetchDocumentAction === 'FV_DOCUMENT_FETCH_SUCCESS') {
      let currentAppliedFilter
      // Handle phrasebooks
      if (queryPhraseBook) {
        currentAppliedFilter = ` AND ${
          area === 'Workspaces' ? 'fv-phrase:phrase_books' : 'fvproxy:proxied_categories'
        }/* IN ("${queryPhraseBook}")`
      } else {
        const searchNxqlQuery = generateNxql({
          // phraseBook: queryPhraseBook,
          searchByCulturalNotes: querySearchByCulturalNotes,
          searchByDefinitions: querySearchByDefinitions,
          searchByTitle: querySearchByTitle,
          searchStyle: querySearchStyle,
          searchTerm: querySearchTerm,
        })
        currentAppliedFilter = searchNxqlQuery ? ` AND ${searchNxqlQuery}` : ''
      }
      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

      const nql = `${currentAppliedFilter}&currentPageIndex=${queryPage -
        1}&dialectId=${dialectUid}&pageSize=${queryPageSize}&sortOrder=${querySortOrder}&sortBy=${querySortBy}${
        queryLetter ? `&letter=${queryLetter}&starts_with_query=Document.CustomOrderQuery` : startsWithQuery
      }`

      fetchPhrases(dictionaryKey, nql)
    }
  }, [
    area,
    curFetchDocumentAction,
    queryLetter,
    queryPage,
    queryPageSize,
    queryPhraseBook,
    querySearchByCulturalNotes,
    querySearchByDefinitions,
    querySearchByTitle,
    querySearchStyle,
    querySearchTerm,
    querySortBy,
    querySortOrder,
  ])

  const DEFAULT_LANGUAGE = 'english'

  const [columns] = useState(getColumns())

  const computeEntities = Immutable.fromJS([
    {
      id: dictionaryKey,
      entity: computePhrases,
    },
  ])

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
        title: intl.trans('phrase', 'Phrase', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const isWorkspaces = area === WORKSPACES
          const href = NavigationHelpers.generateUIDPath(siteTheme, data, 'phrases')
          const hrefEdit = NavigationHelpers.generateUIDEditPath(siteTheme, data, 'phrases')
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
                  className="PhrasesList__linkEdit PrintHide"
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
              <Link className="PhrasesList__link PhrasesList__link--indigenous" href={href}>
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
            classNameList: 'PhrasesList__definitionList',
            classNameListItem: 'PhrasesList__definitionListItem',
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
          const firstAudio = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
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
          const firstPicture = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
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
    ]
    // NOTE: Append `categories` & `state` columns if on Workspaces
    if (area === WORKSPACES) {
      columnsArray.push({
        name: 'fv-phrase:phrase_books',
        title: intl.trans('phrase books', 'Phrase books', 'first'),
        render: (v, data) => {
          return UIHelpers.generateDelimitedDatumFromDataset({
            dataSet: selectn('contextParameters.phrase.phrase_books', data),
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

  function onPagination({ currentPageIndex: page, pageSize }) {
    navigate(
      `${window.location.pathname}?${convertObjToUrlQuery(Object.assign({}, getSearchAsObject(), { page, pageSize }))}`
    )
  }

  const sortHandler = ({ page, pageSize, sortBy, sortOrder } = {}) => {
    navigate(
      `${window.location.pathname}?${convertObjToUrlQuery(
        Object.assign({}, getSearchAsObject(), { page, pageSize, sortBy, sortOrder })
      )}`
    )
  }

  let browseMode
  if (queryLetter) {
    browseMode = SEARCH_FILTERED_BY_CHARACTER
  }
  if (queryPhraseBook) {
    browseMode = SEARCH_FILTERED_BY_PHRASE_BOOK
  }
  const hrefCreate = `/explore${dialectPath}/learn/phrases/create`
  const onClickCreate = () => {
    navigate(hrefCreate)
  }
  return children({
    browseMode,
    columns,
    computeEntities,
    dialect,
    dialectClassName,
    fetcher: onPagination,
    fetcherParams: {
      currentPageIndex: queryPage,
      pageSize: queryPageSize,
    },
    filter,
    hrefCreate,
    incrementResetCount: () => {
      setResetCount(resetCount + 1)
    },
    items,
    listViewMode: listView.mode,
    metadata,
    navigationRouteSearch: getSearchAsObject(), // TODO REMOVE?
    onClickCreate,
    pageTitle,
    pushWindowPath,
    queryLetter,
    queryPhraseBook,
    querySearchByCulturalNotes,
    querySearchByDefinitions,
    querySearchByTitle,
    querySearchStyle,
    querySearchTerm,
    resetCount,
    routeParams,
    checkboxNames: ['searchByCulturalNotes', 'searchByDefinitions', 'searchByTitle'],
    searchUiSecondary: [
      {
        type: SEARCHDIALECT_CHECKBOX,
        defaultChecked: querySearchByTitle !== undefined ? querySearchByTitle : true,
        idName: 'searchByTitle',
        labelText: 'Phrase',
      },
      {
        type: SEARCHDIALECT_CHECKBOX,
        defaultChecked: querySearchByDefinitions !== undefined ? querySearchByDefinitions : true,
        idName: 'searchByDefinitions',
        labelText: 'Definitions',
      },
      {
        defaultChecked: querySearchByCulturalNotes !== undefined ? querySearchByCulturalNotes : false,
        type: SEARCHDIALECT_CHECKBOX,
        idName: 'searchByCulturalNotes',
        labelText: 'Cultural notes',
      },
    ],
    setListViewMode,
    setRouteParams, // TODO: VERIFY NEEDED
    sortCol: querySortBy,
    sortHandler,
    sortType: querySortOrder,
  })
}

// PROPTYPES
const { func } = PropTypes
PhrasesListData.propTypes = {
  children: func,
}

export default PhrasesListData
