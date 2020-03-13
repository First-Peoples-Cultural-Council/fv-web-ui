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
import React, { Component } from 'react' // eslint-disable-line
import PropTypes from 'prop-types'
import Immutable, { Set } from 'immutable' // eslint-disable-line
import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { hasPagination, routeHasChanged } from 'common/NavigationHelpers'
/**
 * Learn Base Page
 * TODO: Convert to composition vs. inheritance https://facebook.github.io/react/docs/composition-vs-inheritance.html
 * NOTE: The `class` that `extends` `PageDialectLearnBase` must define a `fetchData` function
 * NOTE: The `class` that `extends` `PageDialectLearnBase` should NOT define: `componentDidMount`, `componentWillReceiveProps`
 */

// NOTE:
// Multiple components are `extend`ing this file but `extend`ing is difficult to work with
// since it's not clear what methods will be called and from where.
// We would like to drop the `extends` convention and use composition instead.
// During the transition period there will be duplication in this file.
// Most methods found within `PageDialectLearnBase` will be duplicated below and `export`ed.

// ================================================================
// FOR COMPONENTS THAT ARE EXTENDING
// EG: `PageDialectLearnPhrases extends PageDialectLearnBase`
// ================================================================
export default class PageDialectLearnBase extends Component {
  static defaultProps = {}
  static propTypes = {
    pushWindowPath: PropTypes.any, // TODO: set appropriate propType
    windowPath: PropTypes.any, // TODO: set appropriate propType
    hasPagination: PropTypes.any, // TODO: set appropriate propType
    splitWindowPath: PropTypes.any, // TODO: set appropriate propType
    routeParams: PropTypes.any, // TODO: set appropriate propType
    updatePageProperties: PropTypes.any, // TODO: set appropriate propType
  }

  constructor(props, context) {
    super(props, context)

    if (typeof this.fetchData === 'undefined') {
      // eslint-disable-next-line
      console.warn("The class that extends 'PageDialectLearnBase' must define a 'fetchData' function")
    }
  }

  fetchData() {
    // eslint-disable-next-line
    console.warn('The `class` that `extends` `PageDialectLearnBase` must define a `fetchData` function')
  }

  _onNavigateRequest(path /*, absolute = false*/) {
    if (this.props.hasPagination) {
      NavigationHelpers.navigateForward(
        this.props.splitWindowPath.slice(0, this.props.splitWindowPath.length - 2),
        [path],
        this.props.pushWindowPath
      )
    } else {
      NavigationHelpers.navigateForward(this.props.splitWindowPath, [path], this.props.pushWindowPath)
    }
  }

  _getURLPageProps() {
    const pageProps = {}
    const page = selectn('page', this.props.routeParams)
    const pageSize = selectn('pageSize', this.props.routeParams)

    if (page) {
      pageProps.DEFAULT_PAGE = parseInt(page, 10)
    }
    if (pageSize) {
      pageProps.DEFAULT_PAGE_SIZE = parseInt(pageSize, 10)
    }

    return pageProps
  }

  _handleFilterChange(visibleFilter) {
    this.setState({ visibleFilter })
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)

