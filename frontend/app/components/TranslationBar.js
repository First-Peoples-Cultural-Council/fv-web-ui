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

import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import { setLocale } from 'reducers/locale'
import { updateCurrentUser } from 'reducers/nuxeo/index'

import { fetchDialect2 } from 'reducers/fvDialect'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

import { routeHasChanged } from 'common/NavigationHelpers'

import FVLabel from 'components/FVLabel'

const { func, string, object } = PropTypes
class TranslationBar extends Component {
  static propTypes = {
    // REDUX: actions/dispatch/func
    setLocale: func.isRequired,
    updateCurrentUser: func.isRequired,
    fetchDialect2: func.isRequired,
    // REDUX: reducers/state
    currentLocale: string.isRequired,
    computeDialect2: object.isRequired,
    routeParams: object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  _handleChangeLocale = (value) => {
    this.props.setLocale(value)
  }

  _handleChangeImmersion = () => {
    this.props.updateCurrentUser(!this.props.currentImmersionMode)
  }

  fetchData(newProps) {
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path,
      this.props.fetchDialect2,
      this.props.computeDialect2
    )
  }

  async componentDidMount() {
    await this.fetchData(this.props)
  }

  // Refetch data on URL change
  async componentDidUpdate(prevProps) {
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      await this.fetchData(this.props)
    }
  }

  render() {
    const IMMERSION_FEATURE = 'immersion'

    let immersionMode = ''

    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    if (UIHelpers.isFeatureEnabled(IMMERSION_FEATURE, computeDialect2)) {
      immersionMode = (
        <FormControlLabel
          control={<Switch checked={this.props.currentImmersionMode} onChange={() => this._handleChangeImmersion()} />}
          label="Immersion Mode"
        />
      )
    }

    return (
      <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', textAlign: 'right' }}>
        <div>
          <div className="Navigation__immersionSwitch">{immersionMode}</div>

          <FVLabel transKey="choose_lang" defaultStr="Translate FirstVoices To" transform="first" />

          <Select
            value={this.props.currentLocale}
            style={{ marginLeft: '10px' }}
            onChange={(event) => {
              this._handleChangeLocale(event.target.value)
            }}
            inputProps={{
              name: 'locale',
              id: 'locale-select',
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fr">Français</MenuItem>
          </Select>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { locale, fvDialect, navigation } = state
  const { computeDialect2 } = fvDialect
  const { route } = navigation

  return {
    currentLocale: locale.locale,
    computeDialect2,
    routeParams: route.routeParams,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  setLocale,
  fetchDialect2,
  updateCurrentUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslationBar)
