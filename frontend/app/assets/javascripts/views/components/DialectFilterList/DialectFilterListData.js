import { Component } from 'react'
import { connect } from 'react-redux'
import { Set } from 'immutable'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'

class DialectFilterListData extends Component {
  historyData = {}
  filtersSorted = []
  selectedDialectFilter = undefined

  constructor(props) {
    super(props)

    this.state = {
      facets: [],
      facetField: ProviderHelpers.switchWorkspaceSectionKeys(props.workspaceKey, this.props.routeParams.area),
      lastCheckedUid: undefined,
      lastCheckedChildrenUids: [],
      lastCheckedParentFacetUid: undefined,
    }
  }
  async componentDidMount() {
    const { path, type } = this.props
    // Get categories
    await ProviderHelpers.fetchIfMissing(path, this.props.fetchCategories, this.props.computeCategories)
    const extractComputedCategories = ProviderHelpers.getEntry(this.props.computeCategories, path)
    const facets = selectn('response.entries', extractComputedCategories)

    // Bind history events
    window.addEventListener('popstate', this.handleHistoryEvent)

    // Is something selected? (via url)
    const selectedDialectFilter =
      type === 'words' ? selectn('category', this.props.routeParams) : selectn('phraseBook', this.props.routeParams)

    if (selectedDialectFilter) {
      this.selectedDialectFilter = selectedDialectFilter
    }

    // we have data, so...
    if (facets && facets.length > 0) {
      this.filtersSorted = this.sortDialectFilters(facets)
      this.generateClickParamData(this.filtersSorted)
    }

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

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistoryEvent)

