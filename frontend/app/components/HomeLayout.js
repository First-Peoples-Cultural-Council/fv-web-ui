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

import selectn from 'selectn'
import classNames from 'classnames'
import { isMobile } from 'react-device-detect'

import PromiseWrapper from 'components/PromiseWrapper'
import FVButton from 'components/FVButton'
import IntroCardView from 'components/IntroCardView'
import TextHeader from 'components/Typography/text-header'
import FVLabel from 'components/FVLabel'
import HomeData from 'components/HomeData'

/**
 * Explore Archive page shows all the families in the archive
 */

export class HomeLayout extends Component {
  constructor() {
    super()
    this.state = {
      text: Date.now(),
    }
  }
  // Render
  // ----------------------------------------
  render() {
    return (
      <div key={this.state.test}>
        <HomeData>
          {({
            accessButtonClickHandler,
            accessButtons,
            computeEntities,
            primary1Color,
            primary2Color,
            properties,
            sections,
            intl,
          }) => {
            const area0 = this.getSectionByArea(sections, 0)
            const area1 = this.getSectionByArea(sections, 1)
            const area2 = this.getSectionByArea(sections, 2)
            const area3 = this.getSectionByArea(sections, 3)
            const area4 = this.getSectionByArea(sections, 4)

            const homePageStyle = {
              position: 'relative',
              minHeight: '155px',
              backgroundAttachment: 'fixed',
              background: `transparent url("assets/images/fv-intro-background.jpg") bottom ${
                isMobile ? 'left' : 'center'
              } no-repeat`,
              backgroundSize: 'cover',
              boxShadow: 'inset 0px 64px 112px 0 rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }
            return (
              <PromiseWrapper hideProgress renderOnError computeEntities={computeEntities}>
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
                          {intl.searchAndReplace(selectn([0, 'title'], area0), {})}
                        </h1>
                        <div className={classNames('home-intro-p-cont', 'body')}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: intl.searchAndReplace(selectn([0, 'text'], area0), {}),
                            }}
                          />
                        </div>
                        <div>
                          {accessButtons.map(({ url, text }, index) => {
                            return (
                              <FVButton
                                variant="contained"
                                key={`accessButton${index}`}
                                color="primary"
                                onClick={() => {
                                  accessButtonClickHandler(url)
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
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {area1.length > 0 &&
                  area1.map((area1SubSection, index) => {
                    return (
                      <div key={`area1SubSection${index}`} className={classNames('row')} style={{ margin: '25px 0' }}>
                        <div className={classNames('col-xs-12')}>
                          <div className="body">
                            <h2 style={{ fontWeight: 500 }}>
                              {intl.searchAndReplace(selectn('title', area1SubSection))}
                            </h2>
                            <p dangerouslySetInnerHTML={{ __html: selectn('text', area1SubSection) }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}

                {area2.length > 0 && (
                  <div className={classNames('row')} style={{ margin: '25px 0' }}>
                    <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
                      <TextHeader
                        title={intl.translate({
                          key: ['views', 'pages', 'home', 'tools_and_resources'],
                          default: 'TOOLS &amp; RESOURCES',
                          case: 'words',
                        })}
                        properties={properties}
                      />
                    </div>
                    <div>
                      <div className={classNames('col-xs-12', 'col-md-3')}>
                        {area2.map((area2Subsection, index) => {
                          return (
                            <IntroCardView
                              key={`area2Subsection${index}`}
                              block={area2Subsection}
                              primary1Color={primary1Color}
                              primary2Color={primary2Color}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {area3.length > 0 && (
                  <div className={classNames('row')} style={{ margin: '25px 0' }}>
                    <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
                      <TextHeader
                        title={intl.translate({
                          key: ['views', 'pages', 'home', 'news_and_updates'],
                          default: 'NEWS &amp; UPDATES',
                          case: 'words',
                        })}
                        properties={properties}
                      />
                    </div>
                    <div>
                      <div className={classNames('col-xs-12', 'col-md-3')}>
                        {area3.map((area3Subsection, index) => {
                          return (
                            <IntroCardView
                              key={`area3Subsection${index}`}
                              block={area3Subsection}
                              primary1Color={primary1Color}
                              primary2Color={primary2Color}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {area4.length > 0 && (
                  <div className={classNames('row')} style={{ margin: '25px 0' }}>
                    <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
                      <TextHeader
                        title={intl.translate({
                          key: ['views', 'pages', 'home', 'compatibility'],
                          default: 'COMBATIBILITY',
                          case: 'words',
                        })}
                        properties={properties}
                      />
                    </div>
                    <div>
                      <div className={classNames('col-xs-12')}>
                        <div className="body">
                          <h2 style={{ fontWeight: 500 }}>{intl.searchAndReplace(selectn([0, 'title'], area4))}</h2>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: intl.searchAndReplace(selectn([0, 'text'], area4)),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </PromiseWrapper>
            )
          }}
        </HomeData>
      </div>
    )
  }

  // Custom methods
  // ----------------------------------------
  getSectionByArea(sections, area) {
    return (sections || []).filter((section) => {
      return section.area === area
    })
  }
}

export default HomeLayout
