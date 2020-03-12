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
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { fetchSourceDocument, fetchResultSet } from 'providers/redux/reducers/document'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import { WORKSPACES, SECTIONS } from 'common/Constants'

import '!style-loader!css-loader!./WorkspaceSwitcher.css'
import FVLabel from '../FVLabel/index'

const { array, func, object, string } = PropTypes

export class WorkspaceSwitcher extends Component {
  static propTypes = {
    area: string,
    className: string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeSourceDocument: object.isRequired,
    computeResultSet: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    fetchSourceDocument: func.isRequired,
    fetchResultSet: func.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  _getPotentialUUID = () => {
    return this.props.splitWindowPath[this.props.splitWindowPath.length - 1]
  }

  _getSourceDocument = async() => {
    const potentialUUID = this._getPotentialUUID()
    if (StringHelpers.isUUID(potentialUUID)) {
      await this.props.fetchSourceDocument(potentialUUID)
    } else {
      window.location.href = this._toggleWorkspaceSections(this.props.windowPath)
    }
  }

  _getPublishedDocument = async() => {
    const potentialUUID = this._getPotentialUUID()
    if (StringHelpers.isUUID(potentialUUID)) {
      await this.props.fetchResultSet('published_for_' + potentialUUID, {
        query: "SELECT ecm:uuid FROM Document WHERE ecm:proxyVersionableId = '" + potentialUUID + "'",
        language: 'nxql',
        pageSize: 1,
      })
    } else {
      window.location.href = this._toggleWorkspaceSections(this.props.windowPath)
    }
  }

  _isSection = () => {
    return this.props.routeParams.area === SECTIONS
  }

  _toggleWorkspaceSections = (path) => {
    return this._isSection() ? path.replace(SECTIONS, WORKSPACES) : path.replace(WORKSPACES, SECTIONS)
  }

  componentDidUpdate(prevProps) {
    const potentialUUID = this._getPotentialUUID()
    if (this._isSection()) {
      // Moving from Workspaces to sections
      const prev_source_doc = ProviderHelpers.getEntry(prevProps.computeSourceDocument, potentialUUID)
      const next_source_doc = ProviderHelpers.getEntry(this.props.computeSourceDocument, potentialUUID)

      const next_uuid = selectn('response.uid', next_source_doc)

      // 'Redirect' on success
      if (selectn('response.uid', prev_source_doc) != next_uuid && StringHelpers.isUUID(next_uuid)) {
        window.location.href = this._toggleWorkspaceSections(this.props.windowPath).replace(potentialUUID, next_uuid)
      }
    } else {
      // Moving from sections to Workspaces
      const prev_result_set = ProviderHelpers.getEntry(prevProps.computeResultSet, 'published_for_' + potentialUUID)
      const next_result_set = ProviderHelpers.getEntry(this.props.computeResultSet, 'published_for_' + potentialUUID)

      const next_uuid = selectn('response.entries[0].ecm:uuid', next_result_set)

      // 'Redirect' on success
      if (selectn('response.entries[0].ecm:uuid', prev_result_set) != next_uuid && StringHelpers.isUUID(next_uuid)) {
        window.location.href = this._toggleWorkspaceSections(this.props.windowPath).replace(potentialUUID, next_uuid)
      }
    }
  }

  render() {
    let noPublishedDocFound = ''
    if (
      selectn(
        'response.resultsCount',
        ProviderHelpers.getEntry(this.props.computeResultSet, 'published_for_' + this._getPotentialUUID())
      ) === 0
    ) {
      noPublishedDocFound = ' (N/A) '
    }

    return (
      <ul
        className={`WorkspaceSwitcher ${this.props.className} ${
          this._isSection() ? 'WorkspaceSwitcher--section' : 'WorkspaceSwitcher--workspace'
        }`}
      >
        <li
          role="presentation"
          className={`WorkspaceSwitcher__itemContainer ${
            this._isSection() ? '' : 'WorkspaceSwitcher__itemContainer--active'
          }`}
        >
          <button
            className="WorkspaceSwitcher__item"
            onClick={(e) => {
              e.preventDefault()
              if (this._isSection()) {
                this._getSourceDocument()
              }
            }}
          >
            <FVLabel
              transKey="workspace"
              defaultStr="Workspace"
              transform="words"
            />
          </button>
        </li>
        <li
          className={`WorkspaceSwitcher__itemContainer ${
            this._isSection() ? 'WorkspaceSwitcher__itemContainer--active' : ''
          }`}
        >
          <button
            className="WorkspaceSwitcher__item"
            onClick={(e) => {
              e.preventDefault()
              if (!this._isSection()) {
                this._getPublishedDocument()
              }
            }}
          >
            <FVLabel
              transKey="public_view"
              defaultStr="Public View"
              transform="words"
            />
            {noPublishedDocFound}
          </button>
        </li>
      </ul>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, navigation, windowPath } = state

  const { computeResultSet, computeSourceDocument } = document
  const { splitWindowPath, _windowPath } = windowPath
  const { route } = navigation
  return {
    computeResultSet,
    computeSourceDocument,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
  replaceWindowPath,
  fetchSourceDocument,
  fetchResultSet,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSwitcher)
