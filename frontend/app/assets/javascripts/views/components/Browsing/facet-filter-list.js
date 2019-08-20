import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable, { List, Set, Map } from 'immutable'

import selectn from 'selectn'
import { debounce } from 'debounce'
import memoize from 'memoize-one'
import Paper from 'material-ui/lib/paper'
import ListUI from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import withToggle from 'views/hoc/view/with-toggle'
import IntlService from 'views/services/intl'

const FiltersWithToggle = withToggle()

export default class FacetFilterList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    facets: PropTypes.array.isRequired,
    onFacetSelected: PropTypes.func.isRequired,
    facetField: PropTypes.string.isRequired,
    appliedFilterIds: PropTypes.instanceOf(Set),
    styles: PropTypes.object,
  }

  intl = IntlService.instance

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
    this.listItems = this._constructListItems(props.appliedFilterIds, props.facets)
    this.title = this.titleUpdate()
    ;['_constructListItems', '_toggleCheckbox'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentDidUpdate() {
    this.listItems = this._constructListItems(this.props.appliedFilterIds, this.props.facets)
    this.title = this.titleUpdate()
  }

  _toggleCheckbox = debounce((checkedFacetUid, childrenIds = [], isChecked, facetUidParent) => {
    this.props.onFacetSelected(this.props.facetField, checkedFacetUid, childrenIds, isChecked, facetUidParent)
  }, 200)

  _constructListItems = memoize((appliedFilterIds, facets) => {
    // Update titles in this.facetTitle
    this.facetTitleUpdate(facets)

    const listItemStyle = { fontSize: '13px', fontWeight: 'normal' }
    return facets.map((facet) => {
      const childrenIds = []
      const facetUidParent = facet.uid
      const checkedParent = appliedFilterIds.includes(facetUidParent)

      const nestedItems = []
      const children = selectn('contextParameters.children.entries', facet)

      // Render children if exist
      if (children.length > 0) {
        const childrenSort = children.sort((a, b) => {
          if (a.title < b.title) return -1
          if (a.title > b.title) return 1
          return 0
        })
        childrenSort.map((facetChild, i) => {
          const facetUidChild = facetChild.uid
          childrenIds.push(facetUidChild)

          // Mark as checked if parent checked or if it is checked directly.
          const checkedChild = appliedFilterIds.includes(facetUidChild)

          nestedItems.push(
            <ListItem
              key={facetChild.uid}
              leftCheckbox={
                <Checkbox
                  checked={checkedChild}
                  onCheck={() => {
                    this._toggleCheckbox(facetUidChild, null, !checkedChild, facetUidParent)
                  }}
                />
              }
              style={listItemStyle}
              primaryText={this.facetTitle[facetUidChild]}
            />
          )
        })
      }

      return (
        <ListItem
          style={listItemStyle}
          key={facet.uid}
          leftCheckbox={
            <Checkbox
              checked={checkedParent}
              onCheck={() => {
                this._toggleCheckbox(facetUidParent, childrenIds, !checkedParent)
              }}
            />
          }
          primaryText={this.facetTitle[facetUidParent]}
          open={checkedParent}
          initiallyOpen
          autoGenerateNestedIndicator={false}
          nestedItems={nestedItems}
        />
      )
    })
  })

  render() {
    return (
      <FiltersWithToggle label={this.title} mobileOnly style={this.props.styles}>
        <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <ListUI subheader={this.title}>{this.listItems}</ListUI>
        </Paper>
      </FiltersWithToggle>
    )
  }
}
