import React, { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'reducers/windowPath'
import { FormControl, FormGroup } from '@material-ui/core'

const { any, array, func, string, object } = PropTypes
import '!style-loader!css-loader!./immersionFilter.css'

export class ImmersionFilterList extends Component {
  static propTypes = {
    categories: array.isRequired,
    title: PropTypes.oneOfType([string, object]).isRequired,
    routeParams: any,
    selectedCategory: string,
    changeCategory: func.isRequired,
    // REDUX: reducers/state
    splitWindowPath: array,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    title: 'Categories',
    categories: [],
    changeCategory: () => {},
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

  _isMounted = false

  constructor(props, context) {
    super(props, context)

    this.title = props.title
  }

  componentDidMount() {
    this._isMounted = true

    if (this.props.categories && this.props.categories.length > 0) {
      this.filtersSorted = this._sortFilters(this.props.categories)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.categories.length !== this.props.categories.length) {
      this.filtersSorted = this._sortFilters(this.props.categories)
    }
  }

  _generateListItems = (filters, depth = 0) => {
    const _filters = filters.map((filter) => {
      const checked = this.props.selectedCategory ? this.props.selectedCategory.startsWith(filter.id) : false
      const selected = filter.id === this.props.selectedCategory
      return (
        <div key={filter.id} className={`category-parent ${selected ? 'active' : ''} ${checked ? 'checked' : ''}`}>
          <a
            style={{ paddingLeft: 15 * depth + 10 }}
            className={`category-link ${selected ? 'active' : ''}`}
            onClick={() => this.props.changeCategory(selected ? null : filter.id)}
          >
            {filter.label}
          </a>
          {filter.children.length !== 0 && <div>{this._generateListItems(filter.children, depth + 1)}</div>}
        </div>
      )
    })

    return _filters
  }

  render() {
    return (
      <div className="DialectFilterList" data-testid="DialectFilterList">
        <FormControl style={{ width: '100%' }}>
          <h2>{this.title}</h2>
          <FormGroup className="categories">{this._generateListItems(this.filtersSorted)}</FormGroup>
        </FormControl>
      </div>
    )
  }

  _sortChildren(filter) {
    let children = [...filter.children]
    if (children.length > 0) {
      children.sort(this._sortByTitle)
      children = children.map((child) => {
        return this._sortChildren(child)
      })
    }
    filter.children = children
    return filter
  }

  _sortByTitle(a, b) {
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  }

  _sortFilters(filters) {
    const _filters = [...filters]
    // Sort root level
    _filters.sort(this._sortByTitle)
    const _filtersSorted = _filters.map((filter) => {
      // Sort children
      let children = [...filter.children]
      if (children.length > 0) {
        children.sort(this._sortByTitle)
        children = children.map((child) => {
          return this._sortChildren(child)
        })
      }
      filter.children = children
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

export default connect(mapStateToProps, mapDispatchToProps)(ImmersionFilterList)
