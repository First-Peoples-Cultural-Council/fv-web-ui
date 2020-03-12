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
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchResultSet } from 'providers/redux/reducers/document'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const { bool, func, object, string } = PropTypes

export class QueryList extends Component {
  static propTypes = {
    fancy: bool,
    label: string.isRequired,
    onChange: func.isRequired,
    query: string.isRequired,
    queryId: string.isRequired,
    value: string,
    // REDUX: reducers/state
    computeResultSet: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchResultSet: func.isRequired,
  }

  static defaultProps = {
    fancy: true,
  }

  constructor(props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(event) {
    this.props.onChange(event.target.value)
  }

  componentWillReceiveProps(nextProps) {
    // Ensure value is in sync -- relevant for setting default value dynamically
    if (nextProps.value != undefined) {
      this.props.onChange(nextProps.value)
    }
  }

  componentDidMount() {
    this.props.fetchResultSet(this.props.queryId, {
      query: this.props.query,
      language: 'nxql',
      sortOrder: 'ASC',
    })
  }

  render() {
    const computeResultSet = ProviderHelpers.getEntry(this.props.computeResultSet, this.props.queryId)
    const entries = selectn('response.entries', computeResultSet) || []

    const computeEntities = Immutable.fromJS([
      {
        id: this.props.queryId,
        entity: this.props.computeResultSet,
      },
    ])

    return (
      <PromiseWrapper hideProgress computeEntities={computeEntities}>
        {this.props.fancy ? (
          <Select
            autoWidth
            value={this.props.value}
            onChange={this._handleChange}
            floatingLabelText={
              this.props.intl.trans('select', 'Select', 'first') + ' ' + this.props.intl.searchAndReplace(this.props.label) + ':'
            }
          >
            {entries.map((entry) => (
              <MenuItem key={selectn('ecm:uuid', entry)} value={selectn('ecm:uuid', entry)}>
                {selectn('dc:title', entry)}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <select className="form-control" value={this.props.value} onChange={this._handleChange}>
            <option value>Please select:</option>
            {entries.map((entry) => (
              <option key={selectn('ecm:uuid', entry)} value={selectn('ecm:uuid', entry)}>
                {selectn('dc:title', entry)}
              </option>
            ))}
          </select>
        )}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, locale } = state

  const { computeResultSet } = document
  const { intlService } = locale

  return {
    computeResultSet,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResultSet,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueryList)
