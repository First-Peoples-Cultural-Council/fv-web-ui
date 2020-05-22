/*
generateDataForHistoryEvents: this generates data used when the back/forward buttons are clicked.
May not be necessary if componentDidUpdate handles everything and/or can't we use data created by `generateListItemData`?
*/
import { Component } from 'react'
import { connect } from 'react-redux'
import { Set } from 'immutable'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import ProviderHelpers from 'common/ProviderHelpers'
import {
  SEARCH_BY_CATEGORY,
  SEARCH_BY_PHRASE_BOOK,
  SEARCH_PART_OF_SPEECH_ANY,
} from 'views/components/SearchDialect/constants'

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

  componentDidUpdate(prevProps, prevState) {
    const { facetType } = this.props

    let facets
    let prevFacets

    // Are we using facets or internal state?
    if (this.props.facets) {
      facets = this.props.facets
      prevFacets = prevProps.facets
    } else {
      facets = this.state.facets
      prevFacets = prevState.facets
    }
    // Note: guard against undefined
    const prevAppliedFilterIds = prevProps.appliedFilterIds || new Set()
    const currentAppliedFilterIds = this.props.appliedFilterIds || new Set()

    if (prevFacets.length !== facets.length) {
      this.filtersSorted = this.sortDialectFilters(facets)
    }

    if (prevFacets.length !== facets.length || prevAppliedFilterIds.equals(currentAppliedFilterIds) === false) {
      this.historyData = this.generateDataForHistoryEvents(this.filtersSorted)
    }

    // Is something selected? (via url)
    // NOTE: could this be driven by the `appliedFilterIds` prop?
    const selectedDialectFilter = selectn(`${facetType}`, this.props.routeParams)
    const prevSelectedDialectFilter = selectn(`${facetType}`, prevProps.routeParams)

    if (selectedDialectFilter !== prevSelectedDialectFilter) {
      const selectedParams = this.historyData[selectedDialectFilter]
      if (selectedParams) {
        this.setSelected(selectedParams)
        this.selectedDialectFilter = undefined
      }
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
    const { appliedFilterIds } = this.props

    const listItemData = []
    filters.forEach((filter) => {
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
    this.setState(() => {
      const selected = {
        checkedFacetUid,
        childrenIds,
      }

      this.setDialectFilter({
        facetField: this.state.facetField,
        href,
        selected,
      })
    })
  }

  // Saves to redux so other components can respond (eg: "you are searching...")
  // also calls any passed in callback from the parent/layout component (typically used to update it's state)
  setDialectFilter = async ({ facetField, href, selected, updateUrl }) => {
    const searchBy = this.props.type === 'phrases' ? SEARCH_BY_PHRASE_BOOK : SEARCH_BY_CATEGORY
    await this.props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: searchBy,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchingDialectFilter: selected.checkedFacetUid,
      searchTerm: '',
    })

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
        this.setState(() => {
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
const { any, array, func, instanceOf, object, string, oneOf } = PropTypes
DialectFilterListData.propTypes = {
  // React built-in prop:
  children: any,
  // Props applied to instance of data component:
  appliedFilterIds: instanceOf(Set), // Selected list items, rename?
  path: string, // Used with facets
  setDialectFilterCallback: func,
  facets: array.isRequired,
  facetType: oneOf(['category', 'phraseBook']),
  type: oneOf(['words', 'phrases']).isRequired,
  workspaceKey: string, // Used with facetField
  // Redux props:
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
  searchDialectUpdate: func.isRequired,
}
DialectFilterListData.defaultProps = {
  appliedFilterIds: new Set(),
  dialectFilterListWillUnmount: () => {},
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
  searchDialectUpdate,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectFilterListData)
