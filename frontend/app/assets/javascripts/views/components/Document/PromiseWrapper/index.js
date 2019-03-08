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
import Immutable, { List, Map } from "immutable"

import selectn from "selectn"

import ConfGlobal from "conf/local.json"

import StatusBar from "views/components/StatusBar"

import CircularProgress from "material-ui/lib/circular-progress"

import ProviderHelpers from "common/ProviderHelpers"
import IntlService from "views/services/intl"

/**
 * Simple component to handle loading of promises.
 */
export default class PromiseWrapper extends Component {
  intl = IntlService.instance

  static propTypes = {
    computeEntities: PropTypes.instanceOf(List),
    titleEntityId: PropTypes.string,
    titleEntityField: PropTypes.string,
    renderOnError: PropTypes.bool,
    hideFetch: PropTypes.bool,
    style: PropTypes.object,
    hideProgress: PropTypes.bool,
  }

  static defaultProps = {
    renderOnError: false,
    hideFetch: false,
    titleEntityField: "response.properties.dc:title",
    style: {},
    hideProgress: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      typeError: false,
    }
  }

  render() {
    let statusMessage = null
    let render = null

    this.props.computeEntities.forEach(
      function(computeEntity) {
        if (!List.isList(computeEntity.get("entity"))) {
          console.warn("Trying to use promise wrapper on compute entity that does not return a list.")
          return false
        }

        let reducedOperation = ProviderHelpers.getEntry(computeEntity.get("entity"), computeEntity.get("id"))

        if (!reducedOperation || (reducedOperation.isError && selectn("message", reducedOperation))) {
          statusMessage = selectn("message", reducedOperation)

          if (!this.props.renderOnError) {
            render = (
              <div>
                <h1>
                  404 -{" "}
                  {this.intl.translate({
                    key: "errors.page_not_found",
                    default: "Page Not Found",
                    case: "first",
                  })}
                </h1>
                <p>
                  {this.intl.translate({
                    key: "errors.report_via_feedback",
                    default: "Please report this error by emailing support@fpcc.ca so that we can fix it",
                    case: "first",
                  })}
                  .
                </p>
                <p>
                  {this.intl.translate({
                    key: "errors.feedback_include_link",
                    default: "Include the link or action you took to get to this page",
                  })}
                  .
                </p>
                <p>Please also include the following error message:</p>
                <p>
                  <code style={{ width: "400px", border: "1px #e0e0e0 solid" }}>Error message: {statusMessage}</code>
                </p>
                <p>
                  {this.intl.translate({
                    key: "thank_you!",
                    default: "Thank You!",
                    case: "words",
                  })}
                </p>
              </div>
            )
          }

          return false
        }

        if (reducedOperation.isFetching && !this.props.hideProgress) {
          // If response already exists, and instructed to hide future fetches, render null (e.g. for pagination, filtering)
          render =
            this.props.hideFetch && selectn("response_prev", reducedOperation) ? null : (
              <div>
                <CircularProgress mode="indeterminate" style={{ verticalAlign: "middle" }} size={1} />{" "}
                {selectn("message", reducedOperation)}
              </div>
            )
          return false
        }

        if (reducedOperation.success) {
          if (selectn("message", reducedOperation)) {
            statusMessage = selectn("message", reducedOperation)
          }
        }
      }.bind(this)
    )

    // Catch type errors
    if (statusMessage && (statusMessage instanceof TypeError || statusMessage instanceof Error)) {
      console.error(statusMessage)
      statusMessage = statusMessage.message
      render = <div>An unexpected error has occured.</div>
      return false
    }

    return (
      <div style={this.props.style}>
        {!render ? this.props.children : render} {<StatusBar message={statusMessage} />}
      </div>
    )
  }
}
