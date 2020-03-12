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
import { List } from 'immutable'
import selectn from 'selectn'

// import { amber } from '@material-ui/core/colors'
import Grade from '@material-ui/icons/Grade'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

const { oneOfType, instanceOf, array, func, object, string } = PropTypes

export class PortalListDialects extends Component {
  static propTypes = {
    items: oneOfType([array, instanceOf(List)]),
    filteredItems: oneOfType([array, instanceOf(List)]),
    fieldMapping: object,
    siteTheme: string.isRequired,
    // REDUX: reducers/state - none
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    fieldMapping: {
      title: 'properties.dc:title',
      logo: 'properties.file:content',
    },
  }

  render() {
    const content = this._getContent()
    return <div className="DialectList">{content}</div>
  }
  _getContent = () => {
    const items = this.props.filteredItems || this.props.items
    const toReturn = items.map((tile) => {
      // Switch roles
      const dialectRoles = selectn('contextParameters.lightportal.roles', tile)
      const actionIcon = ProviderHelpers.isActiveRole(dialectRoles) ? (
        <span>
          <Grade /*style={{ margin: '0 15px' }} color={amber[200]}*/ />
        </span>
      ) : null

      // Dialect title
      const title = selectn('contextParameters.lightancestry.dialect.dc:title', tile)
      const logo = selectn('contextParameters.lightportal.fv-portal:logo', tile)
      const dialectCoverImage = encodeURI(UIHelpers.getThumbnail(logo, 'Medium'))
      const href = `/${this.props.siteTheme}${tile.path.replace('/Portal', '')}`
      const dialectTitle = this.props.intl.searchAndReplace(title)
      const dialectDescription = tile.description ? (
        <span className="DialectDescription">{this.props.intl.searchAndReplace(tile.description)}</span>
      ) : null
      // const dialectTitle = title
      // const dialectDescription = tile.description ? (
      //   <span className="DialectDescription">{tile.description}</span>
      // ) : null
      return (
        <a
          key={tile.uid}
          className="Dialect"
          href={NavigationHelpers.generateStaticURL(href)}
          onClick={(e) => {
            e.preventDefault()
            NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
          }}
          title={title}
        >
          <span className="DialectCover" style={{ backgroundImage: `url('${dialectCoverImage}')` }} />
          <span className="DialectData">
            <span className="DialectTitle fontAboriginalSans">
              {dialectTitle}
              {actionIcon}
            </span>
            {dialectDescription}
          </span>
        </a>
      )
    })
    return toReturn
  }
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { locale } = state
  const { intlService } = locale

  return {
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortalListDialects)
