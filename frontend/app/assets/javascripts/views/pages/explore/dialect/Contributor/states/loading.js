import React from 'react'
import { PropTypes } from 'react'
const { string, object } = PropTypes
export class ContributorStateLoading extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
  }
  static defaultProps = {
    className: 'FormRecorder',
    copy: {},
  }
  render() {
    const { className, copy } = this.props
    return <div className={`${className} Contributor Contributor--loading`}>{copy.loading}</div>
  }
}

export default ContributorStateLoading
