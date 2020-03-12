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
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { queryPage } from 'providers/redux/reducers/fvPage'
import { fetchUserStartpage } from 'providers/redux/reducers/fvUser'

import selectn from 'selectn'
import classNames from 'classnames'

import ProviderHelpers from 'common/ProviderHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import FVButton from 'views/components/FVButton'
import { withTheme } from '@material-ui/core/styles'

import IntroCardView from 'views/components/Browsing/intro-card-view'
import TextHeader from 'views/components/Document/Typography/text-header'

import { isMobile } from 'react-device-detect'
import NavigationHelpers from '../../../common/NavigationHelpers'
import FVLabel from 'views/components/FVLabel/index'

/**
 * Explore Archive page shows all the families in the archive
 */

const { func, object, string } = PropTypes
export class PageHome extends Component {
  static propTypes = {
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


  constructor(props, context) {
    super(props, context)

    this.state = {
      pagePath: '/' + this.props.properties.domain + '/sections/Site/Resources/',
      dialectsPath: '/' + this.props.properties.domain + '/sections/',
    }
    ;['_onNavigateRequest', '_getBlockByArea'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  async componentDidMount() {
    await this.props.queryPage(
      this.state.pagePath,
      " AND fvpage:url LIKE '/home/'" + '&sortOrder=ASC' + '&sortBy=dc:title'
    )
    // Get user start page
    await this.props.fetchUserStartpage('currentUser', {
      defaultHome: false,
    })
  }

  componentDidUpdate() {
    /*
    Redirect user to their start page if they:
    - are members of a single dialect
    - have one defined
    */

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

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  _getBlockByArea(page, area) {
    return (selectn('fvpage:blocks', page) || []).filter((block) => {
      return block.area == area
    })
  }

  render() {
    let bgAlign = 'center'

    if (isMobile) {
      bgAlign = 'left'
    }

    const homePageStyle = {
      position: 'relative',
      minHeight: '155px',
      backgroundAttachment: 'fixed',
      background: 'transparent url("assets/images/fv-intro-background.jpg") bottom ' + bgAlign + ' no-repeat',
      backgroundSize: 'cover',
      boxShadow: 'inset 0px 64px 112px 0 rgba(0,0,0,0.6)',
      overflow: 'hidden',
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.pagePath,
        entity: this.props.computePage,
      },
      {
        id: 'currentUser',
        entity: this.props.computeUserStartpage,
      },
      /*
      {
      'id': this.state.dialectsPath,
      'entity': this.props.computePortals
      }
      */
    ])

    const _computeUserStartpage = ProviderHelpers.getEntry(this.props.computeUserStartpage, 'currentUser')
    const computePage = ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath)
    //const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this.state.dialectsPath);

    const page = selectn('response.entries[0].properties', computePage)
    //const dialects = selectn('response.entries', computePortals);

    const primary1Color = selectn('theme.palette.primary1Color', this.props)
    const primary2Color = selectn('theme.palette.primary2Color', this.props)

    const accessButtons = []

    // Compute User Registration Tasks
    ;(selectn('response.entries', _computeUserStartpage) || []).map(
      function computeUserStartPageMap(dialect, index) {
        const tableRow = (
          <FVButton
            variant="contained"
            key={index}
            color="primary"
            onClick={this._onNavigateRequest.bind(
              this,
              NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/')
            )}
            style={{ marginRight: '10px', height: '50px' }}
          >
            {'Access ' + selectn('properties.dc:title', dialect)}
          </FVButton>
        )

        accessButtons.push(tableRow)
      }.bind(this)
    )

    if (accessButtons.length === 0) {
      accessButtons[0] = (
        <FVButton
          variant="contained"
          key={0}
          color="primary"
          onClick={this._onNavigateRequest.bind(
            this,
            NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/')
          )}
          style={{ marginRight: '10px', height: '50px' }}
        >
          <FVLabel
            transKey="get_started!"
            defaultStr="Get Started!"
            transform="words"
          />!
        </FVButton>
      )
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row" style={homePageStyle}>
          <div style={{ position: 'relative', height: '650px' }}>
            <div className={classNames('col-xs-12')} style={{ height: '100%' }}>
              <div className="home-intro-block">
                <h1
                  className="display"
                  style={{
                    backgroundColor: 'rgba(180, 0, 0, 0.65)',
                    fontWeight: 500,
                  }}
                >
                  {this.props.intl.searchAndReplace(selectn('fvpage:blocks[0].title', page), {})}
                </h1>
                <div className={classNames('home-intro-p-cont', 'body')}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.intl.searchAndReplace(selectn('fvpage:blocks[0].text', page), {}),
                    }}
                  />
                </div>
                <div>{accessButtons}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={classNames('row')} style={{ margin: '25px 0' }}>
          <div>
            {this._getBlockByArea(page, 1).map((block, i) => {
              return (
                <div key={i} className={classNames('col-xs-12')}>
                  <div className="body">
                    <h2 style={{ fontWeight: 500 }}>{intl.searchAndReplace(selectn('title', block))}</h2>
                    <p dangerouslySetInnerHTML={{ __html: selectn('text', block) }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={classNames('row')} style={{ margin: '25px 0' }}>
          {this._getBlockByArea(page, 2).length > 0 ? (
            <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
              <TextHeader
                title={this.props.intl.translate({
                  key: ['views', 'pages', 'home', 'tools_and_resources'],
                  default: 'TOOLS &amp; RESOURCES',
                  case: 'words',
                })}
                properties={this.props.properties}
              />
            </div>
          ) : null}

          <div>
            {this._getBlockByArea(page, 2).map((block, i) => {
              return (
                <div key={i} className={classNames('col-xs-12', 'col-md-3')}>
                  <IntroCardView block={block} primary1Color={primary1Color} primary2Color={primary2Color} />
                </div>
              )
            })}
          </div>
        </div>

        <div className={classNames('row')} style={{ margin: '25px 0' }}>
          {this._getBlockByArea(page, 3).length > 0 ? (
            <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
              <TextHeader
                title={this.props.intl.translate({
                  key: ['views', 'pages', 'home', 'news_and_updates'],
                  default: 'NEWS &amp; UPDATES',
                  case: 'words',
                })}
                properties={this.props.properties}
              />
            </div>
          ) : null}

          <div>
            {this._getBlockByArea(page, 3).map((block, i) => {
              return (
                <div key={i} className={classNames('col-xs-12', 'col-md-3')}>
                  <IntroCardView block={block} primary1Color={primary1Color} primary2Color={primary2Color} />
                </div>
              )
            })}
          </div>
        </div>

        <div className={classNames('row')} style={{ margin: '25px 0' }}>
          {this._getBlockByArea(page, 4).length > 0 ? (
            <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
              <TextHeader
                title={this.props.intl.translate({
                  key: ['views', 'pages', 'home', 'compatibility'],
                  default: 'COMBATIBILITY',
                  case: 'words',
                })}
                properties={this.props.properties}
              />
            </div>
          ) : null}

          <div>
            {this._getBlockByArea(page, 4).map((block, i) => {
              return (
                <div key={i} className={classNames('col-xs-12')}>
                  <div className="body">
                    <h2 style={{ fontWeight: 500 }}>{this.props.intl.searchAndReplace(selectn('title', block))}</h2>
                    <p dangerouslySetInnerHTML={{ __html: this.props.intl.searchAndReplace(selectn('text', block)) }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
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

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(PageHome))
