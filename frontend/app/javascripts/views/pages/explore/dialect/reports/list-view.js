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
import classNames from 'classnames'
import Link from 'views/components/Link'
import PropTypes from 'prop-types'
const { bool, object, string } = PropTypes
class ReportsCardView extends Component {
  static propTypes = {
    dialectPath: string,
    fullWidth: bool,
    item: object,
    style: object,
  }
  static defaultProps = {
    item: {},
  }
  constructor(props, context) {
    super(props, context)

    this.state = {
      showIntro: false,
    }
  }

  render() {
    const _style = Object.assign({}, { marginBottom: '20px' }, this.props.style)
    return (
      <div
        style={_style}
        key={this.props.item.uid}
        className={classNames('col-xs-12', 'col-md-12', { 'col-md-4': !this.props.fullWidth })}
      >
        &#8226;{' '}
        <Link href={`/explore${this.props.dialectPath}/reports/${encodeURI(this.props.item.name)}`}>
          {this.props.item.name}
        </Link>
      </div>
    )
  }
}

export { ReportsCardView }
