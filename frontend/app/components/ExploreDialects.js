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
import { fetchPortalsFromCustomAPI } from 'reducers/fvPortal'
import { fetchDirectory } from 'reducers/directory'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import classNames from 'classnames'

import CircularProgress from '@material-ui/core/CircularProgress'
import NavigationHelpers from 'common/NavigationHelpers'
import PortalListDialects from 'components/PortalListDialects'
import { WORKSPACES } from 'common/Constants'
import FVLabel from 'components/FVLabel'

/**
 * Explore Archive page shows all the families in the archive
 */

const { func, object } = PropTypes

export class ExploreDialects extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computePortals: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchPortalsFromCustomAPI: func.isRequired,
    pushWindowPath: func.isRequired,
    fetchDirectory: func.isRequired,
  }

  state = {
    filteredList: null,
    open: false,
  }
  titleFieldMapping = 'contextParameters.lightancestry.dialect.dc:title'
  logoFieldMapping = 'contextParameters.lightportal.fv-portal:logo'

  // Fetch data on initial render
  componentDidMount() {
    this._fetchData(this.props)
  }

  // Refetch data on URL change
  async componentDidUpdate(prevProps) {
    if (this.props.routeParams.area !== prevProps.routeParams.area) {
      await this._fetchData(this.props)
    }
  }

  render() {
    let introText1
    let introText2 = ''

    // TODO: determine which of the following can be moved to componentDidMount()
    // TODO: no need to re-declare/fetch data that doesn't change between renders
    //const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this._getQueryPath())
    const isLoggedIn = this.props.computeLogin.success && this.props.computeLogin.isConnected

    let content = (
      <div>
        <CircularProgress variant="indeterminate" style={{ verticalAlign: 'middle' }} />
        Loading
      </div>
    )

    if (this.props.computePortals.success) {
      const portalsEntries = this.props.computePortals.response || []

      const sortedPortals = portalsEntries.sort(this._portalEntriesSort)

      const languages = selectn('directoryEntries.parent_languages', this.props.computeDirectory) || []

      const portalListProps = {
        siteTheme: this.props.routeParams.siteTheme,
        filteredItems: this.state.filteredList,
        fieldMapping: {
          title: this.titleFieldMapping,
          logo: this.logoFieldMapping,
        },
        items: sortedPortals,
        languages,
        isWorkspaces: this.props.routeParams.area === WORKSPACES,
      }
      content = <PortalListDialects {...portalListProps} />
    }

    if (this.props.routeParams.area === WORKSPACES) {
      if (isLoggedIn) {
        introText1 = <p>You are part of the following Workspaces (community portals):</p>
      }

      introText2 = (
        <p>
          <a href={NavigationHelpers.generateStaticURL('/explore/FV/sections/Data')}>
            Click here to view all publicly available portals
          </a>
          {' or click on "Public View" (top right).'}
        </p>
      )
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className={classNames({ hidden: this.props.routeParams.siteTheme === 'kids' })}>
              <h1>
                <FVLabel transKey="general.explore" defaultStr="Explore Languages" transform="title" />
              </h1>
            </div>
            {introText1}
            {content}
            {introText2}
          </div>
        </div>
      </div>
    )
  }

  _fetchData = (newProps) => {
    newProps.fetchPortalsFromCustomAPI({ area: newProps.routeParams.area })
    newProps.fetchDirectory('parent_languages', 2000, true)
  }

  _portalEntriesSort = (a, b) => {
    const a2 = selectn(this.titleFieldMapping, a)
    const b2 = selectn(this.titleFieldMapping, b)

    if (a2 < b2) return -1
    if (a2 > b2) return 1
    return 0
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPortal, navigation, nuxeo, directory } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computePortals } = fvPortal
  const { computeDirectory } = directory

  return {
    computeLogin,
    computePortals,
    computeDirectory,
    properties,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchPortalsFromCustomAPI,
  fetchDirectory,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDialects)
