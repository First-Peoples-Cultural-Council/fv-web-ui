import React, { Component, PropTypes } from 'react'
// eslint-disable-next-line
import Immutable, { Set } from 'immutable'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

// import StringHelpers from 'common/StringHelpers'
// const FiltersWithToggle = withToggle()

const { instanceOf, any, array, func, object, string } = PropTypes

export class DialectFilterList extends Component {
  static propTypes = {
    appliedFilterIds: instanceOf(Set),
    facetField: string.isRequired,
    facets: array.isRequired,
    type: string.isRequired,
    title: string.isRequired,
    routeParams: any,
    styles: object,
    handleDialectFilterClick: func,
    handleDialectFilterList: func.isRequired,
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

  filtersSorted = []
  // intl = IntlService.instance
  title = ''

  styleListItemParent = {
    fontSize: '13px',
    fontWeight: 'normal',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '10px',
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
  }

  styleListItemCheckbox = {
    position: 'relative',
    top: 0,
    left: 0,
  }

  styleListItemChild = {
    fontSize: '13px',
    fontWeight: 'normal',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
  }

  uidUrl = {}
  clickParams = {}
  selectedDialectFilter = undefined

  _isMounted = false

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
    ;[
      '_generateUidUrlPaths',
      '_generateDialectFilterUrl',
      '_handleClick',
      '_handleHistoryEvent',
      '_sortDialectFilters',
      '_setUidUrlPath',
      '_sortByTitle',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentDidMount() {
    this._isMounted = true
    window.addEventListener('popstate', this._handleHistoryEvent)

    const selectedDialectFilter =
      this.props.type === 'words'
        ? selectn('routeParams.category', this.props)
        : selectn('routeParams.phraseBook', this.props)
    if (selectedDialectFilter) {
      this.selectedDialectFilter = selectedDialectFilter
    }

    if (this.props.facets && this.props.facets.length > 0) {
      this.filtersSorted = this._sortDialectFilters(this.props.facets)
      this._generateUidUrlPaths(this.filtersSorted)
      this._generateListItems(this.filtersSorted, true)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this._handleHistoryEvent)
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
      this.filtersSorted = this._sortDialectFilters(this.props.facets)
      this._generateUidUrlPaths(this.filtersSorted)
    }

    if (
      prevProps.facets.length !== this.props.facets.length ||
      prevAppliedFilterIds.equals(currentAppliedFilterIds) === false
    ) {
      this._generateListItems(this.filtersSorted, true)
    }

    if (prevProps.title !== this.props.title) {
      this.title = this.props.title
    }
  }

  render() {
    return (
      <div className="DialectFilterList" data-testid="DialectFilterList">
        <h2>{this.title}</h2>
        <ul className="DialectFilterListList">{this.state.listItems}</ul>
      </div>
    )
  }

  _generateUidUrlPaths(filters) {
    const _splitWindowPath = [...this.props.splitWindowPath]
    const lastPath = _splitWindowPath.pop()

    if (lastPath === 'words' || lastPath === 'phrases') {
      _splitWindowPath.push(lastPath)
      const urlFragment = this.props.type === 'words' ? 'categories' : 'book'
      _splitWindowPath.push(urlFragment)
    }
    const path = ('/' + _splitWindowPath.join('/')).replace(NavigationHelpers.getContextPath(), '')

    filters.forEach((filter) => {
      this._setUidUrlPath(filter, path)
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.forEach((filterChild) => {
          this._setUidUrlPath(filterChild, path)
        })
      }
    })
    return this.uidUrl
  }

  _handleHistoryEvent() {
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
          // this._handleClick(selectedParams)
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

  _setUidUrlPath(filter, path) {
    // TODO: map encodeUri title to uid for friendly urls
    // this.uidUrl[category.uid] = encodeURI(category.title)

    // TODO: temp using uid in url
    this.uidUrl[filter.uid] = `${path}/${encodeURI(filter.uid)}`
  }

  _generateDialectFilterUrl(filterId) {
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

  _generateListItems = (filters, updateState = false) => {
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
          const childHref = this._generateDialectFilterUrl(uidChild)
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
              <a
                className={`DialectFilterListLink DialectFilterListLink--child ${childActiveClass}`}
                href={childHref}
                onClick={(e) => {
                  e.preventDefault()
                  this._handleClick(childClickParams)
                }}
                title={filterChild.title}
              >
                {filterChild.title}
              </a>
            </li>
          )
          childrenItems.push(childListItem)
        })
      }

      // const parentHref = `/${this.uidUrl[uidParent]}`
      const parentHref = this._generateDialectFilterUrl(uidParent)

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
            <a
              className={`DialectFilterListLink DialectFilterListLink--parent ${parentActiveClass}`}
              href={parentHref}
              onClick={(e) => {
                e.preventDefault()
                this._handleClick(parentClickParams)
              }}
              title={filter.title}
            >
              {filter.title}
            </a>
            {/* {childrenItems.length > 0 && <button className="DialectFilterListItemToggle">Show subcategories</button>} */}
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
              this._handleClick(selectedParams)
              this.selectedDialectFilter = undefined
            }
          }
        }
      )
    }
  }

  _handleClick(obj) {
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

  _sortByTitle(a, b) {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }

  _sortDialectFilters(filters) {
    const _filters = [...filters]
    // Sort root level
    _filters.sort(this._sortByTitle)
    const _filtersSorted = _filters.map((filter) => {
      // Sort children
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.sort(this._sortByTitle)
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialectFilterList)
