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
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import TextField from 'material-ui/lib/text-field'
import IconButton from 'material-ui/lib/icon-button'

import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * Explore Archive page shows all the families in the archive
 */

const { array, func, string } = PropTypes
export class SearchBar extends Component {
  static propTypes = {
    // REDUX: reducers/state
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  /*static contextTypes = {
        muiTheme: React.object.isRequired
    };*/

  constructor(props, context) {
    super(props, context)

    // Bind methods to 'this'
    ;['_handleDialectSearchSubmit'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _handleDialectSearchSubmit() {
    // TODO: this.refs DEPRECATED
    const queryParam = this.refs.dialectSearchField.getValue()
    const dialectPath = ProviderHelpers.getDialectPathFromURLArray(this.props.splitWindowPath)
    this.props.pushWindowPath('/explore/' + dialectPath + '/search/' + queryParam)
  }

  render() {
    const searchBarStyles = {
      display: 'inline-block',
    }

    return (
      <div style={searchBarStyles}>
        <TextField
          ref="dialectSearchField" // TODO: DEPRECATED
          hintText={intl.trans('views.pages.explore.dialect.search_dialect', 'Search Dialect...', 'words')}
          onEnterKeyDown={this._handleDialectSearchSubmit}
        />
        <IconButton
          onClick={this._handleDialectSearchSubmit}
          iconClassName="material-icons"
          iconStyle={{ fontSize: '24px' }}
          tooltip={intl.trans('search', 'Search', 'first')}
        >
          search
        </IconButton>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { windowPath } = state

  const { splitWindowPath, _windowPath } = windowPath

  return {
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)
