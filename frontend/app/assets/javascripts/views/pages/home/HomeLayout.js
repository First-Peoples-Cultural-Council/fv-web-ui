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

import selectn from 'selectn'
import classNames from 'classnames'
import { isMobile } from 'react-device-detect'

import ProviderHelpers from 'common/ProviderHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import FVButton from 'views/components/FVButton'
// import IntroCardView from 'views/components/Browsing/intro-card-view'
// import TextHeader from 'views/components/Document/Typography/text-header'

// import NavigationHelpers from '../../../common/NavigationHelpers'
import FVLabel from 'views/components/FVLabel/index'

import HomeData from 'views/pages/home/HomeData'

/**
 * Explore Archive page shows all the families in the archive
 */

export class HomeLayout extends Component {
  // Render
  // ----------------------------------------
  render() {
    return (
      <HomeData>
        {({
          accessButtons,
          computeEntities,
          primary1Color,
          primary2Color,
          properties,
          // sections,
        }) => {
          // eslint-disable-next-line
          console.log('HomeData Liminal', {
            accessButtons,
            computeEntities,
            primary1Color,
            primary2Color,
            properties,
            // sections,
          })

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

          const computePage = ProviderHelpers.getEntry(
            this.props.computePage,
            `/${properties.domain}/sections/Site/Resources/`
          )
          const page = selectn('response.entries[0].properties', computePage)

          const accessButtonMarkup = accessButtons.map(({ url, text }, index) => {
            return (
              <FVButton
                variant="contained"
                key={`accessButton${index}`}
                color="primary"
                onClick={() => {
                  // eslint-disable-next-line
                  console.log('url!', url)
                  // pushWindowPath(url)
                }}
                style={{ marginRight: '10px', height: '50px' }}
              >
                {text ? (
                  text
                ) : (
                  <>
                    <FVLabel transKey="get_started!" defaultStr="Get Started!" transform="words" />!
                  </>
                )}
              </FVButton>
            )
          })
          return (
            // DATA: computeEntities
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
                        {/* DATA:
                        blocks[0].title
                        blocks[0].text
                      */}
                        {this.props.intl.searchAndReplace(selectn('fvpage:blocks[0].title', page), {})}
                      </h1>
                      <div className={classNames('home-intro-p-cont', 'body')}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.props.intl.searchAndReplace(selectn('fvpage:blocks[0].text', page), {}),
                          }}
                        />
                      </div>
                      <div>{accessButtonMarkup}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={classNames('row')} style={{ margin: '25px 0' }}>
                <div>
                  {/* DATA:
                  blocks[1].title
                  blocks[1].text
                */}
                  {/* {this._getBlockByArea(page, 1).map((block, i) => {
                    return (
                      <div key={i} className={classNames('col-xs-12')}>
                        <div className="body">
                          <h2 style={{ fontWeight: 500 }}>
                            {this.props.intl.searchAndReplace(selectn('title', block))}
                          </h2>
                          <p dangerouslySetInnerHTML={{ __html: selectn('text', block) }} />
                        </div>
                      </div>
                    )
                  })} */}
                </div>
              </div>

              <div className={classNames('row')} style={{ margin: '25px 0' }}>
                {/* DATA:
                  blocks[2].file.data
                  blocks[2].title
                  blocks[2].summary
                  √ primary1Color
                  √ primary2Color
                  √ properties
                */}
                {/* {this._getBlockByArea(page, 2).length > 0 ? (
                  <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
                    <TextHeader
                      title={this.props.intl.translate({
                        key: ['views', 'pages', 'home', 'tools_and_resources'],
                        default: 'TOOLS &amp; RESOURCES',
                        case: 'words',
                      })}
                      properties={properties}
                    />
                  </div>
                ) : null} */}

                <div>
                  {/* {this._getBlockByArea(page, 2).map((block, i) => {
                    return (
                      <div key={i} className={classNames('col-xs-12', 'col-md-3')}>
                        <IntroCardView block={block} primary1Color={primary1Color} primary2Color={primary2Color} />
                      </div>
                    )
                  })} */}
                </div>
              </div>

              <div className={classNames('row')} style={{ margin: '25px 0' }}>
                {/* DATA:
                  blocks[3].file.data
                  blocks[3].title
                  blocks[3].summary
                  √ primary1Color
                  √ primary2Color
                  √ properties
                */}
                {/* {this._getBlockByArea(page, 3).length > 0 ? (
                  <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
                    <TextHeader
                      title={this.props.intl.translate({
                        key: ['views', 'pages', 'home', 'news_and_updates'],
                        default: 'NEWS &amp; UPDATES',
                        case: 'words',
                      })}
                      properties={properties}
                    />
                  </div>
                ) : null} */}

                <div>
                  {/* {this._getBlockByArea(page, 3).map((block, i) => {
                    return (
                      <div key={i} className={classNames('col-xs-12', 'col-md-3')}>
                        <IntroCardView block={block} primary1Color={primary1Color} primary2Color={primary2Color} />
                      </div>
                    )
                  })} */}
                </div>
              </div>

              <div className={classNames('row')} style={{ margin: '25px 0' }}>
                {/* DATA:
                  blocks[4].title
                  blocks[4].text
                  √ properties
                */}
                {/* {this._getBlockByArea(page, 4).length > 0 ? (
                  <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
                    <TextHeader
                      title={this.props.intl.translate({
                        key: ['views', 'pages', 'home', 'compatibility'],
                        default: 'COMBATIBILITY',
                        case: 'words',
                      })}
                      properties={properties}
                    />
                  </div>
                ) : null} */}

                <div>
                  {/* {this._getBlockByArea(page, 4).map((block, i) => {
                    return (
                      <div key={i} className={classNames('col-xs-12')}>
                        <div className="body">
                          <h2 style={{ fontWeight: 500 }}>
                            {this.props.intl.searchAndReplace(selectn('title', block))}
                          </h2>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: this.props.intl.searchAndReplace(selectn('text', block)),
                            }}
                          />
                        </div>
                      </div>
                    )
                  })} */}
                </div>
              </div>
            </PromiseWrapper>
          )
        }}
      </HomeData>
    )
  }
}

// PROPTYPES
// ----------------------------------------
const { object } = PropTypes
HomeLayout.propTypes = {
  // REDUX: reducers/state
  computeLogin: object.isRequired,
  computePage: object.isRequired,
}

// REDUX: reducers/state
// ----------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPage, nuxeo, locale } = state

  const { computeLogin } = nuxeo
  const { computePage } = fvPage
  const { intlService } = locale

  return {
    computeLogin,
    computePage,
    intl: intlService,
  }
}

export default connect(mapStateToProps, null)(HomeLayout)
