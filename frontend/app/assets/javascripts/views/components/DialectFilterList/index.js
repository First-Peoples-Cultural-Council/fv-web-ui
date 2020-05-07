import React, { Component } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line
import Immutable, { Set } from 'immutable'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import Link from 'views/components/Link'
import URLHelpers from '../../../common/URLHelpers'

const { instanceOf, any, array, func, object, string } = PropTypes

export class DialectFilterList extends Component {
  static propTypes = {
    appliedFilterIds: instanceOf(Set),
    facetField: string.isRequired,
    facets: array.isRequired,
    handleDialectFilterClick: func,
    handleDialectFilterList: func.isRequired,
    routeParams: any,
    styles: object,
    title: string.isRequired,
    type: string.isRequired,
    // REDUX: reducers/state
    splitWindowPath: array,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    type: 'words',
    facets: [],
    handleDialectFilterClick: () => {},
  }

  clickParams = {}
  filtersSorted = []
  _isMounted = false
  selectedDialectFilter = undefined
  title = ''
  uidUrl = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      disableAll: false,
      lastCheckedUid: undefined,
      lastCheckedChildrenUids: [],
      lastCheckedParentFacetUid: undefined,
      listItems: undefined,
    }

    this.title = props.title
  }

  componentDidMount() {
    this._isMounted = true
    window.addEventListener('popstate', this.handleHistoryEvent)

    const selectedDialectFilter =
      this.props.type === 'words'
        ? selectn('routeParams.category', this.props)
        : selectn('routeParams.phraseBook', this.props)
    if (selectedDialectFilter) {
      this.selectedDialectFilter = selectedDialectFilter
    }

    if (this.props.facets && this.props.facets.length > 0) {
      this.filtersSorted = this.sortDialectFilters(this.props.facets)
      this.generateUidUrlPaths(this.filtersSorted)
      this.generateListItems(this.filtersSorted, true)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this.handleHistoryEvent)
    const { lastCheckedUid, lastCheckedChildrenUids, lastCheckedParentFacetUid } = this.state
    // 'uncheck' previous
    if (lastCheckedUid) {
      const unselected = {
        checkedFacetUid: lastCheckedUid,
        childrenIds: lastCheckedChildrenUids,
        parentFacetUid: lastCheckedParentFacetUid,
      }
      this.props.handleDialectFilterList(this.props.facetField, undefined, unselected, this.props.type, false)
    }
  }

  componentDidUpdate(prevProps) {
    const prevAppliedFilterIds = prevProps.appliedFilterIds
    const currentAppliedFilterIds = this.props.appliedFilterIds

    if (prevProps.facets.length !== this.props.facets.length) {
      this.filtersSorted = this.sortDialectFilters(this.props.facets)
      this.generateUidUrlPaths(this.filtersSorted)
    }

    if (
      prevProps.facets.length !== this.props.facets.length ||
      prevAppliedFilterIds.equals(currentAppliedFilterIds) === false
    ) {
      this.generateListItems(this.filtersSorted, true)
    }

    if (prevProps.title !== this.props.title) {
      this.title = this.props.title
    }
  }

  render() {
    return (
      <div className="DialectFilterList" data-testid="DialectFilterList">
        <h2>{this.title}</h2>
        <ul className="DialectFilterListList DialectFilterListList--root">{this.state.listItems}</ul>
      </div>
    )
  }

  generateUidUrlPaths = (filters) => {
    const _splitWindowPath = [...this.props.splitWindowPath]
    const lastPath = _splitWindowPath.pop()

    if (lastPath === 'words' || lastPath === 'phrases') {
      _splitWindowPath.push(lastPath)
      const urlFragment = this.props.type === 'words' ? 'categories' : 'book'
      _splitWindowPath.push(urlFragment)
    }
    const path = ('/' + _splitWindowPath.join('/')).replace(URLHelpers.getContextPath(), '')

    filters.forEach((filter) => {
      this.setUidUrlPath(filter, path)
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.forEach((filterChild) => {
          this.setUidUrlPath(filterChild, path)
        })
      }
    })
    return this.uidUrl
  }

  handleHistoryEvent = () => {
    if (this._isMounted) {
      const _filterId =
        this.props.type === 'words'
          ? selectn('routeParams.category', this.props)
          : selectn('routeParams.phraseBook', this.props)
      // const _catId = selectn('category', this.props.routeParams)
      if (_filterId) {
        const selectedParams = this.clickParams[_filterId]
        if (selectedParams) {
          const { href, checkedFacetUid, childrenIds, parentFacetUid } = selectedParams
          // this.handleClick(selectedParams)
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
              this.props.handleDialectFilterClick(
                {
                  facetField: this.props.facetField,
                  selected,
                  undefined,
                  href,
                },
                false
              )
            }
          )
        }
      }
    }
  }

  setUidUrlPath = (filter, path) => {
    // TODO: map encodeUri title to uid for friendly urls
    // this.uidUrl[category.uid] = encodeURI(category.title)

    // TODO: temp using uid in url
    this.uidUrl[filter.uid] = `${path}/${encodeURI(filter.uid)}`
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

  generateListItems = (filters, updateState = false) => {
    const { appliedFilterIds } = this.props

    let lastCheckedUid = undefined
    let lastCheckedChildrenUids = undefined
    let lastCheckedParentFacetUid = undefined

    const _filters = filters.map((filter) => {
      const childrenItems = []
      const childrenUids = []
      const uidParent = filter.uid

      const parentIsActive = appliedFilterIds.includes(uidParent)
      const parentActiveClass = parentIsActive ? 'DialectFilterListLink--active' : ''

      const children = selectn('contextParameters.children.entries', filter)
      let hasActiveChild = false
      if (children.length > 0) {
        children.forEach((filterChild) => {
          if (filterChild.isTrashed) return
          const uidChild = filterChild.uid
          childrenUids.push(uidChild)
          const childIsActive = appliedFilterIds.includes(uidChild)

          let childActiveClass = ''
          if (parentActiveClass) {
            childActiveClass = 'DialectFilterListLink--activeParent'
          } else if (childIsActive) {
            childActiveClass = 'DialectFilterListLink--active'
          }

          if (childIsActive) {
            hasActiveChild = true
            lastCheckedUid = uidChild
            lastCheckedChildrenUids = null
            lastCheckedParentFacetUid = uidParent
          }

          // const childHref = `/${this.uidUrl[uidChild]}`
          const childHref = this.generateDialectFilterUrl(uidChild)
          const childClickParams = {
            href: childHref,
            checkedFacetUid: uidChild,
            childrenIds: null,
            parentFacetUid: uidParent,
          }
          // Saving for direct page load events
          this.clickParams[uidChild] = childClickParams
          const childListItem = (
            <li key={uidChild}>
              <Link
                className={`DialectFilterListLink DialectFilterListLink--child ${childActiveClass}`}
                href={childHref}
                title={filterChild.title}
              >
                {filterChild.title}
              </Link>
            </li>
          )
          childrenItems.push(childListItem)
        })
      }

      // const parentHref = `/${this.uidUrl[uidParent]}`
      const parentHref = this.generateDialectFilterUrl(uidParent)

      if (parentIsActive) {
        lastCheckedUid = uidParent
        lastCheckedChildrenUids = childrenUids
        lastCheckedParentFacetUid = undefined
      }
      const listItemActiveClass = parentIsActive || hasActiveChild ? 'DialectFilterListItemParent--active' : ''
      const parentClickParams = {
        href: parentHref,
        checkedFacetUid: uidParent,
        childrenIds: childrenUids,
        parentFacetUid: undefined,
      }
      // Saving for direct page load events
      this.clickParams[uidParent] = parentClickParams
      const parentListItem = (
        <li key={uidParent} className={`DialectFilterListItemParent ${listItemActiveClass}`}>
          <div className="DialectFilterListItemGroup">
            <Link
              className={`DialectFilterListLink DialectFilterListLink--parent ${parentActiveClass}`}
              href={parentHref}
              title={filter.title}
            >
              {filter.title}
            </Link>
          </div>
          {childrenItems.length > 0 ? <ul className="DialectFilterListList">{childrenItems}</ul> : null}
        </li>
      )

      return parentListItem
    })

    if (updateState) {
      // Save active item/data
      this.setState(
        {
          listItems: _filters,
          lastCheckedUid,
          lastCheckedChildrenUids,
          lastCheckedParentFacetUid,
        },
        () => {
          if (this.selectedDialectFilter) {
            const selectedParams = this.clickParams[this.selectedDialectFilter]
            if (selectedParams) {
              this.handleClick(selectedParams)
              this.selectedDialectFilter = undefined
            }
          }
        }
      )
    }
  }

  handleClick = (obj) => {
    const { href, checkedFacetUid, childrenIds, parentFacetUid } = obj

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
        this.props.handleDialectFilterClick({
          facetField: this.props.facetField,
          selected,
          unselected,
          href,
        })
      }
    )
  }

  sortByTitle = (a, b) => {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }

  sortDialectFilters = (filters) => {
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

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { windowPath } = state

  const { splitWindowPath } = windowPath

  return {
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectFilterList)
