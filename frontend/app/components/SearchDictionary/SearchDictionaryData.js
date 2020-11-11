import { useEffect, useState } from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// DataSources
import useIntl from 'dataSources/useIntl'
import useProperties from 'dataSources/useProperties'
import useRoute from 'dataSources/useRoute'
import useSearch from 'dataSources/useSearch'
import useWindowPath from 'dataSources/useWindowPath'

// Common
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'
import StringHelpers, { CLEAN_FULLTEXT } from 'common/StringHelpers'
import { SECTIONS } from 'common/Constants'

/**
 * @summary SearchDictionaryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchDictionaryData({ children }) {
  //DataSources
  const { intl } = useIntl()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { computeSearchDocuments, searchDocuments } = useSearch()
  const { pushWindowPath, replaceWindowPath, splitWindowPath } = useWindowPath()

  // Local State
  const [newSearchValue, setNewSearchValue] = useState(routeParams.searchTerm)
  const [formattedData, setformattedData] = useState([])

  useEffect(() => {
    fetchSearchResults()
  }, [])

  // Parsing response
  const extractComputeSearchDocuments = ProviderHelpers.getEntry(computeSearchDocuments, getQueryPath())
  const currentQueryAction = selectn('action', extractComputeSearchDocuments)
  const metadata = selectn('response', extractComputeSearchDocuments)
  const entries = selectn('response.entries', extractComputeSearchDocuments)
  const computeEntities = Immutable.fromJS([
    {
      id: getQueryPath(),
      entity: computeSearchDocuments,
    },
  ])

  // Format data when it is returned
  useEffect(() => {
    if (currentQueryAction === 'FV_SEARCH_DOCUMENTS_QUERY_SUCCESS') {
      formatData(entries)
    }
  }, [currentQueryAction])

  function fetchSearchResults({ pageIndex = 1, pageSize = 10 } = {}) {
    if (routeParams.searchTerm && routeParams.searchTerm !== '') {
      const _searchTerm = StringHelpers.clean(routeParams.searchTerm, CLEAN_FULLTEXT)
      const latestVersion = routeParams.area === SECTIONS ? ' AND ecm:isLatestVersion = 1' : ' '
      searchDocuments(
        getQueryPath(),
        `${latestVersion} AND ecm:primaryType IN ('FVWord','FVPhrase','FVBook') AND ( ecm:fulltext_dictionary_all_field = '${_searchTerm}' OR /*+ES: OPERATOR(fuzzy) */ fv:definitions/*/translation ILIKE '${_searchTerm}' OR /*+ES: OPERATOR(fuzzy) */ dc:title ILIKE '${_searchTerm}' )&currentPageIndex=${pageIndex -
          1}&pageSize=${pageSize}&sortBy=ecm:fulltextScore`
      )
    }
  }

  function getQueryPath() {
    return (
      routeParams.dialect_path ||
      routeParams.language_path ||
      routeParams.language_family_path ||
      `/${properties.domain}/${routeParams.area || SECTIONS}/Data`
    )
  }

  function formatData(data) {
    const _formattedData = []
    data.forEach(function format(entry) {
      // Set basic properties
      const formattedEntry = {
        uid: entry.uid,
        title: entry.properties['dc:title'],
        dialect: selectn(['contextParameters', 'ancestry', 'dialect', 'dc:title'], entry),
      }
      // Set doc type specific properties
      switch (entry.type) {
        case 'FVWord':
          formattedEntry.type = 'word'
          formattedEntry.href = NavigationHelpers.generateUIDPath(routeParams.siteTheme, entry, 'words')
          formattedEntry.translations = selectn('properties.fv:definitions', entry)
          formattedEntry.audio = selectn('contextParameters.word.related_audio[0]', entry)
          formattedEntry.picture = selectn('contextParameters.word.related_pictures[0]', entry)
          _formattedData.push(formattedEntry)
          break
        case 'FVPhrase':
          formattedEntry.type = 'phrase'
          formattedEntry.href = NavigationHelpers.generateUIDPath(routeParams.siteTheme, entry, 'phrases')
          formattedEntry.translations = selectn('properties.fv:definitions', entry)
          formattedEntry.audio = selectn('contextParameters.phrase.related_audio[0]', entry)
          formattedEntry.picture = selectn('contextParameters.phrase.related_pictures[0]', entry)
          _formattedData.push(formattedEntry)
          break
        case 'FVBook':
          formattedEntry.type = entry.properties['fvbook:type']
          formattedEntry.href = NavigationHelpers.generateUIDPath(
            routeParams.siteTheme,
            entry,
            StringHelpers.makePlural(entry.properties['fvbook:type'])
          )
          formattedEntry.translations = selectn('properties.fvbook:title_literal_translation', entry)
          _formattedData.push(formattedEntry)
          break
        default:
          _formattedData.push({ type: data.type })
      }
    })
    setformattedData(_formattedData)
  }

  const handleTextFieldChange = (event) => {
    setNewSearchValue(event.target.value)
  }

  const handleSearchSubmit = () => {
    if (newSearchValue && newSearchValue !== '') {
      const finalPath = NavigationHelpers.generateStaticURL('explore' + getQueryPath() + '/search/' + newSearchValue)
      replaceWindowPath(finalPath)
    }
  }

  function fetcher({ currentPageIndex, pageSize }) {
    const newUrl = appendPathArrayAfterLandmark({
      pathArray: [pageSize, currentPageIndex],
      splitWindowPath: splitWindowPath,
      landmarkArray: [routeParams.searchTerm],
    })
    NavigationHelpers.navigate(`/${newUrl}`, pushWindowPath)
  }

  return children({
    computeEntities,
    entries: formattedData,
    handleSearchSubmit,
    handleTextFieldChange,
    intl,
    searchTerm: routeParams.searchTerm,
    newSearchValue,
    // Props for withPagination
    fetcher,
    fetcherParams: {
      currentPageIndex: routeParams.page,
      pageSize: routeParams.pageSize,
    },
    metadata,
  })
}
// PROPTYPES
const { func } = PropTypes
SearchDictionaryData.propTypes = {
  children: func,
}

export default SearchDictionaryData
