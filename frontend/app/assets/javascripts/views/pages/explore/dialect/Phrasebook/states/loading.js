import React from 'react'
import { PropTypes } from 'react'
const { string, object } = PropTypes
export class PhrasebookStateLoading extends React.Component {
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
    return <div className={`${className} Phrasebook Phrasebook--unavailable`}>{copy.loading}</div>
  }
}

export default PhrasebookStateLoading
