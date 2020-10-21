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
import { List } from 'immutable'
import selectn from 'selectn'
import StatusBar from 'components/StatusBar'
import CircularProgress from '@material-ui/core/CircularProgress'
import ProviderHelpers from 'common/ProviderHelpers'
import Error403 from 'components/Error403'

import '!style-loader!css-loader!./PromiseWrapper.css'
import FVLabel from 'components/FVLabel'

/**
 * Simple component to handle loading of promises.
 */
export default class PromiseWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    computeEntities: PropTypes.instanceOf(List),
    titleEntityId: PropTypes.string,
    titleEntityField: PropTypes.string,
    renderOnError: PropTypes.bool,
    hideFetch: PropTypes.bool,
    hideProgress: PropTypes.bool,
  }

  static defaultProps = {
    renderOnError: false,
    hideFetch: false,
    titleEntityField: 'response.properties.dc:title',
    hideProgress: false,
  }

  state = {
    typeError: false,
  }

  render() {
    let statusMessage = null
    let render = null

    this.props.computeEntities.forEach((computeEntity) => {
      if (!List.isList(computeEntity.get('entity'))) {
        console.warn('Trying to use promise wrapper on compute entity that does not return a list.') // eslint-disable-line
        return false
      }

      const reducedOperation = ProviderHelpers.getEntry(computeEntity.get('entity'), computeEntity.get('id'))
      if (!reducedOperation || (reducedOperation.isError && selectn('message', reducedOperation))) {
        statusMessage = selectn('message', reducedOperation)
        const ErrorMessageMarkup = this._generateErrorMessageMarkup(statusMessage)
        if (!this.props.renderOnError) {
          // Note: Intentional == comparison
          if (statusMessage == '403') {
            render = <Error403 redirect={window.location.pathname} />
          } else {
            render = (
              <div>
                <h1 className="PromiseWrapper__heading">
                  404 - <FVLabel transKey="errors.page_not_found" defaultStr="Page Not Found" transform="first" />
                </h1>
                <p>
                  <FVLabel
                    transKey="errors.report_via_feedback"
                    defaultStr="Please report this error by emailing support@fpcc.ca so that we can fix it"
                    transform="first"
                  />
                  .
                </p>
                <p>
                  <FVLabel
                    transKey="errors.feedback_include_link"
                    defaultStr="Include the link or action you took to get to this page"
                  />
                  ) .
                </p>
                {ErrorMessageMarkup}
                <p>
                  <FVLabel transKey="thank_you!" defaultStr="Thank You!" transform="words" />
                </p>
              </div>
            )
          }
        }

        return false
      }

      if (reducedOperation.isFetching && !this.props.hideProgress) {
        // If response already exists, and instructed to hide future fetches, render null (e.g. for pagination, filtering)
        render =
          this.props.hideFetch && selectn('response_prev', reducedOperation) ? null : (
            <div className="PromiseWrapper__spinnerContainer">
              <CircularProgress variant="indeterminate" className="PromiseWrapper__spinner" />
              {selectn('message', reducedOperation) ? (
                <div className="PromiseWrapper__spinnerMessage">{selectn('message', reducedOperation)}</div>
              ) : null}
            </div>
          )
        return false
      }

      if (reducedOperation.success) {
        if (selectn('message', reducedOperation)) {
          statusMessage = selectn('message', reducedOperation)
        }
      }
    })
    // END `this.props.computeEntities.forEach`

    // Catch type errors
    if (statusMessage && (statusMessage instanceof TypeError || statusMessage instanceof Error)) {
      statusMessage = statusMessage.message
      render = <div>An unexpected error has occured.</div>
      return false
    }

    return (
      <div className="PromiseWrapper">
        {!render ? this.props.children : render} {<StatusBar message={statusMessage} />}
      </div>
    )
  }
  _generateErrorMessageMarkup = (statusMessage) => {
    if (statusMessage) {
      return (
        <div>
          <p>Please also include the following error message:</p>
          <p>
            <code className="PromiseWrapper__errorMessageCode">Error message: {statusMessage}</code>
          </p>
        </div>
      )
    }
    return null
  }
}
