/*
 Copyright 2020 First People's Cultural Council

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
import Grade from '@material-ui/icons/Grade'

import ProviderHelpers from 'common/ProviderHelpers'
import DialectTile from 'components/DialectTile/DialectTileContainer'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

// REDUX
import { connect } from 'react-redux'
import selectn from 'selectn'
import NavigationHelpers from 'common/NavigationHelpers'

const { oneOfType, instanceOf, array, object, string, bool } = PropTypes

export class PortalListDialects extends Component {
  static propTypes = {
    items: oneOfType([array, instanceOf(List)]),
    filteredItems: oneOfType([array, instanceOf(List)]),
    fieldMapping: object,
    siteTheme: string.isRequired,
    isWorkspaces: bool.isRequired,
    languages: array.isRequired,
    intl: object.isRequired,
  }

  static defaultProps = {
    fieldMapping: {
      title: 'properties.dc:title',
      logo: 'properties.file:content',
    },
  }

  componentDidUpdate() {
    const link = decodeURI(window.location.hash.substring(1))
    if (link) {
      // We want to be able to grab any of the SENĆOŦEN / Malchosen / Lekwungen / Semiahmoo / T’Sou-ke.
      // This allows us to have a URL with # + one of any of the above names
      const anchor = document.querySelector(`[id*="${link}"]`)
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  _createTile = (tile) => {
    // Switch roles
    const dialectRoles = selectn('roles', tile)
    const actionIcon = ProviderHelpers.isActiveRole(dialectRoles) ? (
      <span>
        <Grade />
      </span>
    ) : null

    let dialectLogo = 'assets/images/cover.png'
    const logoID = selectn('logoId', tile) || null
    if (logoID !== null) {
      dialectLogo = `${NavigationHelpers.getBaseURL()}nxpicsfile/default/${tile.logoId}/Thumbnail:content/`
    }
    dialectLogo = encodeURI(dialectLogo)

    const href = encodeURI(`/${this.props.siteTheme}${tile.path.replace('/Portal', '')}`)
    const dialectTitle = selectn('title', tile)
    const dialectGroups = selectn('groups', tile) || []
    const joinText = selectn('fvdialect:join_text', tile) || 'Are you a member of the community or language team?'

    return (
      <DialectTile
        key={tile.uid}
        href={href}
        dialectGroups={dialectGroups}
        dialectLogo={dialectLogo}
        dialectTitle={dialectTitle}
        dialectId={tile.uid}
        joinText={joinText}
        actionIcon={actionIcon}
        data-cy="dialect-tile"
        isWorkspaces={this.props.isWorkspaces}
      />
    )
  }

  _oldView = () => {
    const items = this.props.filteredItems || this.props.items
    return (
      <div className="languageGroup fontBCSans" data-cy="old_view" style={{ display: 'flex', flexFlow: 'row wrap' }}>
        {items.map((tile) => this._createTile(tile))}
      </div>
    )
  }

  _getContent = () => {
    if (this.props.isWorkspaces) {
      return this._oldView()
    }

    const items = this.props.filteredItems || this.props.items

    // Maps each language name to an array of the associated archives
    // For example {'Secwepemctsín' : [Splatsin Tsm7aksaltn's Archive, Secwepecm's Archive, etc. ] }
    const languages = {}

    // Maps language name to the language color.
    const languageColors = {}

    // If the language doesn't have a parent language set, it will be put in the 'Other FirstVoices Archives'.
    const defaultArchiveName = this.props.intl.searchAndReplace('Other FirstVoices Language Sites')

    // Perform mapping of above objects
    this.props.languages.forEach((lang) => {
      languages[lang.label] = []
      languageColors[lang.label] = lang.color
    })

    items.forEach((archive) => {
      const archiveName = selectn('parentLanguageTitle', archive) || defaultArchiveName
      if (!languages[archiveName]) {
        languages[archiveName] = []
      }
      languages[archiveName].push(archive)
    })

    const toReturn = Object.keys(languages)
      .sort()
      .map((key) => {
        if (key !== defaultArchiveName) {
          return this._tile(key, languageColors[key], languages[key])
        }
        return null
      })

    // We want the 'Other FirstVoices Archives' to appear last.
    if (languages[defaultArchiveName] && languages[defaultArchiveName].length > 0) {
      toReturn.push(this._tile(defaultArchiveName, 'rgb(180, 0, 0)', languages[defaultArchiveName]))
    }
    return toReturn
  }

  _tile = (key, color, archives) => {
    return (
      <div
        className="languageGroup fontBCSans"
        data-cy="language_group_view"
        key={key}
        style={{ borderLeft: `4px ${color} solid` }}
      >
        <span className="LanguageTitle" id={key.replace(' / ', ' ')}>
          {key}
        </span>
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {archives.length > 0
            ? archives.map((tile) => this._createTile(tile))
            : this.props.intl.searchAndReplace('No public language site.')}
        </div>
      </div>
    )
  }

  render() {
    return <div className="DialectList">{this._getContent()}</div>
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

export default connect(mapStateToProps)(PortalListDialects)
