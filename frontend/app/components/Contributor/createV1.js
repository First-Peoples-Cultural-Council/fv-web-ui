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
import { createContributor } from 'reducers/fvContributor'
import { fetchDialect } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import FVButton from 'components/FVButton'
import CircularProgress from '@material-ui/core/CircularProgress'

import StatusBar from 'components/StatusBar'
import FVLabel from 'components/FVLabel'

import ProviderHelpers from 'common/ProviderHelpers'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
/**
 * Create contributor
 */

const { array, bool, func, object, string } = PropTypes
export class PageDialectContributorsCreate extends Component {
  static propTypes = {
    embedded: bool,
    onDocumentCreated: func,
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    computeDialect: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    embedded: false,
  }

  constructor(props, context) {
    super(props, context)

    this.formContributorCreate = React.createRef()

    this.state = {
      formValue: null,
      dialectPath: null,
      contributorPath: null,
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
      this.state.contributorPath &&
      selectn('success', ProviderHelpers.getEntry(nextProps.computeContributor, this.state.contributorPath))
    ) {
      this.props.onDocumentCreated(
        ProviderHelpers.getEntry(nextProps.computeContributor, this.state.contributorPath).response
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath != this.props.windowPath:
        return true

      case newProps.computeDialect.response != this.props.computeDialect.response:
        return true

      case newProps.computeContributor != this.props.computeContributor:
        return true
      default:
        return false
    }
  }

  _onNavigateRequest(/*path*/) {
    //this.props.pushWindowPath('/' + path);
  }

  _onRequestSaveForm(e) {
    e.preventDefault()

    const formValue = this.formContributorCreate.current.getValue()

    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] != '') {
          properties[key] = formValue[key]
        }
      }
    }

    this.setState({
      formValue: properties,
    })

    // Passed validation
    if (formValue) {
      const now = Date.now()
      this.props.createContributor(
        '/' + this.state.dialectPath + '/Contributors',
        {
          type: 'FVContributor',
          name: formValue['dc:title'],
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        contributorPath: '/' + this.state.dialectPath + '/Contributors/' + formValue['dc:title'] + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      if (!this.props.embedded) window.scrollTo(0, 0)
    }
  }

  render() {
    const { computeDialect, computeContributor } = this.props

    const dialect = computeDialect.response
    const contributor = ProviderHelpers.getEntry(computeContributor, this.state.contributorPath)

    if (computeDialect.isFetching || !computeDialect.success) {
      return <CircularProgress variant="indeterminate" />
    }

    return (
      <div>
        <h1 style={{ lineHeight: '1.2', margin: '0 0 10px' }}>
          <FVLabel
            transKey="views.pages.explore.dialect.contributors.add_new_contributor_to_x"
            defaultStr={'Add New Contributor to ' + dialect.get('dc:title')}
            params={[dialect.get('dc:title')]}
          />
        </h1>

        {contributor && contributor.message && contributor.action.includes('CREATE') ? (
          <StatusBar message={contributor.message} />
        ) : null}

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref={this.formContributorCreate}
                type={t.struct(selectn('FVContributor', fields))}
                context={dialect}
                value={this.state.formValue}
                options={selectn('FVContributor', options)}
              />
              <div className="form-group" style={{ marginTop: '20px' }}>
                <FVButton variant="contained" color="primary" onClick={this._onRequestSaveForm}>
                  <FVLabel transKey="save" defaultStr="Save" transform="first" />
                </FVButton>
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
  const { fvContributor, fvDialect, windowPath } = state

  const { computeContributor } = fvContributor
  const { computeDialect } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeContributor,
    computeDialect,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createContributor,
  fetchDialect,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectContributorsCreate)
