/* Copyright 2016 First People's Cultural Council

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
import { useEffect, useState } from 'react'
import { Set, Map, is } from 'immutable'
import selectn from 'selectn'

import useDocument from 'DataSource/useDocument'
import useIntl from 'DataSource/useIntl'
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import useProperties from 'DataSource/useProperties'
import useSearchDialect from 'DataSource/useSearchDialect'
import useWindowPath from 'DataSource/useWindowPath'

import NavigationHelpers, { hasPagination } from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import {
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_PART_OF_SPEECH_ANY,
} from 'views/components/SearchDialect/constants'

function WordsData(props) {
  const { computeDocument } = useDocument()
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { properties, updatePageProperties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()
  const { computeSearchDialect, searchDialectUpdate, searchDialectReset } = useSearchDialect()

  const [filterInfo, setfilterInfo] = useState(initialFilterInfo())

  useEffect(() => {
    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn(
        [[`${routeParams.area}_${routeParams.dialect_name}_learn_words`], 'filterInfo'],
        properties.pageProperties
      )
      if (pagePropertiesFilterInfo) {
        setfilterInfo(pagePropertiesFilterInfo)
      }
    }
    if (routeParams.category === undefined) {
      setfilterInfo(initialFilterInfo())
    }
    // Specify how to clean up after this effect:
    return searchDialectReset
  }, [])

  function initialFilterInfo() {
    const routeParamsCategory = routeParams.category
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-word:categories',
      routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    return new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        categories: currentAppliedFilterCategories,
      }),
    })
  }

  const changeFilter = ({ href, updateUrl = true } = {}) => {
    const { searchByMode, searchNxqlQuery } = computeSearchDialect
    let searchType
    let newFilter = filterInfo

    switch (searchByMode) {
      case SEARCH_BY_ALPHABET: {
        searchType = 'startsWith'
        break
      }
      case SEARCH_BY_CATEGORY: {
        searchType = 'categories'
        break
      }
      default: {
        searchType = 'contains'
      }
    }

    // Remove all old settings...
    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    // Add new search query
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => {
      return searchNxqlQuery && searchNxqlQuery !== '' ? ` AND ${searchNxqlQuery}` : ''
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(filterInfo, newFilter) === false) {
      setfilterInfo(newFilter)
      if (href && updateUrl) {
        NavigationHelpers.navigate(href, pushWindowPath, false)
      } else {
        resetURLPagination({ preserveSearch: true })
      }
    }
  }

  const clearDialectFilter = () => {
    setfilterInfo(initialFilterInfo())
  }

  const resetSearch = () => {
    let newFilter = filterInfo

    newFilter = newFilter.set('currentAppliedFilter', new Map())

    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())

    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    setfilterInfo(newFilter)

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
      resetURLPagination()
    }
  }

  const setDialectFilter = async ({ selected, href, updateUrl }) => {
    await searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CATEGORY,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchingDialectFilter: selected.checkedFacetUid,
      searchTerm: '',
    })
    changeFilter({ href, updateUrl })
  }

  const handleAlphabetClick = async ({ letterClicked, href, updateHistory }) => {
    await searchDialectUpdate({
      searchByAlphabet: letterClicked,
      searchByMode: SEARCH_BY_ALPHABET,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })
    changeFilter({ href, updateUrl: updateHistory })
  }

  const handleDialectFilterList = (facetField, resetUrlPagination = true) => {
    let dialectFilter = ''
    const newList = new Set()

    // Category filter
    if (newList.size > 0) {
      dialectFilter = ` AND ${ProviderHelpers.switchWorkspaceSectionKeys(
        facetField,
        routeParams.area
      )}/* IN ("${newList.join('","')}")`
    }

    let newFilter = filterInfo.updateIn(['currentCategoryFilterIds'], () => {
      return newList
    })
    newFilter = newFilter.updateIn(['currentAppliedFilter', 'categories'], () => {
      return dialectFilter
    })

    // Update filter description based on if categories exist or don't exist
    if (newList.size > 0) {
      newFilter = newFilter.updateIn(['currentAppliedFiltersDesc', 'categories'], () => {
        return " match the categories you've selected "
      })
    } else {
      newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'categories'])
    }

    // Note: This strips out the sort by alphabet filter.
    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'])
    // Note: also remove the SearchDialect settings...
    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'])

    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'phraseBook'])

    // Update page properties to use when navigating away
    handlePagePropertiesChange({ filterInfo: newFilter })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (resetUrlPagination === true) {
      resetURLPagination()
    }

    setfilterInfo(newFilter)
  }

  const handlePagePropertiesChange = (changedProperties) => {
    updatePageProperties({ [`${routeParams.area}_${routeParams.dialect_name}_learn_words`]: changedProperties })
  }

  const onNavigateRequest = (path) => {
    if (hasPagination) {
      NavigationHelpers.navigateForward(splitWindowPath.slice(0, splitWindowPath.length - 2), [path], pushWindowPath)
    } else {
      NavigationHelpers.navigateForward(splitWindowPath, [path], pushWindowPath)
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

  return props.children({
    changeFilter: changeFilter,
    clearDialectFilter: clearDialectFilter,
    computeDocument: computeDocument,
    computeLogin: computeLogin,
    constSearchByAlphabet: SEARCH_BY_ALPHABET,
    constSearchPartOfSpeechAny: SEARCH_PART_OF_SPEECH_ANY,
    dialectFilterListWillUnmount: ({ facetField, resetUrlPagination }) => {
      handleDialectFilterList(facetField, resetUrlPagination)
    },
    filterInfo: filterInfo,
    flashcardMode: false,
    handleAlphabetClick: (event) => handleAlphabetClick(event),
    intl: intl,
    isKidsTheme: routeParams.siteTheme === 'kids',
    onNavigateRequest: onNavigateRequest,
    pushWindowPath: pushWindowPath,
    resetSearch: resetSearch,
    routeParams: routeParams,
    setDialectFilter: setDialectFilter,
    splitWindowPath: splitWindowPath,
  })
}

export default WordsData