    // TODO: get rid of this extending setup
    if (this.componentDidMountViaPageDialectLearnBase) {
      this.componentDidMountViaPageDialectLearnBase()
    }
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.fetchData(this.props)
    }
  }

  _handleFacetSelected(facetField, checkedFacetUid, childrenIds, checked, parentFacetUid) {
    const currentCategoryFilterIds = this.state.filterInfo.get('currentCategoryFilterIds')
    let categoryFilter = ''
    let newList
    const childrenIdsList = new Set(childrenIds)

    // Adding filter
    if (checked) {
      newList = currentCategoryFilterIds.add(checkedFacetUid)

      if (childrenIdsList.size > 0) {
        newList = newList.merge(childrenIdsList)
      }
    } else {
      // Removing filter
      newList = currentCategoryFilterIds.delete(currentCategoryFilterIds.keyOf(checkedFacetUid))

      if (parentFacetUid) {
        newList = newList.delete(currentCategoryFilterIds.keyOf(parentFacetUid))
      }

      if (childrenIdsList.size > 0) {
        newList = newList.filter((v) => {
          return !childrenIdsList.includes(v)
        })
      }
    }
    // Category filter
    if (newList.size > 0) {
      categoryFilter = ` AND ${ProviderHelpers.switchWorkspaceSectionKeys(
        facetField,
        this.props.routeParams.area
      )}/* IN ("${newList.join('","')}")`
      /* categoryFilter =
      ' AND ' +
      ProviderHelpers.switchWorkspaceSectionKeys(facetField, this.props.routeParams.area) +
      '/* IN ("' +
      newList.join('","') +
      '")';
      */
    }

    let newFilter = this.state.filterInfo.updateIn(['currentCategoryFilterIds'], () => {
      return newList
    })
    newFilter = newFilter.updateIn(['currentAppliedFilter', 'categories'], () => {
      return categoryFilter
    })

    // Update filter description based on if categories exist or don't exist
    if (newList.size > 0) {
      newFilter = newFilter.updateIn(['currentAppliedFiltersDesc', 'categories'], () => {
        return " match the categories you've selected "
      })
    } else {
      newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'categories'])
    }

    // Update page properties to use when navigating away
    this._handlePagePropertiesChange({ filterInfo: newFilter })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    this._resetURLPagination()

    this.setState({ filterInfo: newFilter })
  }

  handleDialectFilterList(facetField, selected, unselected, type = 'words', resetUrlPagination = true) {
    const categoriesOrPhraseBook = type === 'words' ? 'categories' : 'phraseBook'
    const currentDialectFilterIds = this.state.filterInfo.get('currentCategoryFilterIds')
    let dialectFilter = ''
    let newList = new Set()

    if (unselected) {
      const {
        checkedFacetUid: unselectedCheckedFacetUid,
        childrenIds: unselectedChildrenIds,
        parentFacetUid: unselectedParentFacetUid,
      } = unselected
      // Removing filter
      newList = currentDialectFilterIds.delete(currentDialectFilterIds.keyOf(unselectedCheckedFacetUid))

      if (unselectedParentFacetUid) {
        newList = newList.delete(currentDialectFilterIds.keyOf(unselectedParentFacetUid))
      }
      const unselectedChildrenIdsList = new Set(unselectedChildrenIds)
      if (unselectedChildrenIdsList.size > 0) {
        newList = newList.filter((v) => {
          return !unselectedChildrenIdsList.includes(v)
        })
      }
    }

    if (selected) {
      const { checkedFacetUid: selectedCheckedFacetUid } = selected
      newList = newList.add(selectedCheckedFacetUid)
    }

    // Category filter
    if (newList.size > 0) {
      dialectFilter = ` AND ${ProviderHelpers.switchWorkspaceSectionKeys(
        facetField,
        this.props.routeParams.area
      )}/* IN ("${newList.join('","')}")`
    }

    let newFilter = this.state.filterInfo.updateIn(['currentCategoryFilterIds'], () => {
      return newList
    })
    newFilter = newFilter.updateIn(['currentAppliedFilter', categoriesOrPhraseBook], () => {
      return dialectFilter
    })

    // Update filter description based on if categories exist or don't exist
    if (newList.size > 0) {
      newFilter = newFilter.updateIn(['currentAppliedFiltersDesc', categoriesOrPhraseBook], () => {
        return type === 'words' ? " match the categories you've selected " : " match the phrase books you've selected"
      })
    } else {
      newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', categoriesOrPhraseBook])
    }

    // Note: This strips out the sort by alphabet filter. I can't figure out where it's coming from but this stops it in it's tracks.
    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'])
    // Note: also remove the SearchDialect settings...
    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'])

    if (type === 'words') {
      newFilter = newFilter.deleteIn(['currentAppliedFilter', 'phraseBook'])
    }
    if (type === 'phrases') {
      newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'])
    }

    // Update page properties to use when navigating away
    this._handlePagePropertiesChange({ filterInfo: newFilter })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (resetUrlPagination === true) {
      this._resetURLPagination()
    }

    this.setState({ filterInfo: newFilter })
  }

  // Called when facet filters or sort order change.
  // This needs to be stored in the 'store' so that when people navigate away and back, those filters still apply
  _handlePagePropertiesChange(changedProperties) {
    this.props.updatePageProperties({ [this._getPageKey()]: changedProperties })
  }

  _resetURLPagination({ pageSize = null, preserveSearch = false } = {}) {
    const urlPage = 1
    const urlPageSize = pageSize || this.props.routeParams.pageSize || 10

    const navHelperCallback = (url) => {
      this.props.pushWindowPath(`${url}${preserveSearch ? window.location.search : ''}`)
    }
    const hasPaginationUrl = hasPagination(this.props.splitWindowPath)
    if (hasPaginationUrl) {
      // Replace them
      NavigationHelpers.navigateForwardReplaceMultiple(
        this.props.splitWindowPath,
        [urlPageSize, urlPage],
        navHelperCallback
      )
    } else {
      // No pagination in url (eg: .../learn/words), append `urlPage` & `urlPageSize`
      NavigationHelpers.navigateForward(this.props.splitWindowPath, [urlPageSize, urlPage], navHelperCallback)
    }
  }
}

