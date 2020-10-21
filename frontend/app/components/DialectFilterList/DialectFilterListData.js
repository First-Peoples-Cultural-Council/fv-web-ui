/*
generateDataForHistoryEvents: this generates data used when the back/forward buttons are clicked.
May not be necessary if componentDidUpdate handles everything and/or can't we use data created by `generateListItemData`?
*/
import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'

import ProviderHelpers from 'common/ProviderHelpers'

class DialectFilterListData extends Component {
  historyData = {}
  filtersSorted = []
  selectedDialectFilter = undefined

  constructor(props) {
    super(props)

    const { workspaceKey } = this.props
    this.state = {
      // `switchWorkspaceSectionKeys` will return the related `section` "key" when passed a `Workspaces` "key". Think this value would be used in network/nql requests somewhere
      facetField: workspaceKey
        ? ProviderHelpers.switchWorkspaceSectionKeys(workspaceKey, this.props.routeParams.area)
        : '',
      facets: [],
    }
  }
  async componentDidMount() {
    // Bind history events
    window.addEventListener('popstate', this.handleHistoryEvent)

    const { facetType, facets } = this.props

    const selectedDialectFilter = selectn(`${facetType}`, this.props.routeParams)

    if (selectedDialectFilter) {
      this.selectedDialectFilter = selectedDialectFilter
    }

    // We may have data, update this.filtersSorted & history data
    if (facets && facets.length > 0) {
      this.filtersSorted = this.sortDialectFilters(facets)
      this.historyData = this.generateDataForHistoryEvents(this.filtersSorted)

      this.setState(
        {
          facets,
        },
        () => {
          if (this.selectedDialectFilter) {
            const selectedParams = this.historyData[this.selectedDialectFilter]
            if (selectedParams) {
              this.setSelected(selectedParams)
              this.selectedDialectFilter = undefined
            }
          }
        }
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistoryEvent)
  }

  render() {
    return this.props.children({
      listItemData: this.generateListItemData(),
    })
  }

  // Creates url used with <Link>/<a> in Presentation layer
  generateUrlDialectFilterListItem = (filterId) => {
    const { type } = this.props
    let href = `/${this.props.splitWindowPath.join('/')}`
    if (type === 'words') {
      href = `/${appendPathArrayAfterLandmark({
        pathArray: ['categories', filterId],
        splitWindowPath: this.props.splitWindowPath,
        landmarkArray: ['words'],
      })}`
    }
    if (type === 'phrases') {
      href = `/${appendPathArrayAfterLandmark({
        pathArray: ['phrases', 'book', filterId],
        splitWindowPath: this.props.splitWindowPath,
        landmarkArray: ['learn'],
      })}`
    }
    return href
  }

  // generateListItemData
  // ---------------------------------------------------
  // Generates data structure representing the list
  // Processes `filters` and transforms into an object to be used by the Presentation layer
  //
  // returns [
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
  generateListItemData = (filters = this.filtersSorted) => {
    const { selectedCategoryId } = this.props

    const listItemData = []
    filters.forEach((filter) => {
      const childData = []
      const uidParent = filter.uid

      // Process children
      const children = selectn('contextParameters.children.entries', filter)
      const parentIsActive = selectedCategoryId === uidParent
      let hasActiveChild = false

      if (children.length > 0) {
        children.forEach((filterChild) => {
          // TEMP FIX FOR: FW-1337: Filtering trashed children documents
          if (filterChild.isTrashed) return
          const uidChild = filterChild.uid
          const childIsActive = selectedCategoryId === uidChild
          // Set flag for parent processing
          hasActiveChild = childIsActive
          // Save child data
          childData.push({
            hasActiveParent: parentIsActive,
            href: this.generateUrlDialectFilterListItem(uidChild),
            isActive: childIsActive,
            text: filterChild.title,
            uid: uidChild,
          })
        })
      }

      // Process parent
      listItemData.push({
        children: childData,
        hasActiveChild: hasActiveChild,
        href: this.generateUrlDialectFilterListItem(uidParent),
        isActive: parentIsActive,
        text: filter.title,
        uid: uidParent,
      })
    })
    return listItemData
  }

  // This generates data used when the back/forward buttons are clicked.
  // Not certain why it's needed and if it is, why can't we reuse data created by `generateListItemData`?
  // Creates:
  // {
  //   [uid]: {
  //     checkedFacetUid, // ''
  //     childrenIds, // []
  //     href, // ''
  //     parentFacetUid, // '' || undefined
  //   },
  //   // more entries...
  // }
  generateDataForHistoryEvents = (filters) => {
    const newHistoryData = {}
    filters.forEach((filter) => {
      const uidParent = filter.uid

      // Process children
      const childrenUids = []
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.forEach((filterChild) => {
          // TEMP FIX FOR: FW-1337: Filtering trashed children documents
          if (filterChild.isTrashed) return
          const uidChild = filterChild.uid

          childrenUids.push(uidChild)

          // Saving for history events
          newHistoryData[uidChild] = {
            href: this.generateUrlDialectFilterListItem(uidChild),
            checkedFacetUid: uidChild,
            childrenIds: null,
            parentFacetUid: uidParent,
          }
        })
      }

      // Process parent
      const parentClickParams = {
        href: this.generateUrlDialectFilterListItem(uidParent),
        checkedFacetUid: uidParent,
        childrenIds: childrenUids,
        parentFacetUid: undefined,
      }
      newHistoryData[uidParent] = parentClickParams
    })

    return newHistoryData
  }

