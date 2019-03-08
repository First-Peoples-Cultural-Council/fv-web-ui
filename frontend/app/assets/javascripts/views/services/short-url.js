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
import React, { Component, PropTypes } from "react"

import provide from "react-redux-provide"
import selectn from "selectn"

import ProviderHelpers from "common/ProviderHelpers"

/**
 * Dialect portal page showing all the various components of this dialect.
 */
@provide
export default class ServiceShortURL extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    queryDialect2ByShortURL: PropTypes.func.isRequired,
    computeDialect2ByShortURL: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.fetchData(this.props)
  }

  fetchData(newProps) {
    newProps.queryDialect2ByShortURL(
      "/FV/" + newProps.routeParams.area,
      " AND (fvdialect:short_url = '" +
        newProps.routeParams.dialectFriendlyName +
        "' OR ecm:name = '" +
        newProps.routeParams.dialectFriendlyName +
        "') AND ecm:currentLifeCycleState <> 'deleted' AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0"
    )
  }

  componentWillReceiveProps(nextProps) {
    const dialectQuery = ProviderHelpers.getEntry(
      nextProps.computeDialect2ByShortURL,
      "/FV/" + nextProps.routeParams.area
    )
    const isSection = nextProps.routeParams.area === "sections"

    let appendPath = ""

    if (nextProps.routeParams.appendPath) {
      appendPath = "/" + nextProps.routeParams.appendPath.replace(/_/g, "/")
    }

    let dialectFullPath = selectn("response.entries[0].path", dialectQuery)

    if (dialectQuery.success) {
      if (dialectFullPath) {
        nextProps.replaceWindowPath("/explore" + dialectFullPath + appendPath)
      } else {
        nextProps.replaceWindowPath("/404-page-not-found")
      }
    }
  }

  render() {
    return null
  }
}