// ================================================================
// FOR COMPONENTS THAT ARE COMPOSING/IMPORTING
// ================================================================

// onNavigateRequest
// ---------------------------------------------------------
export const onNavigateRequest = ({ hasPagination: _hasPagination, path, pushWindowPath, splitWindowPath }) => {
  if (_hasPagination) {
    NavigationHelpers.navigateForward(splitWindowPath.slice(0, splitWindowPath.length - 2), [path], pushWindowPath)
  } else {
    NavigationHelpers.navigateForward(splitWindowPath, [path], pushWindowPath)
  }
}

// getURLPageProps
// ---------------------------------------------------------
export const getURLPageProps = ({ routeParams }) => {
  const pageProps = {}
  const page = selectn('page', routeParams)
  const pageSize = selectn('pageSize', routeParams)

  if (page) {
    pageProps.DEFAULT_PAGE = parseInt(page, 10)
  }
  if (pageSize) {
    pageProps.DEFAULT_PAGE_SIZE = parseInt(pageSize, 10)
  }

  return pageProps
}

// handleFilterChange
// TODO: this doesn't seem useful for composition
// ---------------------------------------------------------
export const handleFilterChange = ({ visibleFilter, setState }) => {
  // console.log('PageDialectLearnBase > handleFilterChange !')
  setState({ visibleFilter })
}

// handleFacetSelected
// returns immutable object
// which should replace component's `filterInfo`
// Original function ran:
// // Update page properties to use when navigating away
// // this._handlePagePropertiesChange({ filterInfo: newFilter })

// // When facets change, pagination should be reset.
// // In these pages (words/phrase), list views are controlled via URL
// // this._resetURLPagination()

// // this.setState({ filterInfo: newFilter })
// ---------------------------------------------------------
export const handleFacetSelected = ({
  checked,
  checkedFacetUid,
  childrenIds,
  facetField,
  filterInfo, // Immutable, originally was in state
  parentFacetUid,
  routeParams, // Redux
}) => {
  // console.log('PageDialectLearnBase > handleFacetSelected !')
  // debugger
  const currentCategoryFilterIds = filterInfo.get('currentCategoryFilterIds')
  let categoryFilter = ''
  let newList
  const childrenIdsList = new Set(childrenIds)

  // Adding filter
  if (checked) {
    newList = currentCategoryFilterIds.add(checkedFacetUid)

    if (childrenIdsList.size > 0) {
      newList = newList.merge(childrenIdsList)
    }
  } else {
    // Removing filter
    newList = currentCategoryFilterIds.delete(currentCategoryFilterIds.keyOf(checkedFacetUid))

    if (parentFacetUid) {
      newList = newList.delete(currentCategoryFilterIds.keyOf(parentFacetUid))
    }

    if (childrenIdsList.size > 0) {
      newList = newList.filter((v) => {
        return !childrenIdsList.includes(v)
      })
    }
  }
  // Category filter
  if (newList.size > 0) {
    categoryFilter = ` AND ${ProviderHelpers.switchWorkspaceSectionKeys(
      facetField,
      routeParams.area
    )}/* IN ("${newList.join('","')}")`
  }

  let newFilter = filterInfo.updateIn(['currentCategoryFilterIds'], () => {
    return newList
  })
  newFilter = newFilter.updateIn(['currentAppliedFilter', 'categories'], () => {
    return categoryFilter
  })

  // Update filter description based on if categories exist or don't exist
  if (newList.size > 0) {
    newFilter = newFilter.updateIn(['currentAppliedFiltersDesc', 'categories'], () => {
      return " match the categories you've selected "
    })
  } else {
    newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'categories'])
  }

  return newFilter
}

