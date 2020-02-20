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
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { fetchDirectory } from 'providers/redux/reducers/directory'
import { fetchDirectoryEntries } from 'providers/redux/reducers/directory'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import { withTheme } from '@material-ui/core/styles'

// Immersion specific
import ImmersionListView from 'views/pages/explore/dialect/immersion/list-view'
import ImmersionFilterList from 'views/components/ImmersionFilterList'

const { array, bool, func, object } = PropTypes
class PageDialectImmersionList extends PageDialectLearnBase {
  static propTypes = {
    hasPagination: bool,
    routeParams: object.isRequired,
    // // REDUX: reducers/state
    computeDocument: object.isRequired,
    computePortal: object.isRequired,
    computeSearchDialect: object,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // // REDUX: actions/dispatch/func
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    fetchDirectory: func.isRequired,
    pushWindowPath: func.isRequired,
    searchDialectUpdate: func,
  }
  static defaultProps = {
    searchDialectUpdate: () => {},
  }

  DIALECT_FILTER_TYPE = 'immersion'

  /*
    TODO add shared categories for immersion specific (Shared Categories)
    Dictionary -> Dictionary with label or some other document type?
  */

  constructor(props, context) {
    super(props, context)

    let filterInfo = this.initialFilterInfo()

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
      filterInfo,
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

  // NOTE: PageDialectLearnBase calls `_getPageKey`
  _getPageKey = () => {
    return `${this.props.routeParams.area}_${this.props.routeParams.dialect_name}_immersion`
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  // TODOSL REPLACE THESE PATHS
  fetchData(newProps) {
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Label Dictionary')
    if (newProps.computeDirectory.isFetching !== true && newProps.computeDirectory.success !== true) {
      newProps.fetchDirectoryEntries('fv_label_categories', ['parent'])
      newProps.fetchDirectoryEntries('fv_labels', ['type', 'template_strings', 'category'])
    }
  }

  listToTree(arr) {
    var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i]
      mappedArr[arrElem.id] = arrElem
      mappedArr[arrElem.id]['children'] = []
    }

    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id]
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parent !== '') {
          if (mappedArr[mappedElem['parent']]) {
            mappedArr[mappedElem['parent']]['children'].push(mappedElem)
          } else {
            console.log(mappedElem, ' is wrong parent')
          }
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem)
        }
      }
    }
    return tree
  }

  handleCategoryClick = async () => {}

  handleSearch = () => {}

  resetSearch = () => {}

  // FILTERS
  initialFilterInfo = () => {}

  changeFilter = () => {}

  clearFilter = () => {}

  render() {
    const { computeEntities, filterInfo } = this.state

    const { routeParams } = this.props
    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Label Dictionary`
    )

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, `${routeParams.dialect_path}/Portal`)

    const categories = selectn('directoryEntries.fv_label_categories', this.props.computeDirectory) || []
    const mappedCategories = this.listToTree(categories)

    const categoriesSize = mappedCategories.length
    const allLabels = selectn('directoryEntries.fv_labels', this.props.computeDirectory) || []

    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
      ''} Immersion Portal` // TODOSL add localization tag

    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = this._getURLPageProps() // via base > pulled from routeParams

    const wordListView = selectn('response.uid', computeDocument) ? (
      <ImmersionListView
        parentID={selectn('response.uid', computeDocument)}
        routeParams={this.props.routeParams}
        allLabels={allLabels}
        allCategories={categories}
        urlPageNumber={DEFAULT_PAGE}
        urlPageSize={DEFAULT_PAGE_SIZE}
      />
    ) : null

    const dialectClassName = getDialectClassname(computePortal)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-3', categoriesSize === 0 ? 'hidden' : null, 'PrintHide')}>
            <div>TODOSL Filter by whether word is translated or not yet TODO HERE</div>
            <div>
              <ImmersionFilterList
                title={'Browse Categories'}
                categories={mappedCategories}
                routeParams={this.props.routeParams}
              />
            </div>
          </div>
          <div className={classNames('col-xs-12', categoriesSize === 0 ? 'col-md-12' : 'col-md-9')}>
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
  fetchDirectory,
  fetchDirectoryEntries,
  pushWindowPath,
  searchDialectUpdate,
}

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(PageDialectImmersionList))
