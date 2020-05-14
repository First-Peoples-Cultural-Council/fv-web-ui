/*
Hi! These are notes on what I find confusing and MAYBE things we could drop or simplify

facetField = not certain how this is used
facets = not certain how this is used
lastCheckedUid = Related to 'unchecking' previously selected list items. Believe this is from a previous version of the category list that could select multiple items. May be able to remove/simplify this system since we currently aren't supporting multiple categories.
lastCheckedChildrenUids = Related to 'unchecking' previously selected list items. See note in lastCheckedUid.
lastCheckedParentFacetUid = Related to 'unchecking' previously selected list items. See note in lastCheckedUid.

generateDataForHistoryEvents: this generates data used when the back/forward buttons are clicked. May not be necessary if componentDidUpdate handles everything and/or can't we use data created by `generateListItemData`?
setSelected: do we need to manage this anymore since we don't support multiple selections? We might be bale to drop the `unselected` & `lastChecked*` code but need to see how this is being used by external components
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
import { SEARCH_BY_CATEGORY, SEARCH_PART_OF_SPEECH_ANY } from 'views/components/SearchDialect/constants'

const TYPE_WORDS = 'words'
const TYPE_PHRASES = 'phrases'

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
        : '', // NOTE: not certain how this is used. See note above.
      facets: [], // NOTE: not certain how this is used
      lastCheckedChildrenUids: [], // NOTE: Related to 'unchecking' previously selected list items. Believe this is from a previous version of the category list that could select multiple items. May be able to remove/simplify this system since we currently aren't supporting multiple selections.
      lastCheckedParentFacetUid: undefined, // NOTE: Related to 'unchecking' previously selected list items. See note in lastCheckedChildrenUids.
      lastCheckedUid: undefined, // NOTE: Related to 'unchecking' previously selected list items. See note in lastCheckedChildrenUids.
    }
  }
  async componentDidMount() {
    // Bind history events
    window.addEventListener('popstate', this.handleHistoryEvent)

    const { path, type, transformData } = this.props

    // Use provided data or fetch new data
    let facets

    // NOTE: transformData can be set AND be empty
    if (transformData) {
      facets = transformData
    } else {
      // Get categories
      await ProviderHelpers.fetchIfMissing(path, this.props.fetchCategories, this.props.computeCategories)
      const extractComputedCategories = ProviderHelpers.getEntry(this.props.computeCategories, path)
      facets = selectn('response.entries', extractComputedCategories)
    }

    // Is something selected? (via url)
    // NOTE: could this be driven by the `appliedFilterIds` prop?
    const selectedDialectFilter =
      type === TYPE_WORDS ? selectn('category', this.props.routeParams) : selectn('phraseBook', this.props.routeParams)

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
    const { type } = this.props

    let facets
    let prevFacets

    // Are we using transformData or internal state?
    if (this.props.transformData) {
      facets = this.props.transformData
      prevFacets = prevProps.transformData
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
    let selectedDialectFilter
    let prevSelectedDialectFilter
    if (type === TYPE_WORDS) {
      selectedDialectFilter = selectn('category', this.props.routeParams)
      prevSelectedDialectFilter = selectn('category', prevProps.routeParams)
    } else {
      selectedDialectFilter = selectn('phraseBook', this.props.routeParams)
      prevSelectedDialectFilter = selectn('phraseBook', prevProps.routeParams)
    }

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

    // // NOTE: Believe this stuff is legacy from a previous version of the category sidebar
    // // that could select multiple items. May be able to toss it but not 100% sure.
    // const { lastCheckedUid, lastCheckedChildrenUids, lastCheckedParentFacetUid } = this.state
    // // 'uncheck' previous
    // if (lastCheckedUid) {
    //   const unselected = {
    //     checkedFacetUid: lastCheckedUid,
    //     childrenIds: lastCheckedChildrenUids,
    //     parentFacetUid: lastCheckedParentFacetUid,
    //   }
    //   this.props.dialectFilterListWillUnmount({
    //     facetField: this.state.facetField,
    //     unselected,
    //     type: this.props.type,
    //     resetUrlPagination: false,
    //   })
    // }
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
      const urlFragment = this.props.type === TYPE_WORDS ? 'categories' : 'book'
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
          this.historyData[uidChild] = {
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

  // Do we need to manage this anymore since we don't support multiple selections?
  // We might be able to drop the `unselected` & `lastChecked*` code
  // Maybe only need to call `setDialectFilter`?
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

        this.setDialectFilter({
          facetField: this.state.facetField,
          href,
          selected,
          unselected,
        })
      }
    )
  }

  // Saves to redux so other components can respond (eg: "you are searching...")
  // also calls any passed in callback from the parent/layout component (typically used to update it's state)
  setDialectFilter = async ({ facetField, href, selected, unselected, updateUrl }) => {
    await this.props.searchDialectUpdate({
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

    this.props.setDialectFilterCallback({
      facetField,
      href,
      selected,
      unselected,
      updateUrl,
    })
  }

  // `handleHistoryEvent` is called during history events
  handleHistoryEvent = () => {
    const _filterId =
      this.props.type === TYPE_WORDS
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
            this.setDialectFilter({
              facetField: this.state.facetField,
              href,
              selected,
              updateUrl: false,
            })
          }
        )
      }
    }
  }

  // Not being used. Believe this was in-progress work from Nolan or Daniel
  setUidUrlPath = (filter, path) => {
    // TODO: map encodeUri title to uid for friendly urls
    // this.uidUrl[category.uid] = encodeURI(category.title)

    // TODO: temp using uid in url
    this.uidUrl[filter.uid] = `${path}/${encodeURI(filter.uid)}`
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
  transformData: array,
  type: oneOf([TYPE_WORDS, TYPE_PHRASES]).isRequired,
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
