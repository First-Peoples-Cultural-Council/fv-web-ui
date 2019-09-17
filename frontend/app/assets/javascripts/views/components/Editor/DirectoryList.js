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
// REDUX: actions/dispatch/func
import { fetchDirectory } from 'providers/redux/reducers/directory'

import selectn from 'selectn'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import StringHelpers, { CLEAN_ID } from 'common/StringHelpers'
import IntlService from 'views/services/intl'
const intl = IntlService.instance

const { bool, func, object, string } = PropTypes

export class DirectoryList extends Component {
  static propTypes = {
    dataTestId: string,
    dir: string.isRequired, // NOTE: from parent, not redux
    fancy: bool,
    label: string.isRequired,
    onChange: func.isRequired,
    value: string,
    // REDUX: reducers/state
    computeDirectory: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchDirectory: func.isRequired,
    placeholder: bool,
  }

  static defaultProps = {
    fancy: true,
    placeholder: false,
  }

  constructor(props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)
    this._handleStandardSelectChange = this._handleStandardSelectChange.bind(this)
  }

  _handleChange(event, index, value) {
    this.props.onChange(value)
  }

  _handleStandardSelectChange(event) {
    this.props.onChange(event.target.value)
  }

  componentWillReceiveProps(nextProps) {
    // Ensure value is in sync -- relevant for setting default value dynamically
    if (nextProps.value !== undefined) {
      this.props.onChange(nextProps.value)
    }
  }

  componentDidMount() {
    this.props.fetchDirectory(this.props.dir)
  }

  render() {
    const { computeDirectory } = this.props

    const entries = selectn('directories.' + this.props.dir, computeDirectory) || []
    const dataTestId = StringHelpers.clean(this.props.dataTestId, CLEAN_ID)
    return (
      <div>
        {this.props.fancy ? (
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel htmlFor={`${this.props.label}_select`}>
              {intl.trans('select_x', 'Select ' + this.props.label, 'first', [this.props.label]) + ':'}
            </InputLabel>
            <Select
              data-testid={dataTestId}
              maxHeight={300}
              autoWidth
              value={this.props.value}
              onChange={this._handleChange}
              inputProps={{ name: `${this.props.label}_select` }}
            >
              {entries.map((entry) => (
                <MenuItem key={entry.value} value={entry.value}>
                  {entry.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <select onChange={this._handleStandardSelectChange} data-testid={dataTestId}>
            {this.props.placeholder ? <option value>Please select:</option> : ''}
            {/* Note: Had a conflict and `value={this.props.value}` was the incoming change */}
            {/* <select value={this.props.value} onChange={this._handleStandardSelectChange} data-testid={dataTestId}> */}
            {entries.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.text}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { directory } = state

  const { computeDirectory } = directory

  return {
    computeDirectory,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDirectory,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryList)
