import React from 'react'
import PropTypes from 'prop-types'

import ContributorDetail from 'views/pages/explore/dialect/Contributor/detail'
import validator from './validator'
import internationalization from './internationalization'
const { string } = PropTypes

export default class RecorderDetail extends React.Component {
  static propTypes = {
    className: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
  }

  render() {
    return <ContributorDetail className={this.props.className} validator={validator} copy={internationalization} />
  }
}
