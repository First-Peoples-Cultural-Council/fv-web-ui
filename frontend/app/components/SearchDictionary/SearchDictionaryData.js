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
import NavigationHelpers from 'common/NavigationHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
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
  const { changePagination } = useNavigationHelpers()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { computeSearchDocuments, searchDocuments } = useSearch()
  const { replaceWindowPath } = useWindowPath()

  // Local State
  const [newSearchValue, setNewSearchValue] = useState(routeParams.searchTerm)
  const [currentFilter, setCurrentFilter] = useState("FVWord','FVPhrase','FVBook")

  const computedSearchDocuments = ProviderHelpers.getEntry(computeSearchDocuments, getQueryPath())
  const entries = selectn('response.entries', computedSearchDocuments)
  const formattedData = entries ? formatData(entries) : []
  const computeEntities = Immutable.fromJS([
    {
      id: getQueryPath(),
      entity: computeSearchDocuments,
    },
  ])

  // Filters
  const filters = [
    { type: "FVWord','FVPhrase','FVBook", label: 'All' },
    { type: 'FVWord', label: 'Words' },
    { type: 'FVPhrase', label: 'Phrases' },
    { type: 'FVBook', label: 'Songs/Stories' },
  ]

  useEffect(() => {
    fetchSearchResults()
  }, [currentFilter, routeParams.page, routeParams.pageSize])

  function fetchSearchResults() {
    if (routeParams.searchTerm && routeParams.searchTerm !== '') {
      const _searchTerm = StringHelpers.clean(routeParams.searchTerm, CLEAN_FULLTEXT)
      const latestVersion = routeParams.area === SECTIONS ? ' AND ecm:isLatestVersion = 1' : ' '
      searchDocuments(
        getQueryPath(),
        `${latestVersion} AND ecm:primaryType IN ('${currentFilter}') AND ( ecm:fulltext_dictionary_all_field = '${_searchTerm}' OR /*+ES: OPERATOR(fuzzy) */ fv:definitions/*/translation ILIKE '${_searchTerm}' OR /*+ES: OPERATOR(fuzzy) */ dc:title ILIKE '${_searchTerm}' )&currentPageIndex=${routeParams.page -
          1}&pageSize=${routeParams.pageSize}&sortBy=ecm:fulltextScore`
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

  // Format data for consumption by the presentation layer
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
    return _formattedData
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

  const handleFilter = (type) => {
    setCurrentFilter(type)
  }

  return children({
    computeEntities,
    currentFilter,
    filters,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    hasItems: formattedData && formattedData.length !== 0,
    intl,
    items: formattedData,
    searchTerm: routeParams.searchTerm,
    newSearchValue,
    // Props for Pagination
    changePagination,
    page: Number(routeParams.page),
    pageSize: Number(routeParams.pageSize),
    resultsCount: selectn('response.resultsCount', computedSearchDocuments),
  })
}
// PROPTYPES
const { func } = PropTypes
SearchDictionaryData.propTypes = {
  children: func,
}

export default SearchDictionaryData