  setSelected = ({ href, checkedFacetUid, childrenIds }) => {
    // 'check' new
    const selected = {
      checkedFacetUid,
      childrenIds,
    }

    this.setDialectFilter({
      facetField: this.state.facetField,
      href,
      selected,
    })
  }

  // Saves to redux so other components can respond (eg: "you are searching...")
  // also calls any passed in callback from the parent/layout component (typically used to update it's state)
  setDialectFilter = async({ facetField, href, selected, updateUrl }) => {
    this.props.setDialectFilterCallback({
      facetField,
      selected,
      href,
      updateUrl,
    })
  }

  // `handleHistoryEvent` is called during history events
  handleHistoryEvent = () => {
    const _filterId = selectn(`routeParams.${this.props.facetType}`, this.props)
    if (_filterId) {
      const selectedParams = this.historyData[_filterId]
      if (selectedParams) {
        const { href, checkedFacetUid, childrenIds } = selectedParams
        const selected = {
          checkedFacetUid,
          childrenIds,
        }
        this.setDialectFilter({
          facetField: this.state.facetField,
          href,
          selected,
          updateUrl: false,
        })
      }
    }
  }

  // Sort functions:
  sortByTitle = (a, b) => {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }

  sortDialectFilters = (filters = []) => {
    const _filters = [...filters]
    // Sort root level
    _filters.sort(this.sortByTitle)
    const _filtersSorted = _filters.map((filter) => {
      // Sort children
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.sort(this.sortByTitle)
      }
      return filter
    })
    return _filtersSorted
  }
}

// PROPTYPES
const { any, array, func, object, string, oneOf } = PropTypes
DialectFilterListData.propTypes = {
  // React built-in prop:
  children: any,
  // Props applied to instance of data component:
  selectedCategoryId: string, // Selected list items, rename?
  path: string, // Used with facets
  setDialectFilterCallback: func,
  facets: array.isRequired,
  facetType: oneOf(['category', 'phraseBook']),
  type: oneOf(['words', 'phrases']).isRequired,
  workspaceKey: string, // Used with facetField
  // Redux props:
  // REDUX: reducers/state
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
}

DialectFilterListData.defaultProps = {
  selectedCategoryId: '',
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { navigation, windowPath } = state
  const { route } = navigation
  const { splitWindowPath } = windowPath
  return {
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

export default connect(mapStateToProps)(DialectFilterListData)
