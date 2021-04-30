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
import t from 'tcomb-form'
import { connect } from 'react-redux'
import { Document } from 'nuxeo'

// FPCC
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchLink, updateLink } from 'reducers/fvLink'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

const { array, func, object, string } = PropTypes
export class Edit extends Component {
  static propTypes = {
    dialect: object,
    routeParams: object.isRequired,
    link: object,
    value: string,
    onDocumentCreated: func,
    cancelMethod: func,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLink: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchLink: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateLink: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      link: null,
      linkPath: !props.value ? props.routeParams.dialect_path + '/Dictionary/' + props.routeParams.link : props.value,
      formValue: null,
      saved: false,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm', '_onRequestCancelForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    if (!newProps.dialect) {
      newProps.fetchDialect2(this.props.routeParams.dialect_path)
    }

    newProps.fetchLink(this.state.linkPath)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentLink
    let nextLink

    if (this.state.linkPath !== null) {
      currentLink = ProviderHelpers.getEntry(this.props.computeLink, this.state.linkPath)
      nextLink = ProviderHelpers.getEntry(nextProps.computeLink, this.state.linkPath)
    }

    // Complete on success
    if (
      selectn('wasUpdated', currentLink) != selectn('wasUpdated', nextLink) &&
      selectn('wasUpdated', nextLink) === true
    ) {
      if (nextProps.onDocumentCreated) {
        nextProps.onDocumentCreated(selectn('response', nextLink))
      }
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    const previousLink = this.props.computeLink
    const nextLink = newProps.computeLink

    const previousDialect = this.props.computeDialect2
    const nextDialect = newProps.computeDialect2

    switch (true) {
      case newProps.routeParams.link != this.props.routeParams.link:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case typeof nextLink.equals === 'function' && nextLink.equals(previousLink) === false:
        return true

      case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
        return true
      default:
        return false
    }
  }

  _onRequestSaveForm = (e, computedItem) => {
    // Prevent default behaviour
    e.preventDefault()
    const formValue = this.form_FVLink.getValue()
    const properties = {}
    // Passed validation
    if (formValue) {
      for (const key in formValue) {
        if (Object.prototype.hasOwnProperty.call(formValue, key) && key) {
          if (formValue[key]) {
            // Filter out null values in an array
            if (formValue[key] instanceof Array) {
              const formValueKey = formValue[key].filter((item) => item !== null)
              properties[key] = formValueKey
            } else {
              properties[key] = formValue[key]
            }
          }
        }
      }
      const newDocument = new Document(computedItem.response, {
        repository: computedItem.response._repository,
        nuxeo: computedItem.response._nuxeo,
      })

      newDocument.set(properties)

      this.props.updateLink(newDocument, null, null)

      if (this.props.onDocumentCreated) {
        this.props.onDocumentCreated(newDocument)
      }

      this.setState({
        saved: true,
        formValue: properties,
      })
    } else {
      window.scrollTo(0, 0)
    }
  }

  _onRequestCancelForm() {
    if (this.props.cancelMethod) {
      this.props.cancelMethod()
    } else {
      NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
    }
  }

  render() {
    let context

    const computeLink = ProviderHelpers.getEntry(this.props.computeLink, this.state.linkPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computeLink)) {
      const providedFilter =
        selectn('response.properties.fv-link:definitions[0].translation', computeLink) ||
        selectn('response.properties.fv:literal_translation[0].translation', computeLink)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computeLink),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <div>
        <h1>
          <FVLabel
            transKey="views.pages.explore.dialect.links.edit_x_link"
            defaultStr={'Edit ' + selectn('response.properties.dc:title', computeLink) + ' Link'}
            transform="first"
            params={[selectn('response.properties.dc:title', computeLink)]}
          />
        </h1>
        <t.form.Form
          ref={(element) => {
            this.form_FVLink = element
          }}
          type={t.struct(selectn('FVLink', fields))}
          context={context}
          value={this.state.formValue || selectn('response.properties', computeLink)}
          options={selectn('FVLink', options)}
        />
        <FVButton variant="text" onClick={this._onRequestCancelForm} style={{ marginRight: '5px' }}>
          {<FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />}
        </FVButton>
        <FVButton
          data-testid="Link__saveBtn"
          variant="contained"
          color="primary"
          onClick={(e) => {
            this._onRequestSaveForm(e, computeLink)
          }}
          style={{ marginRight: '5px' }}
        >
          {<FVLabel transKey="save" defaultStr="Save" transform="first" />}
        </FVButton>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvLink, windowPath } = state

  const { computeLink } = fvLink
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeDialect2,
    computeLink,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchLink,
  pushWindowPath,
  replaceWindowPath,
  updateLink,
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
