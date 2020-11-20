import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import useNavigationHelpers from 'common/useNavigationHelpers'
function DialectFilterListData({ children, filterListData, queryParam }) {
  const { getSearchAsObject } = useNavigationHelpers()
  const [listItemData, setListItemData] = useState([])
  const [sortedFacets, setSortedFacets] = useState()
  // Sort functions:
  const sortByTitle = (a, b) => {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }
  const sortDialectFilters = (filters = []) => {
    const _filters = [...filters]
    // Sort root level
    _filters.sort(sortByTitle)
    const _filtersSorted = _filters.map((filter) => {
      // Sort children
      const childrenEntries = selectn('contextParameters.children.entries', filter)
      if (childrenEntries.length > 0) {
        childrenEntries.sort(sortByTitle)
      }
      return filter
    })
    return _filtersSorted
  }
  useEffect(() => {
    setSortedFacets(sortDialectFilters(filterListData))
  }, [filterListData])

  const { category: queryCategory, phraseBook: queryPhraseBook } = getSearchAsObject()
  useEffect(() => {
    if (sortedFacets) {
      // Need to rebuild data in order to set the active flags within the data
      setListItemData(generateListItemData(sortedFacets))
    }
  }, [sortedFacets, queryCategory, queryPhraseBook])

  // generateListItemData
  // ---------------------------------------------------
  // Generates data structure representing the list
  // Processes `filters` and transforms into an object to be used by the Presentation layer
  //
  // returns = [
  //   { // Top level category
  //     children: [ // Children categories of the top level category
  //       {
  //         hasActiveParent,
  //         href,
  //         isActive,
  //         text,
  //         uid,
  //       },
  //       /* More children... */
  //     ],
  //     hasActiveChild,
  //     href,
  //     isActive,
  //     text,
  //     uid,
  //   },
  //   /* More top level categories... */
  // ]
  const generateListItemData = (filters) => {
    const toReturn = []
    const selectedFilterId = queryParam === 'category' ? queryCategory : queryPhraseBook
    filters.forEach((filter) => {
      const childData = []
      const uidParent = filter.uid

      // Process children
      const childrenEntries = selectn('contextParameters.children.entries', filter)
      const parentIsActive = selectedFilterId === uidParent
      let hasActiveChild = false

      if (childrenEntries.length > 0) {
        childrenEntries.forEach((filterChild) => {
          // TEMP FIX FOR: FW-1337: Filtering trashed children documents
          if (filterChild.isTrashed) return
          const uidChild = filterChild.uid
          const childIsActive = selectedFilterId === uidChild
          // Set flag for parent processing
          hasActiveChild = childIsActive
          // Save child data
          childData.push({
            hasActiveParent: parentIsActive,
            href: `${window.location.pathname}?${queryParam}=${uidChild}`,
            isActive: childIsActive,
            text: filterChild.title,
            uid: uidChild,
          })
        })
      }

      // Process parent
      toReturn.push({
        children: childData,
        hasActiveChild: hasActiveChild,
        href: `${window.location.pathname}?${queryParam}=${uidParent}`,
        isActive: parentIsActive,
        text: filter.title,
        uid: uidParent,
      })
    })
    return toReturn
  }
  return children({
    listItemData: listItemData,
  })
}

// PROPTYPES
const { array, func, oneOf } = PropTypes
DialectFilterListData.propTypes = {
  children: func,
  filterListData: array.isRequired,
  queryParam: oneOf(['category', 'phraseBook']),
}

export default DialectFilterListData
