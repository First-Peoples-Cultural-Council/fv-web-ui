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
import { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'
import { queryDialect2ByShortURL } from 'reducers/fvDialect'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

/**
 * Dialect portal page showing all the various components of this dialect.
 */

const { array, func, object, string } = PropTypes

export class ServiceShortURL extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2ByShortURL: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    queryDialect2ByShortURL: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.fetchData(this.props)
  }

  fetchData(newProps) {
    newProps.queryDialect2ByShortURL(
      '/FV/' + newProps.routeParams.area,
      " AND (fvdialect:short_url = '" +
        newProps.routeParams.dialectFriendlyName +
        "' OR ecm:name = '" +
        newProps.routeParams.dialectFriendlyName +
        "') AND ecm:isTrashed = 0 AND ecm:isCheckedInVersion = 0"
    )
  }

  componentWillReceiveProps(nextProps) {
    const dialectQuery = ProviderHelpers.getEntry(
      nextProps.computeDialect2ByShortURL,
      '/FV/' + nextProps.routeParams.area
    )

    let appendPath = ''

    if (nextProps.routeParams.appendPath) {
      appendPath = '/' + nextProps.routeParams.appendPath.replace(/_/g, '/')
    }

    const dialectFullPath = selectn('response.entries[0].path', dialectQuery)

    if (dialectQuery.success) {
      if (dialectFullPath) {
        nextProps.replaceWindowPath(NavigationHelpers.generateStaticURL('/explore' + dialectFullPath + appendPath))
      } else {
        nextProps.replaceWindowPath(NavigationHelpers.generateStaticURL('/404-page-not-found'))
      }
    }
  }

  render() {
    return null
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, navigation, windowPath } = state

  const { properties } = navigation
  const { computeDialect2ByShortURL } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2ByShortURL,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
  replaceWindowPath,
  queryDialect2ByShortURL,
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceShortURL)
