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
import { fetchDialectList } from 'providers/redux/reducers/fvDialect'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

const { bool, func, object, string } = PropTypes
export class DialectList extends Component {
  static propTypes = {
    fancy: bool,
    label: string.isRequired,
    onChange: func.isRequired,
    query: string.isRequired, // NOTE: don't think this is being set
    queryId: string.isRequired, // NOTE: don't think this is being set
    value: string,
    // REDUX: reducers/state
    computeDialectList: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialectList: func.isRequired,
  }

  static defaultProps = {
    fancy: true,
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
    if (nextProps.value != undefined) {
      this.props.onChange(nextProps.value)
    }
  }

  componentDidMount() {
    this.props.fetchDialectList(this.props.queryId, {
      dialectState: 'to-join',
    })
  }

  render() {
    const computeDialectList = ProviderHelpers.getEntry(this.props.computeDialectList, this.props.queryId)
    const entries = selectn('response', computeDialectList) || []

    const computeEntities = Immutable.fromJS([
      {
        id: this.props.queryId,
        entity: this.props.computeDialectList,
      },
    ])

    return (
      <PromiseWrapper hideProgress computeEntities={computeEntities}>
        {this.props.fancy ? (
          <SelectField
            maxHeight={300}
            autoWidth
            value={this.props.value}
            onChange={this._handleChange}
            floatingLabelText={
              intl.trans('select', 'Select', 'first') + ' ' + intl.searchAndReplace(this.props.label) + ':'
            }
          >
            {entries.map((entry) => (
              <MenuItem
                key={selectn('ecm:uuid', entry)}
                value={selectn('ecm:uuid', entry)}
                primaryText={selectn('dc:title', entry)}
              />
            ))}
          </SelectField>
        ) : (
          <select className="form-control" value={this.props.value} onChange={this._handleStandardSelectChange}>
            <option value>
              {intl.trans('select', 'Select', 'first') + ' ' + intl.searchAndReplace(this.props.label) + ':'}
            </option>
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
  const { fvDialect } = state

  const { computeDialectList } = fvDialect

  return {
    computeDialectList,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialectList,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialectList)
