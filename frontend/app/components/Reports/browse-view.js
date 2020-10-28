/*
Copyright 2016 First People's Cultural Council

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
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'reducers/windowPath'

import ReportsJson from './reports.json'
import GeneralList from 'components/GeneralList'
import { ReportsCardView } from './list-view'

import withFilter from 'components/withFilter'
const FilteredCardList = withFilter(GeneralList)

/**
 * Learn songs
 */

const { array, bool, func, object, string } = PropTypes
export class ReportBrowser extends Component {
  static propTypes = {
    fullWidth: bool,
    routeParams: object.isRequired,
    style: object,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      filteredList: null,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', 'fixedListFetcher'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fixedListFetcher(list) {
    this.setState({
      filteredList: list,
    })
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    const listProps = {
      filterOptionsKey: 'Reports',
      fixedList: true,
      fixedListFetcher: this.fixedListFetcher,
      filteredItems: this.state.filteredList,
      fullWidth: this.props.fullWidth,
      style: { fontSize: '1.2em', padding: '8px 0 0 30px' },
      wrapperStyle: this.props.style,
      card: <ReportsCardView fullWidth={this.props.fullWidth} dialectPath={this.props.routeParams.dialect_path} />,
      area: this.props.routeParams.area,
      items: ReportsJson,
      action: this._onNavigateRequest,
    }

    const listView = <FilteredCardList {...listProps} />

    return listView
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, nuxeo, windowPath } = state
  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportBrowser)
