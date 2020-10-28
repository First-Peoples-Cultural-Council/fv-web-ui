import React from 'react'
import PropTypes from 'prop-types'

import ContributorDetail from 'components/Contributor/detail'
import validator from './validator'
import copy from './copy'
const { string } = PropTypes

export default class RecorderDetail extends React.Component {
  static propTypes = {
    className: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
  }

  render() {
    return <ContributorDetail className={this.props.className} validator={validator} copy={copy} />
  }
}
