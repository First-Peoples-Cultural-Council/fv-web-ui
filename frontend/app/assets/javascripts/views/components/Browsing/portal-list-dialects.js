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
import DialectTile from 'views/components/DialectTile'

// import { amber } from '@material-ui/core/colors'
import Grade from '@material-ui/icons/Grade'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

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

  componentDidUpdate() {
    const link = window.location.hash
    if (link) {
      const anchor = document.querySelector(link)
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  render() {
    const content = this._getContent()
    return <div className="DialectList">{content}</div>
  }

  _createTile = (tile) => {
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
    return (
      <DialectTile
        key={tile.uid}
        dialectCoverImage={dialectCoverImage}
        href={href}
        dialectTitle={dialectTitle}
        dialectDescription={dialectDescription}
        actionIcon={actionIcon}
        pushWindowPath={this.props.pushWindowPath}
      />
    )
  }

  _getContent = () => {
    const items = this.props.filteredItems || this.props.items

    if (this.props.isWorkspaces) {
      return (
        <div className="languageGroup fontAboriginalSans" style={{ borderLeft: '4px rgb(180, 0, 0) solid' }}>
          {items.map((tile) => this._createTile(tile))}
        </div>
      )
    }

    const languages = {
      'Other FirstVoices Archives': [],
    }

    const languageColors = {}

    this.props.languages.forEach((lang) => {
      languages[lang.language] = []
      languageColors[lang.language] = lang.color
    })

    items.forEach((archive) => {
      const language = selectn('contextParameters.lightancestry.dialect.dc:language', archive)

      if (!language) {
        languages['Other FirstVoices Archives'].push(archive)
      } else {
        if (!languages[language]) {
          languages[language] = []
        }
        languages[language].push(archive)
      }
    })

    const toReturn = Object.keys(languages).map((key) => {
      if (key !== 'Other FirstVoices Archives') {
        return (
          <div
            className="languageGroup fontAboriginalSans"
            key={key}
            style={{ borderLeft: `4px ${languageColors[key]} solid` }}
          >
            <span className="DialectTitle" id={key}>
              {key}
            </span>
            <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
              {languages[key].length > 0
                ? languages[key].map((tile) => this._createTile(tile))
                : 'No language archives available at this time.'}
            </div>
          </div>
        )
      }
    })

    if (languages['Other FirstVoices Archives'].length > 0) {
      toReturn.push(
        <div
          className="languageGroup fontAboriginalSans"
          key="Other FirstVoices Archives"
          style={{
            borderLeft: '4px rgb(180, 0, 0) solid',
          }}
        >
          <span className="DialectTitle" id="Other FirstVoices Archives">
            Other FirstVoices Archives
          </span>
          <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
            {languages['Other FirstVoices Archives'].map((tile) => this._createTile(tile))}
          </div>
        </div>
      )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(PortalListDialects)
