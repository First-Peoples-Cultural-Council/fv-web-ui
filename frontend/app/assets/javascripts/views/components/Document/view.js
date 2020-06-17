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
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { fetchDocument } from 'providers/redux/reducers/document'

import Typography from '@material-ui/core/Typography'

import selectn from 'selectn'
import Link from 'views/components/Link'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import '!style-loader!css-loader!./DocumentView.css'
import FVLabel from '../FVLabel/index'

const { array, func, object, string } = PropTypes

/**
 * View word entry
 */
export class DocumentView extends Component {
  static propTypes = {
    id: string.isRequired,
    // REDUX: reducers/state
    computeDocument: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
    fetchDocument: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      deleteDialogOpen: false,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchDocument(newProps.id)
  }

  _onNavigateRequest(path) {
    NavigationHelpers.navigate('/' + path, this.props.pushWindowPath, true)
  }

  // Refetch data on URL change
  // componentWillReceiveProps(/*nextProps*/) {
  /*if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
          this.fetchData(nextProps);
        }
        else if (nextProps.routeParams.word !== this.props.routeParams.word) {
          this.fetchData(nextProps);
        }
        else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
          this.fetchData(nextProps);
        }*/
  // }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.id,
        entity: this.props.computeDocument,
      },
    ])

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.id)
    let content = null
    let actionButton = null
    if (selectn('response', computeDocument)) {
      switch (selectn('response.type', computeDocument)) {
        case 'FVWord':
          actionButton = (
            <Link href={NavigationHelpers.generateUIDPath('explore', selectn('response', computeDocument), 'words')}>
              <FVLabel transKey="view_word" defaultStr="View Word" transform="words" />
            </Link>
          )
          break

        case 'FVPhrase':
          actionButton = (
            <Link href={NavigationHelpers.generateUIDPath('explore', selectn('response', computeDocument), 'phrases')}>
              <FVLabel transKey="view_phrase" defaultStr="View Phrase" transform="phrases" />
            </Link>
          )
          break
        default: // NOTE: do nothing
      }

      content = (
        <div className="DocumentView">
          <Typography variant="h4">{selectn('response.title', computeDocument)}</Typography>

          <Typography variant="h5">
            <FVLabel transKey="type" defaultStr="Type" transform="first" />:{' '}
            {selectn('response.type', computeDocument).replace('FV', '')}
          </Typography>

          {actionButton && (
            <div className="DocumentView__actionButtons">
              <Typography variant="h6">{actionButton}</Typography>
            </div>
          )}
        </div>
      )
    }

    return (
      <PromiseWrapper computeEntities={computeEntities} renderOnError={false}>
        {content}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, navigation, windowPath } = state

  const { properties } = navigation
  const { computeDocument } = document
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDocument,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)
