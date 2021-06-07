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

/**
 * Header for dialect pages
 */
export default class Header extends Component {
  static propTypes = {
    backgroundImage: PropTypes.string,
    dialect: PropTypes.object,
    portal: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showArchiveInfoMobile: false,
    }
  }

  render() {
    const { dialect, portal } = this.props

    const backgroundImage = selectn(
      'response.contextParameters.dialect.fvdialect:background_top_image.path',
      dialect.compute
    )
      ? selectn('response.contextParameters.dialect.fvdialect:background_top_image.path', dialect.compute)
      : selectn('response.contextParameters.portal.fv-portal:background_top_image.path', portal.compute)

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

    return (
      <div className="Header row" style={portalBackgroundStyles}>
        {this.props.children}
      </div>
    )
  }
}
