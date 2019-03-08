import React, { Component, PropTypes } from 'react'
import Immutable, { Set } from 'immutable'

import RaisedButton from 'material-ui/lib/raised-button'
import memoize from 'memoize-one'
import selectn from 'selectn'

import { debounce } from 'debounce'
import Paper from 'material-ui/lib/paper'
import ListUI from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import withToggle from 'views/hoc/view/with-toggle'
import IntlService from 'views/services/intl'
const FiltersWithToggle = withToggle()

export default class FacetFilterListCategory extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    facets: PropTypes.array.isRequired,
    onFacetSelected: PropTypes.func.isRequired,
    facetField: PropTypes.string.isRequired,
    appliedFilterIds: PropTypes.instanceOf(Set),
    styles: PropTypes.object,
  }

  static defaultProps = {
    facets: [],
  }

  intl = IntlService.instance

  checkedCount = 0

  title = ''
  titleUpdate = memoize(() => this.intl.searchAndReplace(this.props.title))

  facetTitle = {}
  facetTitleUpdate = memoize((facets) => {
    return facets.map((facet) => {
      this.facetTitle[facet.uid] = facet.title

      const children = selectn('contextParameters.children.entries', facet)
      // Render children if exist
      if (children.length > 0) {
        const childrenSort = children.sort((a, b) => {
          if (a.title < b.title) return -1
          if (a.title > b.title) return 1
          return 0
        })

        childrenSort.map((facetChild) => {
          // NOTE: this.intl.searchAndReplace is a bit slow
          this.facetTitle[facetChild.uid] = this.intl.searchAndReplace(facetChild.title)
        })
      }
    })
  })

  constructor(props, context) {
    super(props, context)

    this.state = {
      disableAll: false,
    }

    this.listItems = this._constructListItems(props.appliedFilterIds, props.facets)
    this.title = this.titleUpdate()
    ;['_clearCategoryFilter', '_constructListItems', '_toggleCheckbox'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  componentDidUpdate() {
    this.listItems = this._constructListItems(this.props.appliedFilterIds, this.props.facets)
    this.title = this.titleUpdate()
  }

  render() {
    return (
      <div>
        <RaisedButton
          disabled={this.checkedCount === 0}
          style={{ margin: '0 0 10px 0' }}
          // label={this.intl.trans('views.pages.explore.dialect.learn.words.find_by_category', 'Show All Words', 'words')}
          label={this.checkedCount > 1 ? 'Clear Category Filters' : 'Clear Category Filter'}
          onTouchTap={this._clearCategoryFilter}
        />
        <FiltersWithToggle className="panel-category" label={this.title} mobileOnly style={this.props.styles}>
          <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <ListUI>{this.listItems}</ListUI>
          </Paper>
        </FiltersWithToggle>
      </div>
    )
  }

  _clearCategoryFilter() {
    console.log('_clearCategoryFilter')
    this.props.clearCategoryFilter()
  }

  _constructListItems = memoize((appliedFilterIds, facets) => {
    // Update titles in this.facetTitle
    this.facetTitleUpdate(facets)

    const listItem0Style = {
      fontSize: '13px',
      fontWeight: 'normal',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: '10px',
      marginBottom: 0,
      display: 'flex',
      alignItems: 'center',
    }
    const listItem0CheckboxStyle = {
      position: 'relative',
      top: 0,
      left: 0,
    }
    const listItem1Style = {
      fontSize: '13px',
      fontWeight: 'normal',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: 0,
      display: 'flex',
      alignItems: 'center',
    }
    const listItem1CheckboxStyle = {
      position: 'relative',
      top: 0,
      left: 0,
    }

    this.checkedCount = 0

    return facets.map((facet) => {
      const childrenIds = []
      const facetUidParent = facet.uid

      const nestedItems = []

      const children = selectn('contextParameters.children.entries', facet)

      // Render children if exist
      if (children.length > 0) {
        const childrenSort = children.sort((a, b) => {
          if (a.title < b.title) return -1
          if (a.title > b.title) return 1
          return 0
        })

        childrenSort.map((facetChild) => {
          const facetUidChild = facetChild.uid
          childrenIds.push(facetUidChild)

          // Mark as checked if parent checked or if it is checked directly.
          const checkedChild = appliedFilterIds.includes(facetUidChild)

          if (checkedChild) {
            this.checkedCount += 1
          }

          const leftCheckbox = (
            <Checkbox
              disabled={this.state.disableAll}
              checked={checkedChild}
              onCheck={() => {
                this._toggleCheckbox(facetUidChild, null, !checkedChild, facetUidParent)
              }}
              style={listItem1CheckboxStyle}
            />
          )
          nestedItems.push(
            <ListItem
              disabled={this.state.disableAll}
              key={facetUidChild}
              leftCheckbox={leftCheckbox}
              primaryText={this.facetTitle[facetUidChild]}
              style={listItem1Style}
            />
          )
        })
      }

      const checkedParent = appliedFilterIds.includes(facetUidParent)
      if (checkedParent) {
        this.checkedCount += 1
      }
      const outerLeftCheckbox = (
        <Checkbox
          disabled={this.state.disableAll}
          checked={checkedParent}
          onCheck={() => {
            this._toggleCheckbox(facetUidParent, childrenIds, !checkedParent)
          }}
          style={listItem0CheckboxStyle}
        />
      )
      return (
        <ListItem
          disabled={this.state.disableAll}
          key={facetUidParent}
          autoGenerateNestedIndicator={false}
          initiallyOpen
          leftCheckbox={outerLeftCheckbox}
          nestedItems={nestedItems}
          open={checkedParent}
          primaryText={this.facetTitle[facetUidParent]}
          style={listItem0Style}
        />
      )
    })
  })

  _toggleCheckbox = debounce((checkedFacetUid, childrenIds = [], isChecked, facetUidParent) => {
    this.props.onFacetSelected(this.props.facetField, checkedFacetUid, childrenIds, isChecked, facetUidParent)
  }, 200)
}
