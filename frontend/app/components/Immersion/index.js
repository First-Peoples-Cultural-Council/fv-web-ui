/* Copyright 2016 First People's Cultural Council

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'reducers/document'
import { fetchPortal } from 'reducers/fvPortal'
import { fetchLabelDirectory } from 'reducers/directory'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import PromiseWrapper from 'components/PromiseWrapper'
import FVLabel from 'components/FVLabel'
import { getDialectClassname } from 'common/Helpers'
import PageDialectLearnBase from 'components/LearnBase'
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

// Immersion specific
import ImmersionListView from './list-view'

const styles = (theme) => {
  const {
    tab: { label },
  } = theme
  return {
    label,
    labelRoot: {
      height: '32px',
    },
  }
}

const { array, bool, func, object } = PropTypes

class PageDialectImmersionList extends PageDialectLearnBase {
  static propTypes = {
    hasPagination: bool,
    routeParams: object.isRequired,
    classes: object.isRequired,
    // // REDUX: reducers/state
    computeDocument: object.isRequired,
    computePortal: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // // REDUX: actions/dispatch/func
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    fetchLabelDirectory: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  DIALECT_FILTER_TYPE = 'immersion'

  /*
   TODO add shared categories for immersion specific (Shared Categories)
   Dictionary -> Dictionary with label or some other document type?
   */

  constructor(props, context) {
    super(props, context)

    const computeEntities = Immutable.fromJS([
      {
        id: props.routeParams.dialect_path,
        entity: props.computePortal,
      },
      {
        id: `${props.routeParams.dialect_path}/Label Dictionary`,
        entity: props.computeDocument,
      },
    ])

    this.state = {
      computeEntities,
      translateFilter: 'either',
    }

      // Bind methods to 'this'
      ;[
        '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
        '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
        '_handleFilterChange', // NOTE: Comes from PageDialectLearnBase
        '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
        '_onNavigateRequest', // NOTE: Comes from PageDialectLearnBase
        '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
        'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
      ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getPageKey = () => {
    return `${this.props.routeParams.area}_${this.props.routeParams.dialect_name}_immersion`
  }

  fetchData(newProps) {
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Label Dictionary')
    if (newProps.computeDirectory.isFetching !== true && newProps.computeDirectory.success !== true) {
      newProps.fetchLabelDirectory('fv_labels', 'immersive_labels')
    }
  }

  listToTree(arr) {
    const tree = []
    const mappedArr = {}
    let arrElem
    let mappedElem

    // First map the nodes of the array to an object -> create a hash table.
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i]
      mappedArr[arrElem.value] = arrElem
      mappedArr[arrElem.value].children = []
    }

    for (const id in mappedArr) {
      if (Object.prototype.hasOwnProperty.call(mappedArr, id)) {
        mappedElem = mappedArr[id]
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parent !== '') {
          if (mappedArr[mappedElem.parent]) {
            mappedArr[mappedElem.parent].children.push(mappedElem)
          } else {
            // console.log(mappedElem, ' is wrong parent')
          }
        } else {
          // If the element is at the root level, add it to first level elements array.
          tree.push(mappedElem)
        }
      }
    }
    return tree
  }

  handleSearch = () => { }

  resetSearch = () => { }

  // FILTERS
  changeFilter = (translateFilter) => {
    this.setState({ translateFilter })
  }

  clearFilter = () => { }

  render() {
    const { classes } = this.props
    const { computeEntities, translateFilter } = this.state

    const { routeParams } = this.props
    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Label Dictionary`
    )

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, `${routeParams.dialect_path}/Portal`)

    const allLabels = selectn('directoryEntries.fv_labels', this.props.computeDirectory) || []

    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
      ''} Immersion Portal` // need locale key

    const wordListView = selectn('response.uid', computeDocument) ? (
      <ImmersionListView
        parentID={selectn('response.uid', computeDocument)}
        routeParams={this.props.routeParams}
        allLabels={allLabels}
        selectedFilter={translateFilter}
      />
    ) : null

    const dialectClassName = getDialectClassname(computePortal)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-2', 'PrintHide')}>
            <div>
              <FormControl>
                <h2>
                  <FVLabel transKey="translation" defaultStr="Translation" transform="words" />
                </h2>
                <RadioGroup
                  name="translated"
                  value={translateFilter}
                  onChange={(ev) => {
                    this.changeFilter(ev.target.value)
                  }}
                >
                  <FormControlLabel
                    value="either"
                    control={<Radio color="primary" />}
                    label="All Labels" // need locale key
                    classes={{ label: classes.label, root: classes.labelRoot }}
                  />
                  <FormControlLabel
                    value="translated"
                    control={<Radio color="primary" />}
                    label="Translated Labels" // need locale key
                    classes={{ label: classes.label, root: classes.labelRoot }}
                  />
                  <FormControlLabel
                    value="untranslated"
                    control={<Radio color="primary" />}
                    label="Untranslated Labels" // need locale key
                    classes={{ label: classes.label, root: classes.labelRoot }}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className={classNames('col-xs-12', 'col-md-10')}>
            <h1 className="DialectPageTitle">{pageTitle}</h1>
            <div className={dialectClassName}>{wordListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  // END render
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, navigation, fvPortal, windowPath, directory } = state

  const { properties } = navigation
  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { computeDirectory } = directory
  const { splitWindowPath, _windowPath } = windowPath
  return {
    properties,
    computePortal,
    computeDocument,
    computeDirectory,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchPortal,
  fetchLabelDirectory,
  pushWindowPath,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PageDialectImmersionList))
