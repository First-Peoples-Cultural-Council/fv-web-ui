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
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createLink } from 'providers/redux/reducers/fvLink'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import StatusBar from 'views/components/StatusBar'

import ProviderHelpers from 'common/ProviderHelpers'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import FVLabel from 'views/components/FVLabel/index'

/**
 * Create links
 */
const { array, bool, func, object, string } = PropTypes

export class PageDialectLinksCreate extends Component {
  static propTypes = {
    embedded: bool,
    onDocumentCreated: func,
    // REDUX: reducers/state
    computeDialect: object.isRequired,
    computeLink: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createLink: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    embedded: false,
  }

  constructor(props, context) {
    super(props, context)

    this.formLinkCreate = React.createRef()

    this.state = {
      formValue: null,
      dialectPath: null,
      linkPath: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    const dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath)
    this.setState({ dialectPath: dialectPath })

    if (!this.props.computeDialect.success) {
      newProps.fetchDialect('/' + dialectPath)
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.onDocumentCreated &&
      this.state.linkPath &&
      selectn('success', ProviderHelpers.getEntry(nextProps.computeLink, this.state.linkPath))
    ) {
      this.props.onDocumentCreated(ProviderHelpers.getEntry(nextProps.computeLink, this.state.linkPath).response)
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath !== this.props.windowPath:
        return true

      case newProps.computeDialect.response != this.props.computeDialect.response:
        return true

      case newProps.computeLink != this.props.computeLink:
        return true
      default:
        return false
    }
  }

  _onNavigateRequest(/*path*/) {
    //this.props.pushWindowPath('/' + path);
  }

  _onRequestSaveForm(e) {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formLinkCreate.current.getValue()
    const properties = {}
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] !== '') {
          properties[key] = formValue[key]
        }
      }
    }

    this.setState({
      formValue: properties,
    })

    // Check if a parent link was specified in the form
    const parentPathOrId = '/' + this.state.dialectPath + '/Links'
    // Passed validation
    if (formValue) {
      const now = Date.now()
      this.props.createLink(
        parentPathOrId,
        {
          type: 'FVLink',
          name: formValue['dc:title'],
          properties: properties,
        },
        properties['file:content'],
        now
      )

      this.setState({
        linkPath: parentPathOrId + '/' + formValue['dc:title'] + '.' + now,
      })
    } else {
      if (!this.props.embedded) window.scrollTo(0, 0)
    }
  }

  render() {
    const { computeDialect, computeLink } = this.props

    const dialect = computeDialect.response
    const link = ProviderHelpers.getEntry(computeLink, this.state.linkPath)

    if (computeDialect.isFetching || !computeDialect.success) {
      return <CircularProgress variant="indeterminate" />
    }

    return (
      <div>
        <Typography variant="headline" component="h2">
          <FVLabel
            transKey="views.pages.explore.dialect.links.add_new_link_to_x"
            defaultStr={'Add New Link to ' + dialect.get('dc:title')}
            transform="words"
            params={[dialect.get('dc:title')]}
          />
        </Typography>

        {link && link.message && link.action.includes('CREATE') ? <StatusBar message={link.message} /> : ''}

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form /*onSubmit={this._onRequestSaveForm}*/>
              <t.form.Form
                ref={this.formLinkCreate}
                type={t.struct(selectn('FVLink', fields))}
                context={dialect}
                value={this.state.formValue}
                options={selectn('FVLink', options)}
              />
              <div className="form-group">
                <button type="button" onClick={this._onRequestSaveForm} className="btn btn-primary">
                  <FVLabel
                    transKey="save"
                    defaultStr="Save"
                    transform="first"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvLink, windowPath } = state

  const { computeLink } = fvLink
  const { computeDialect } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect,
    computeLink,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createLink,
  fetchDialect,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLinksCreate)
