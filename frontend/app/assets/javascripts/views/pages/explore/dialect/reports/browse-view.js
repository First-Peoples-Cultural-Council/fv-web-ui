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
import React, { Component, PropTypes } from 'react'

import provide from 'react-redux-provide'
import ReportsJson from './reports.json'
import GeneralList from 'views/components/Browsing/general-list'
import { CardView } from './list-view'

import withFilter from 'views/hoc/grid-list/with-filter'
const FilteredCardList = withFilter(GeneralList)

/**
 * Learn songs
 */
@provide
export default class ReportBrowser extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    style: PropTypes.object,
    fullWidth: PropTypes.bool,
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
      card: <CardView fullWidth={this.props.fullWidth} dialectPath={this.props.routeParams.dialect_path} />,
      area: this.props.routeParams.area,
      items: ReportsJson,
      action: this._onNavigateRequest,
    }

    const listView = <FilteredCardList {...listProps} />

    return listView
  }
}
