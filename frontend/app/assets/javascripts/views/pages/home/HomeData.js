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

import Immutable from 'immutable'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { queryPage } from 'providers/redux/reducers/fvPage'
import { fetchUserStartpage } from 'providers/redux/reducers/fvUser'

import selectn from 'selectn'
// import ProviderHelpers from 'common/ProviderHelpers'
import { withTheme } from '@material-ui/core/styles'

/**
 * Explore Archive page shows all the families in the archive
 */

export class HomeData extends Component {
  // Constructor
  // ----------------------------------------
  constructor(props, context) {
    super(props, context)

    this.state = {
      pagePath: '/' + this.props.properties.domain + '/sections/Site/Resources/',
      dialectsPath: '/' + this.props.properties.domain + '/sections/',
    }
  }
  // Life cycle methods
  // ----------------------------------------
  componentDidMount() {
    this.props.queryPage(this.state.pagePath, " AND fvpage:url LIKE '/home/'" + '&sortOrder=ASC' + '&sortBy=dc:title')
    // Get user start page
    this.props.fetchUserStartpage('currentUser', {
      defaultHome: false,
    })
  }

  componentDidUpdate() {
    // Redirect user to their start page if they:
    // - are members of a single dialect
    // - have one defined

    // If user is accessing /home directly, do not redirect.
    if (this.props.windowPath.indexOf('/home') !== -1) {
      return
    }
    const _computeUserStartpage = ProviderHelpers.getEntry(this.props.computeUserStartpage, 'currentUser')
    const startPage = selectn('response.value', _computeUserStartpage)
    if (startPage) {
      window.location = startPage
    }
  }

  // Render
  // ----------------------------------------
  render() {
    const _computeUserStartpage = ProviderHelpers.getEntry(this.props.computeUserStartpage, 'currentUser')
    const accessButtonsEntries = selectn('response.entries', _computeUserStartpage) || []
    const accessButtons = accessButtonsEntries.map((dialect) => {
      return {
        url: NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/'),
        text: `Access ${selectn('properties.dc:title', dialect)}`,
      }
    })
    if (accessButtons.length === 0) {
      accessButtons.push({
        url: NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/'),
      })
    }

    return this.props.children({
      sections: [
        {
          file: {
            data: '',
          },
          title: '',
          summary: '',
          text: '',
        },
      ],
      properties: this.props.properties,
      computeEntities: Immutable.fromJS([
        {
          id: this.state.pagePath,
          entity: this.props.computePage,
        },
        {
          id: 'currentUser',
          entity: this.props.computeUserStartpage,
        },
      ]),
      primary1Color: selectn('theme.palette.primary1Color', this.props),
      primary2Color: selectn('theme.palette.primary2Color', this.props),
      accessButtons,
    })
  }

  // Custom methods
  // ----------------------------------------
  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  _getBlockByArea(page, area) {
    return (selectn('fvpage:blocks', page) || []).filter((block) => {
      return block.area === area
    })
  }
}

// PROPTYPES
// ----------------------------------------
const { func, object, string } = PropTypes
HomeData.propTypes = {
  // REDUX: reducers/state
  computeLogin: object.isRequired,
  computePage: object.isRequired,
  computeUserStartpage: object.isRequired,
  properties: object.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchUserStartpage: func.isRequired,
  pushWindowPath: func.isRequired,
  queryPage: func.isRequired,
}

// REDUX: reducers/state
// ----------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPage, fvUser, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computePage } = fvPage
  const { computeUserStartpage } = fvUser
  const { _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeLogin,
    computePage,
    computeUserStartpage,
    properties,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchUserStartpage,
  pushWindowPath,
  queryPage,
}

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(HomeData))
