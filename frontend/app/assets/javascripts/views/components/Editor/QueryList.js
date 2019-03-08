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
import React, { Component, PropTypes } from "react"
import Immutable from "immutable"
import provide from "react-redux-provide"
import selectn from "selectn"

import ProviderHelpers from "common/ProviderHelpers"

import PromiseWrapper from "views/components/Document/PromiseWrapper"

import SelectField from "material-ui/lib/SelectField"
import MenuItem from "material-ui/lib/menus/menu-item"
import IntlService from "views/services/intl"

const intl = IntlService.instance

@provide
export default class DirectoryList extends Component {
  static propTypes = {
    fetchResultSet: PropTypes.func.isRequired,
    computeResultSet: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    queryId: PropTypes.string.isRequired,
    fancy: PropTypes.bool,
    value: PropTypes.string,
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
    this.props.fetchResultSet(this.props.queryId, {
      query: this.props.query,
      language: "nxql",
      sortOrder: "ASC",
    })
  }

  render() {
    let previewStyles = {
      padding: "10px",
    }

    const computeResultSet = ProviderHelpers.getEntry(this.props.computeResultSet, this.props.queryId)
    let entries = selectn("response.entries", computeResultSet) || []

    const computeEntities = Immutable.fromJS([
      {
        id: this.props.queryId,
        entity: this.props.computeResultSet,
      },
    ])

    return (
      <PromiseWrapper hideProgress={true} computeEntities={computeEntities}>
        {this.props.fancy ? (
          <SelectField
            maxHeight={300}
            autoWidth={true}
            value={this.props.value}
            onChange={this._handleChange}
            floatingLabelText={
              intl.trans("select", "Select", "first") + " " + intl.searchAndReplace(this.props.label) + ":"
            }
          >
            {entries.map((entry) => (
              <MenuItem
                key={selectn("ecm:uuid", entry)}
                value={selectn("ecm:uuid", entry)}
                primaryText={selectn("dc:title", entry)}
              />
            ))}
          </SelectField>
        ) : (
          <select className="form-control" value={this.props.value} onChange={this._handleStandardSelectChange}>
            <option value>Please select:</option>
            {entries.map((entry) => (
              <option key={selectn("ecm:uuid", entry)} value={selectn("ecm:uuid", entry)}>
                {selectn("dc:title", entry)}
              </option>
            ))}
          </select>
        )}
      </PromiseWrapper>
    )
  }
}
