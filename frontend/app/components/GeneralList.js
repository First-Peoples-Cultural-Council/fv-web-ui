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
import { List, Map } from 'immutable'
import selectn from 'selectn'
import BrowsingCardView from 'components/CardView'
import FVLabel from 'components/FVLabel'

export default class GeneralList extends Component {
  static propTypes = {
    card: PropTypes.element,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    filteredItems: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    fields: PropTypes.instanceOf(Map),
    type: PropTypes.string,
    action: PropTypes.func,
    cols: PropTypes.number,
    cellHeight: PropTypes.number,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    cols: 3,
    cellHeight: 210,
    wrapperStyle: null,
    style: null,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const items = this.props.filteredItems || this.props.items

    if (selectn('length', items) == 0) {
      return (
        <div style={{ margin: '20px 0' }}>
          <FVLabel transKey="no_results_found" defaultStr="No Results Found" transform="first" append="." />
        </div>
      )
    }

    const card = this.props.card || <BrowsingCardView />

    return (
      <div className="row" style={this.props.wrapperStyle}>
        {(items || []).map(
          function (item, i) {
            return React.cloneElement(card, { key: i, item: item, ...this.props })
          }.bind(this)
        )}
      </div>
    )
  }
}
