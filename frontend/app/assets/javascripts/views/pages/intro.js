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

import classNames from 'classnames'
import FVButton from 'views/components/FVButton'
import FVLabel from '../components/FVLabel/index'

/**
 * Explore Archive page shows all the families in the archive
 */
const { func, object, string } = PropTypes
export class PageHome extends Component {
  static propTypes = {
    // REDUX: reducers/state
    properties: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      mapVisible: false,
      pagePath: '/' + this.props.properties.domain + '/sections/Site/Resources/',
      dialectsPath: '/' + this.props.properties.domain + '/sections/',
    }
    ;['_onNavigateRequest'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    const introMarginStyle = {
      position: 'relative',
      minHeight: '325px',
      backgroundColor: 'rgb(170, 18, 37)',
      overflow: 'hidden',
      padding: '50px 0',
    }

    return (
      <div>
        <div className="row" style={introMarginStyle}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-2')}>
            <p style={{ marginTop: '15px' }}>
              <img
                src="assets/images/intro-english.gif"
                alt="Language Legacies Celebrating Indigenous Cultures"
                className="img-responsive"
              />
            </p>
            <p>
              <img src="assets/images/logo.gif" alt="FirstVoices Logo" className="img-responsive" />
            </p>
            <a href="http://legacy.firstvoices.com/">
              <FVButton
                variant="contained"
                style={{
                  textAlign: 'center',
                  marginRight: '14px',
                }}
              >
                {'Legacy Site'}
              </FVButton>
            </a>
            <FVButton variant="contained" onClick={() => this._onNavigateRequest('/')} style={{ textAlign: 'center' }}>
              <FVLabel
                transKey="enter_firstvoices"
                defaultStr="Enter FirstVoices"
              />
            </FVButton>
            <p>
              <img
                src="assets/images/intro-french.gif"
                alt="Des patrimoines linguistiques célébrant des cultures indigènes"
                className="img-responsive"
              />
            </p>
          </div>
          <div className={classNames('col-xs-12', 'col-md-4')} style={{ textAlign: 'right' }}>
            <img
              src="assets/images/fv-girl.jpg"
              alt="FirstVoices Girl"
              className="img-responsive"
              style={{ paddingTop: '10px' }}
            />
          </div>
        </div>

        <div className="row">
          <div className={classNames('col-xs-12')} style={{ textAlign: 'center', padding: '15px 0' }}>
            <a href="http://www.fpcc.ca/" target="_blank" rel="noopener noreferrer">
              <img
                src="assets/images/logos/fphlcc-logo_sm.gif"
                alt="First Peoples' Heritage Language and Culture Council "
                width="145"
                height="36"
                hspace="5"
                border="0"
                align="absmiddle"
              />
            </a>{' '}
            &nbsp;
            <a href="http://www.fpcf.ca/" target="_blank" rel="noopener noreferrer">
              <img
                src="assets/images/logos/fpcf-logo_sm.gif"
                alt="First Peoples' Cultural Foundation   "
                width="199"
                height="36"
                hspace="5"
                border="0"
                align="absmiddle"
              />
            </a>
            <p style={{ padding: '15px 0' }}>We gratefully acknowledge the following supporters:</p>
            <a href="http://www.gov.bc.ca/arr/" target="_blank" rel="noopener noreferrer">
              <img
                src="assets/images/logos/BC_ARR_H.jpg"
                alt="Ministry of Aboriginal Relations and Reconcilation"
                width="127"
                height="36"
                border="0"
                align="absmiddle"
              />
            </a>{' '}
            &nbsp;
            <a href="http://www.pch.gc.ca/" target="_blank" rel="noopener noreferrer">
              <img
                src="assets/images/logos/logo_pch.gif"
                alt="Canadian Heritage"
                width="180"
                height="36"
                border="0"
                align="absmiddle"
              />
            </a>{' '}
            &nbsp;
            <a href="http://www.fntc.info/" target="_blank" rel="noopener noreferrer">
              <img
                src="assets/images/logos/FNTC.gif"
                alt="First Nation Technology Council"
                width="88"
                height="87"
                border="0"
              />
            </a>{' '}
            &nbsp;
            <a href="http://www.newrelationshiptrust.ca/" target="_blank" rel="noopener noreferrer">
              <img
                src="assets/images/logos/New-NRT-Logo-sm.jpg"
                alt="New Relationship Trust"
                width="126"
                height="88"
                border="0"
                align="absmiddle"
              />
            </a>{' '}
            &nbsp;
            <a href="http://www.languagegeek.com" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/logos/lg.gif" alt="Languagegeek.com" width="191" height="36" border="0" />
            </a>{' '}
            &nbsp;
            <a href="http://www.tavultesoft.com/" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/logos/tav.gif" alt="Tavultesoft" width="191" height="29" border="0" />
            </a>
          </div>
        </div>

        <div className="row" style={introMarginStyle} />
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, windowPath } = state

  const { properties } = navigation
  const { _windowPath } = windowPath

  return {
    properties,
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
)(PageHome)
