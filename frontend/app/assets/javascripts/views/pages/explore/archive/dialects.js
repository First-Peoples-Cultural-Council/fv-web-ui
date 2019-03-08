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
import Immutable, { List, Map } from "immutable"

import ConfGlobal from "conf/local.json"

import provide from "react-redux-provide"
import selectn from "selectn"
import classNames from "classnames"

import ProviderHelpers from "common/ProviderHelpers"

import PortalListDialects from "views/components/Browsing/portal-list-dialects"
import PromiseWrapper from "views/components/Document/PromiseWrapper"

// Operations
// import DirectoryOperations from "operations/DirectoryOperations"

// import Checkbox from "material-ui/lib/checkbox"
// import TextField from "material-ui/lib/text-field"
// import RaisedButton from "material-ui/lib/raised-button"
// import SelectField from "material-ui/lib/select-field"
// import MenuItem from "material-ui/lib/menus/menu-item"

// import withPagination from "views/hoc/grid-list/with-pagination"
// import withFilter from "views/hoc/grid-list/with-filter"
import IntlService from "views/services/intl"

const intl = IntlService.instance

/**
 * Explore Archive page shows all the families in the archive
 */
@provide
export default class ExploreDialects extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    fetchPortals: PropTypes.func.isRequired,
    computePortals: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  /*static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired
    };*/

  constructor(props, context) {
    super(props, context)

    this.state = {
      filteredList: null,
      open: false,
    }

    this.titleFieldMapping = "contextParameters.ancestry.dialect.dc:title"
    this.logoFieldMapping = "contextParameters.portal.fv-portal:logo"

    // Bind methods to 'this'
    ;["_portalEntriesSort"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // Fetch data on initial render
  componentDidMount() {
    this._fetchData(this.props)

    if (this.props.routeParams.area == "sections") {
      this.titleFieldMapping = "title"
      this.logoFieldMapping = "logo"
    }
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.area != this.props.routeParams.area) {
      this._fetchData(nextProps)
    }
  }

  render() {
    let introText1,
      introText2 = ""

    // TODO: determine which of the following can be moved to componentDidMount()
    // TODO: no need to re-declare/fetch data that doesn't change between renders
    const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this._getQueryPath())
    const portalsEntries = selectn("response.entries", computePortals) || []
    // Sort based on dialect name (all FVPortals have dc:title 'Portal')
    const sortedPortals = portalsEntries.sort(this._portalEntriesSort)

    const isLoggedIn = this.props.computeLogin.success && this.props.computeLogin.isConnected

    const portalListProps = {
      theme: this.props.routeParams.theme,
      filteredItems: this.state.filteredList,
      fieldMapping: {
        title: this.titleFieldMapping,
        logo: this.logoFieldMapping,
      },
      showOnlyUserDialects: isLoggedIn && this.props.routeParams.area == "Workspaces" ? true : false,
      items: sortedPortals,
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this._getQueryPath(),
        entity: this.props.computePortals,
      },
    ])

    if (this.props.routeParams.area == "Workspaces") {
      if (isLoggedIn) {
        introText1 = <p>You are part of the following Workspaces (community portals):</p>
      }

      introText2 = (
        <p>
          <a href="/explore/FV/sections/Data">Click here to view all publicly available portals</a> or click on "Public
          View" (top right).
        </p>
      )
    }

    return (
      <PromiseWrapper computeEntities={computeEntities}>
        <div className="row">
          <div className="col-xs-12">
            <div className={classNames({ hidden: this.props.routeParams.theme === "kids" })}>
              <h1>{intl.translate({ key: "general.explore", default: "Explore Languages", case: "title" })}</h1>
            </div>
            {introText1}
            <PortalListDialects {...portalListProps} />
            {introText2}
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  _fetchData(newProps) {
    newProps.fetchPortals(this._getQueryPath(newProps))
  }

  _getQueryPath(props = this.props) {
    // Perform an API query for sections
    if (props.routeParams.area == "sections") {
      // From s3 (static) (NOTE: when fetchPortals is fully switched remove headers from FVPortal to save OPTIONS call)
      return ConfGlobal.apiURL + "s3dialects/?area=" + props.routeParams.area

      // Proxy (not cached at the moment)
      //return 'https://api.firstvoices.com/v1/api/v1/query/get_dialects?queryParams=' + props.routeParams.area;
    }

    // Direct method
    return "/FV/" + props.routeParams.area + "/Data"
  }

  _portalEntriesSort(a, b) {
    const a2 = selectn(this.titleFieldMapping, a)
    const b2 = selectn(this.titleFieldMapping, b)

    if (a2 < b2) return -1
    if (a2 > b2) return 1
    return 0
  }
}
