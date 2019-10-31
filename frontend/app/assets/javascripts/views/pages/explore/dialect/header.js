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
import NavigationHelpers from 'common/NavigationHelpers'
import selectn from 'selectn'
import classNames from 'classnames'
import PageStats from 'views/pages/explore/dialect/page-stats'
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
// import { SECTIONS } from 'common/Constants'

/**
 * Header for dialect pages
 */
export default class Header extends Component {
  static propTypes = {
    backgroundImage: PropTypes.string,
    portal: PropTypes.object,
    dialect: PropTypes.object,
    login: PropTypes.object,
    showStats: PropTypes.bool,
    routeParams: PropTypes.object,
  }

  static defaultProps = {
    showStats: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showArchiveInfoMobile: false,
    }
  }

  render() {
    const { portal, login, routeParams, showStats } = this.props

    const backgroundImage = selectn(
      'response.contextParameters.portal.fv-portal:background_top_image.path',
      portal.compute
    )

    let portalBackgroundImagePath = 'assets/images/cover.png'

    if (backgroundImage && backgroundImage.length > 0) {
      portalBackgroundImagePath = NavigationHelpers.getBaseURL() + backgroundImage
    }

    const portalBackgroundStyles = {
      position: 'relative',
      minHeight: '400px',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundImage: 'url("' + portalBackgroundImagePath + '")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }

    // const isSection = routeParams.area === SECTIONS

    return (
      <div className="Header row" style={portalBackgroundStyles}>
        <AuthenticationFilter login={login} hideFromSections routeParams={routeParams}>
          <div
            className={classNames('hidden-xs', { invisible: !showStats })}
            style={{
              width: '50%',
              background: 'rgba(255, 255, 255, 0.7)',
              margin: '10px 25px',
              borderRadius: '10px',
              padding: '10px',
              position: 'absolute',
              top: '15px',
              right: '0',
            }}
          >
            <PageStats dialectPath={routeParams.dialect_path} />
          </div>
        </AuthenticationFilter>

        {this.props.children}
      </div>
    )
  }
}
