import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Set } from 'immutable'

import FVButton from 'views/components/FVButton'
import memoize from 'memoize-one'
import selectn from 'selectn'

import { debounce } from 'debounce'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Checkbox from '@material-ui/core/Checkbox'
import withToggle from 'views/hoc/view/with-toggle'
import { connect } from 'react-redux'
const FiltersWithToggle = withToggle()

class FacetFilterListCategory extends Component {
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


  checkedCount = 0

  title = ''
  titleUpdate = memoize(() => this.props.intl.searchAndReplace(this.props.title))

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
          // NOTE: this.props.intl.searchAndReplace is a bit slow
          this.facetTitle[facetChild.uid] = this.props.intl.searchAndReplace(facetChild.title)
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
        <FVButton
          variant="contained"
          disabled={this.checkedCount === 0}
          style={{ margin: '0 0 10px 0' }}
          // label={this.props.intl.trans('views.pages.explore.dialect.learn.words.find_by_category', 'Show All Words', 'words')}
          onClick={this._clearCategoryFilter}
        >
          {this.checkedCount > 1 ? 'Clear Category Filters' : 'Clear Category Filter'}
        </FVButton>
        <FiltersWithToggle className="panel-category" label={this.title} mobileOnly style={this.props.styles}>
          <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <List>{this.listItems}</List>
          </Paper>
        </FiltersWithToggle>
      </div>
    )
  }

  _clearCategoryFilter() {
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

const mapStateToProps = (state) => {
  const { locale } = state
  const { intlService } = locale

  return {
    intl: intlService,
  }
}

export default connect(mapStateToProps)(FacetFilterListCategory)