    // NOTE: Believe this stuff is legacy from a previous version of the category sidebar
    // that could select multiple items. May be able to toss it but not 100% sure.
    const { lastCheckedUid, lastCheckedChildrenUids, lastCheckedParentFacetUid } = this.state
    // 'uncheck' previous
    if (lastCheckedUid) {
      const unselected = {
        checkedFacetUid: lastCheckedUid,
        childrenIds: lastCheckedChildrenUids,
        parentFacetUid: lastCheckedParentFacetUid,
      }
      this.props.dialectFilterListWillUnmount({
        facetField: this.state.facetField,
        unselected,
        type: this.props.type,
        resetUrlPagination: false,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { facets } = this.state
    const { facets: prevFacets } = prevState

    // Note: guard against undefined
    const prevAppliedFilterIds = prevProps.appliedFilterIds || new Set()
    const currentAppliedFilterIds = this.props.appliedFilterIds || new Set()

    if (prevFacets.length !== facets.length) {
      this.filtersSorted = this.sortDialectFilters(facets)
    }

    if (prevFacets.length !== facets.length || prevAppliedFilterIds.equals(currentAppliedFilterIds) === false) {
      this.generateClickParamData(this.filtersSorted)
    }
  }

  render() {
    return this.props.children({
      facetField: this.state.facetField,
      facets: this.state.facets,
      routeParams: this.props.routeParams,
      facetSelected: this.props.routeParams.category,

      listItemsData: this.generateListItemData(),

      lastCheckedUid: this.state.lastCheckedUid,
      lastCheckedChildrenUids: this.state.lastCheckedChildrenUids,
      lastCheckedParentFacetUid: this.state.lastCheckedParentFacetUid,
    })
  }

  generateDialectFilterUrl = (filterId) => {
    let href = `/${this.props.splitWindowPath.join('/')}`
    const _splitWindowPath = [...this.props.splitWindowPath]
    const wordOrPhraseIndex = _splitWindowPath.findIndex((element) => {
      return element === 'words' || element === 'phrases'
    })
    if (wordOrPhraseIndex !== -1) {
      _splitWindowPath.splice(wordOrPhraseIndex + 1)
      const urlFragment = this.props.type === 'words' ? 'categories' : 'book'
      href = `/${_splitWindowPath.join('/')}/${urlFragment}/${filterId}`
    }
    return href
  }

  // Generates data structure representing the list
  generateListItemData = () => {
    const { appliedFilterIds } = this.props

    const listItemData = []
    this.filtersSorted.forEach((filter) => {
      const childData = []
      const uidParent = filter.uid

      // Process children
      const children = selectn('contextParameters.children.entries', filter)
      const parentIsActive = appliedFilterIds.includes(uidParent)
      let hasActiveChild = false

      if (children.length > 0) {
        children.forEach((filterChild) => {
          const uidChild = filterChild.uid
          const childIsActive = appliedFilterIds.includes(uidChild)
          // Set flag for parent processing
          hasActiveChild = childIsActive
          // Save child data
          childData.push({
            uid: uidChild,
            href: this.generateDialectFilterUrl(uidChild),
            isActive: childIsActive,
            hasActiveParent: parentIsActive,
            text: filterChild.title,
          })
        })
      }

      // Process parent
      listItemData.push({
        uid: uidParent,
        href: this.generateDialectFilterUrl(uidParent),
        isActive: parentIsActive,
        hasActiveChild: hasActiveChild,
        text: filter.title,
        children: childData,
      })
    })
    return listItemData
  }

  // Generates data used with history events
  generateClickParamData = (filters) => {
    filters.forEach((filter) => {
      const uidParent = filter.uid

      // Process children
      const childrenUids = []
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.forEach((filterChild) => {
          const uidChild = filterChild.uid

          childrenUids.push(uidChild)

          // Saving for history events
          this.historyData[uidChild] = {
            href: this.generateDialectFilterUrl(uidChild),
            checkedFacetUid: uidChild,
            childrenIds: null,
            parentFacetUid: uidParent,
          }
        })
      }

      // Process parent
      const parentClickParams = {
        href: this.generateDialectFilterUrl(uidParent),
        checkedFacetUid: uidParent,
        childrenIds: childrenUids,
        parentFacetUid: undefined,
      }
      this.historyData[uidParent] = parentClickParams
    })
  }

  // NOTE: used to be called handleClick
  setSelected = ({ href, checkedFacetUid, childrenIds, parentFacetUid }) => {
    const { lastCheckedUid, lastCheckedChildrenUids, lastCheckedParentFacetUid } = this.state

    let unselected = undefined

    // 'uncheck' previous
    if (lastCheckedUid) {
      unselected = {
        checkedFacetUid: lastCheckedUid,
        childrenIds: lastCheckedChildrenUids,
        parentFacetUid: lastCheckedParentFacetUid,
      }
    }

    // 'check' new
    this.setState(
      {
        lastCheckedUid: checkedFacetUid,
        lastCheckedChildrenUids: childrenIds,
        lastCheckedParentFacetUid: parentFacetUid,
      },
      () => {
        const selected = {
          checkedFacetUid,
          childrenIds,
        }
        this.props.setDialectFilter({
          facetField: this.state.facetField,
          selected,
          unselected,
          href,
        })
      }
    )
  }

  handleHistoryEvent = () => {
    const _filterId =
      this.props.type === 'words'
        ? selectn('routeParams.category', this.props)
        : selectn('routeParams.phraseBook', this.props)
    if (_filterId) {
      const selectedParams = this.historyData[_filterId]
      if (selectedParams) {
        const { href, checkedFacetUid, childrenIds, parentFacetUid } = selectedParams
        this.setState(
          {
            lastCheckedUid: checkedFacetUid,
            lastCheckedChildrenUids: childrenIds,
            lastCheckedParentFacetUid: parentFacetUid,
          },
          () => {
            const selected = {
              checkedFacetUid,
              childrenIds,
            }
            this.props.setDialectFilter({
              facetField: this.state.facetField,
              selected,
              href,
              updateUrl: false,
            })
          }
        )
      }
    }
  }

  setUidUrlPath = (filter, path) => {
    // TODO: map encodeUri title to uid for friendly urls
    // this.uidUrl[category.uid] = encodeURI(category.title)

    // TODO: temp using uid in url
    this.uidUrl[filter.uid] = `${path}/${encodeURI(filter.uid)}`
  }

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
const { any, array, func, instanceOf, object, string } = PropTypes
DialectFilterListData.propTypes = {
  appliedFilterIds: instanceOf(Set),
  children: any,
  dialectFilterListWillUnmount: func,
  path: string.isRequired, // Used with facets
  setDialectFilter: func,
  type: string,
  workspaceKey: string.isRequired, // Used with facetField
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
}
DialectFilterListData.defaultProps = {
  appliedFilterIds: new Set(),
  dialectFilterListWillUnmount: () => {},
  setDialectFilter: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvCategory, navigation, windowPath } = state
  const { computeCategories } = fvCategory
  const { route } = navigation
  const { splitWindowPath } = windowPath
  return {
    computeCategories,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectFilterListData)
