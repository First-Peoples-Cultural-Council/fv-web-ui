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
import { pushWindowPath } from 'reducers/windowPath'

import classNames from 'classnames'
import FVButton from 'components/FVButton'
import NavigationHelpers from 'common/NavigationHelpers'
import FVLabel from 'components/FVLabel'

/**
 * Explore Archive page shows all the families in the archive
 */

const { func, object } = PropTypes
export class PageKidsHome extends Component {
  static propTypes = {
    // REDUX: reducers/state
    properties: object.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      pathOrId: null,
    }
  }

  render() {
    const homePageStyle = {
      position: 'relative',
      minHeight: '155px',
      height: '600px',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundPosition: '0 0',
      marginTop: '25px',
    }

    return (
      <div>
        <div
          className={classNames('container-fluid', 'kids-home')}
          style={{
            backgroundImage: 'url(assets/images/boy.gif), url(assets/images/girl.gif)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left 40px, right 45px',
          }}
        >
          <div className="row" style={homePageStyle}>
            <div className={classNames('col-xs-8', 'col-xs-offset-2', 'text-center')}>
              <span style={{ width: '45%' }}>
                <FVButton
                  variant="contained"
                  fullWidth
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate('/kids/FV/Workspaces/Data/', this.props.pushWindowPath, false)
                  }}
                  style={{ marginTop: '20vh' }}
                >
                  <FVLabel transKey="views.pages.kids.enter" defaultStr="Enter Kids Area" transform="words" />
                </FVButton>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation } = state

  const { properties } = navigation

  return {
    properties,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageKidsHome)
