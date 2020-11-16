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

import FVLabel from 'components/FVLabel'

const { func, string } = PropTypes
class TranslationBar extends Component {
  static propTypes = {
    // REDUX: actions/dispatch/func
    setLocale: func.isRequired,
    // REDUX: reducers/state
    currentLocale: string.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  _handleChangeLocale = (value) => {
    this.props.setLocale(value)
  }

  render() {
    return (
      <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', textAlign: 'right' }}>
        <div>
          <div className="Navigation__immersionSwitch">
            <FormControlLabel
              control={
                <Switch checked={this.props.currentImmersionMode} onChange={() => this._handleChangeImmersion()} />
              }
              label="Immersion Mode"
            />
          </div>
          {/* <FormControl>
          <InputLabel>
            Immersion Mode
          </InputLabel>
          <Switch checked={this.props.currentImmersionMode === 1} onChange={() => this._handleChangeImmersion()} /> */}
          {/* <Select
            value={this.props.currentImmersionMode}
            onChange={(event) => {
              this._handleChangeImmersion(event.target.value)
            }}
            className={localePicker}
            inputProps={{
              name: 'locale',
              id: 'locale-select',
            }}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Immersive</MenuItem>
            <MenuItem value={2}>Both Languages</MenuItem>
          </Select> */}
          {/* </FormControl> */}

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
  const { locale } = state

  return {
    currentLocale: locale.locale,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  setLocale,
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslationBar)
