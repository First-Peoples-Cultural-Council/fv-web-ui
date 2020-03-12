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
import Immutable, { List, Map } from 'immutable'
import selectn from 'selectn'
import classNames from 'classnames'

import ConfGlobal from 'conf/local.js'
import FVLabel from '../FVLabel/index'
import { connect } from 'react-redux'

class IntroCardView extends Component {
  static propTypes = {
    primary1Color: PropTypes.string.isRequired,
    primary2Color: PropTypes.string.isRequired,
    block: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    let imgTag = ''
    const imgFile = selectn('file.data', this.props.block)

    if (imgFile) {
      imgTag = (
        <img
          style={{ width: '100%', borderBottom: '3px solid #fff' }}
          src={selectn('file.data', this.props.block)}
          alt={selectn('title', this.props.block)}
        />
      )
    }

    return (
      <div
        style={{
          maxHeight: '275px',
          maxWidth: '292px',
          padding: '0',
          backgroundColor: this.props.primary1Color,
          color: '#ffffff',
        }}
      >
        {imgTag}
        <h2
          style={{
            paddingLeft: '12px',
            color: '#ffffff',
            marginTop: '10px',
            fontWeight: 500,
          }}
        >
          <FVLabel

          />
          {this.props.intl.searchAndReplace(selectn('title', this.props.block))}
        </h2>
        <p
          className={classNames('body')}
          style={{ padding: '0 0 10px 12px', color: '#ffffff' }}
          dangerouslySetInnerHTML={{ __html: selectn('summary', this.props.block) }}
        />
        <div
          style={{
            backgroundColor: this.props.primary2Color,
            padding: '5px 6px',
            position: 'absolute',
            top: '46%',
            left: '6px',
            fontSize: '0.9em',
          }}
        >
          <FVLabel
            transKey="read_more"
            defaultStr="READ MORE"
            transform="upper"
            append=" +"
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { locale } = state
  const { intlService } = locale

  return {
    intl: intlService,
  }
}

export default connect(mapStateToProps)(IntroCardView)

