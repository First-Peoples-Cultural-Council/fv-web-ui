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
import Immutable from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { navigateTo } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import FVButton from 'views/components/FVButton'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import UserListView from 'views/pages/explore/dialect/users/list-view'
import FVLabel from 'views/components/FVLabel/index'

/**
 * Browse users
 */
const { array, func, object, string } = PropTypes
export class Index extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    splitWindowPath: array.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    navigateTo: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    // Bind methods to 'this'
    ;['_onNavigateRequest'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _onNavigateRequest(pathArray) {
    NavigationHelpers.navigateForwardReplace(this.props.splitWindowPath, pathArray, this.props.pushWindowPath)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.props.fetchDialect2(this.props.routeParams.dialect_path)
    this.props.fetchPortal(this.props.routeParams.dialect_path + '/Portal')
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      nextProps.fetchPortal(nextProps.routeParams.dialect_path + '/Portal')
      // TODO: DefaultFetcherParams is undefined
      /* eslint-disable */
      console.log('! calling fetchData with undefined variable `DefaultFetcherParams`:', DefaultFetcherParams)
      this.fetchData(DefaultFetcherParams, nextProps)
      /* eslint-enable */
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
      <PromiseWrapper hideFetch computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper')}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              filter={{
                permission: 'Write',
                entity: selectn('response', computeDialect2),
                login: this.props.computeLogin,
              }}
            >
              <FVButton
                className="PrintHide"
                variant="contained"
                onClick={this._onNavigateRequest.bind(this, ['register'])}
                color="primary"
              >
                <FVLabel
                  transKey="views.pages.explore.dialect.users.create_new_user"
                  defaultStr="Create New User"
                  transform="words"
                />
              </FVButton>
            </AuthorizationFilter>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-xs-12">
            <UserListView routeParams={this.props.routeParams} />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPortal, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computePortal } = fvPortal
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computePortal,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPortal,
  navigateTo,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