// handleDialectFilterList
// returns immutable object
// which should replace component's `filterInfo`
// Original function ran:
// // Update page properties to use when navigating away
// // this._handlePagePropertiesChange({ filterInfo: newFilter })

// // When facets change, pagination should be reset.
// // In these pages (words/phrase), list views are controlled via URL
// // if (resetUrlPagination === true) {
// //   this._resetURLPagination()
// // }

// // this.setState({ filterInfo: newFilter })
// ---------------------------------------------------------
export const handleDialectFilterList = ({
  facetField,
  filterInfo, // Originally in component's state
  routeParams, // Redux
  selected,
  type = 'words',
  unselected,
}) => {
  const categoriesOrPhraseBook = type === 'words' ? 'categories' : 'phraseBook'
  const currentDialectFilterIds = filterInfo.get('currentCategoryFilterIds')
  let dialectFilter = ''
  let newList = new Set()

  if (unselected) {
    const {
      checkedFacetUid: unselectedCheckedFacetUid,
      childrenIds: unselectedChildrenIds,
      parentFacetUid: unselectedParentFacetUid,
    } = unselected
    // Removing filter
    newList = currentDialectFilterIds.delete(currentDialectFilterIds.keyOf(unselectedCheckedFacetUid))

    if (unselectedParentFacetUid) {
      newList = newList.delete(currentDialectFilterIds.keyOf(unselectedParentFacetUid))
    }
    const unselectedChildrenIdsList = new Set(unselectedChildrenIds)
    if (unselectedChildrenIdsList.size > 0) {
      newList = newList.filter((v) => {
        return !unselectedChildrenIdsList.includes(v)
      })
    }
  }

  if (selected) {
    const { checkedFacetUid: selectedCheckedFacetUid } = selected
    newList = newList.add(selectedCheckedFacetUid)
  }

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
  newFilter = newFilter.updateIn(['currentAppliedFilter', categoriesOrPhraseBook], () => {
    return dialectFilter
  })

  // Update filter description based on if categories exist or don't exist
  if (newList.size > 0) {
    newFilter = newFilter.updateIn(['currentAppliedFiltersDesc', categoriesOrPhraseBook], () => {
      return type === 'words' ? " match the categories you've selected " : " match the phrase books you've selected"
    })
  } else {
    newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', categoriesOrPhraseBook])
  }

  // Note: This strips out the sort by alphabet filter. I can't figure out where it's coming from but this stops it in it's tracks.
  newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'])
  // Note: also remove the SearchDialect settings...
  newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'])

  if (type === 'words') {
    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'phraseBook'])
  }
  if (type === 'phrases') {
    newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'])
  }

  return newFilter
}

// handlePagePropertiesChange
// TODO: this doesn't seem useful for composition
// ---------------------------------------------------------
// Called when facet filters or sort order change.
// This needs to be stored in the 'store' so that when people navigate away and back, those filters still apply
export const handlePagePropertiesChange = ({ changedProperties, getPageKey, updatePageProperties }) => {
  updatePageProperties({ [getPageKey()]: changedProperties })
}

// resetURLPagination
// returns void
// ---------------------------------------------------------
export const resetURLPagination = ({
  pageSize = null,
  preserveSearch = false,
  routeParams,
  pushWindowPath,
  splitWindowPath,
} = {}) => {
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
