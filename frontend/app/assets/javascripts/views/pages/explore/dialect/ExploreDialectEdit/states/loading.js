import React from 'react'
import { PropTypes } from 'react'
import SpinnerBallFall from 'views/components/SpinnerBallFall'
const { string, object } = PropTypes
export class ExploreDialectEditStateLoading extends React.Component {
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
    const content = copy.loading ? copy.loading : <SpinnerBallFall />
    return <div className={`${className} ExploreDialectEdit ExploreDialectEdit--loading`}>{content}</div>
  }
}

export default ExploreDialectEditStateLoading
