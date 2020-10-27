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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams } from 'reducers/navigation'
import { queryPage } from 'reducers/fvPage'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import classNames from 'classnames'

import ProviderHelpers from 'common/ProviderHelpers'
import { routeHasChanged } from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'

import PromiseWrapper from 'components/PromiseWrapper'

import Typography from '@material-ui/core/Typography'

/**
 * Explore Archive page shows all the families in the archive
 */

const { func, object, string } = PropTypes

export class PageContent extends Component {
  static propTypes = {
    area: string.isRequired,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computePage: object.isRequired,
    properties: object.isRequired,
    routeParams: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    queryPage: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      page: null,
      pageAction: undefined,
      mapVisible: false,
      pagePath: '/' + this.props.properties.domain + '/' + this.props.area + '/Site/Resources/',
      dialectsPath: '/' + this.props.properties.domain + '/' + this.props.area + '/',
    }
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps) {
    const title = selectn(
      'response.entries[0].properties.dc:title',
      ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath)
    )

    if (title && selectn('pageTitleParams.pageTitle', this.props.properties) != title) {
      this.props.changeTitleParams({ pageTitle: title })
    }

    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.setState(
        {
          page: null,
          pageAction: undefined,
        },
        () => {
          this.fetchData(this.props)
        }
      )
      return
      // Note: return ▲ prevents the code below from running ▼
    }

    const computePage = ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath)
    if (computePage.action !== this.state.pageAction) {
      let page = null

      // if (computePage.isError === true) {
      //   page = <div>isError</div>
      // }

      if (computePage.success === true) {
        const _properties = selectn('response.entries[0].properties', computePage)
        const pageTitle = selectn('dc:title', _properties)
        const _contentTitle = selectn('fvpage:blocks[0].title', _properties)
        const contentTitle = pageTitle !== _contentTitle ? _contentTitle : undefined
        const primary1Color = selectn('theme.palette.baseTheme.palette.primary1Color', this.props.properties)
        page = (
          <div>
            {pageTitle && (
              <Typography variant="h5" gutterBottom>
                {this.props.intl.searchAndReplace(pageTitle, { case: 'first' })}
              </Typography>
            )}

            <hr style={{ backgroundColor: primary1Color, width: '100%', height: '2px', margin: '0 0 10px 0' }} />

            {contentTitle && (
              <Typography variant="h6" gutterBottom>
                {this.props.intl.searchAndReplace(contentTitle, { case: 'first' })}
              </Typography>
            )}

            <div dangerouslySetInnerHTML={{ __html: selectn('fvpage:blocks[0].text', _properties) }} />
          </div>
        )
      }

      this.setState({
        page,
        pageAction: computePage.action,
      })
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.state.pagePath,
        entity: this.props.computePage,
      },
    ])

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row')} style={{ margin: '25px 0' }}>
          <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
            {this.state.page}
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  fetchData = (newProps) => {
    newProps.queryPage(
      this.state.pagePath,
      " AND fvpage:url LIKE '" +
        StringHelpers.clean(newProps.routeParams.friendly_url) +
        "'" +
        '&sortOrder=ASC' +
        '&sortBy=dc:title'
    )
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPage, navigation, nuxeo, windowPath, locale } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computePage } = fvPage
  const { _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeLogin,
    computePage,
    properties,
    routeParams: route.routeParams,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  queryPage,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageContent)
