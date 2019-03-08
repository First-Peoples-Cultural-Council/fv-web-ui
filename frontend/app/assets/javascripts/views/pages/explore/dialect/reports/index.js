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
import Immutable from 'immutable'

import classNames from 'classnames'
import provide from 'react-redux-provide'
import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import ReportBrowser from './browse-view'

/**
 * Learn songs
 */
@provide
export default class PageDialectReports extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchBooks: PropTypes.func.isRequired,
    computeBooks: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      filteredList: null,
    }

    // Bind methods to 'this'
    //[].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    return (
      <div>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className={classNames('col-xs-12', 'col-md-8')}>
            <h1>{selectn('response.title', computeDialect2)} Reports</h1>
            <ReportBrowser routeParams={this.props.routeParams} />
          </div>
        </div>
      </div>
    )
  }
}
