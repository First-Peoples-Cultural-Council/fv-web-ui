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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import selectn from 'selectn'
import DialectTile from 'components/DialectTile'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

// import { amber } from '@material-ui/core/colors'
import Grade from '@material-ui/icons/Grade'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'reducers/windowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

const { oneOfType, instanceOf, array, func, object, string, bool } = PropTypes

export class PortalListDialects extends Component {
  state = {
    isLanguageSwitchToggled: false,
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked })
  }

  static propTypes = {
    items: oneOfType([array, instanceOf(List)]),
    filteredItems: oneOfType([array, instanceOf(List)]),
    fieldMapping: object,
    siteTheme: string.isRequired,
    pushWindowPath: func.isRequired,
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

  componentDidMount() {
    const link = decodeURI(window.location.hash.substring(1))
    if (link) {
      this.setState({ isLanguageSwitchToggled: true })
    }
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

  organizeByLanguageSwitch = () => {
    return this.props.isWorkspaces ? (
      ''
    ) : (
      <FormGroup
        row
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={this.state.isLanguageSwitchToggled}
              onChange={this.handleChange('isLanguageSwitchToggled')}
              value="isLanguageSwitchToggled"
            />
          }
          label={this.props.intl.searchAndReplace('Organize by language')}
        />
      </FormGroup>
    )
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
    const href = encodeURI(`/${this.props.siteTheme}${tile.path.replace('/Portal', '')}`)
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
        data-cy="dialect-tile"
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
    if (this.props.isWorkspaces || !this.state.isLanguageSwitchToggled) {
      return this._oldView()
    }

    const items = this.props.filteredItems || this.props.items

    // Maps each language name to an array of the associated archives
    // For example {'Secwepemctsín' : [Splatsin Tsm7aksaltn's Archive, Secwepecm's Archive, etc. ] }
    const languages = {}

    // Maps language name to the language color.
    const languageColors = {}

    // If the language doesn't have a parent language set, it will be put in the 'Other FirstVoices Archives'.
    const defaultArchiveName = this.props.intl.searchAndReplace('Other FirstVoices Archives')

    // Perform mapping of above objects
    this.props.languages.forEach((lang) => {
      languages[lang.label] = []
      languageColors[lang.label] = lang.color
    })

    items.forEach((archive) => {
      const archiveName =
        selectn('contextParameters.lightancestry.dialect.fvdialect:parent_language', archive) || defaultArchiveName
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
        <span className="DialectTitle" id={key.replace(' / ', ' ')}>
          {key}
        </span>
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {archives.length > 0
            ? archives.map((tile) => this._createTile(tile))
            : this.props.intl.searchAndReplace('No public language archive.')}
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        {this.organizeByLanguageSwitch()}
        <div className="DialectList">{this._getContent()}</div>
      </>
    )
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
