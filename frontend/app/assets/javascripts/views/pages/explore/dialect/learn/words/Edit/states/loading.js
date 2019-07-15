import React from 'react'
import { PropTypes } from 'react'
import SpinnerBallFall from 'views/components/SpinnerBallFall'
const { string, object } = PropTypes
export class WordsEditStateLoading extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
  }
  static defaultProps = {
    className: '',
    copy: {},
  }
  render() {
    const { className, copy } = this.props
    const content = copy.loading ? copy.loading : <SpinnerBallFall />
    return <div className={`${className} WordsEdit WordsEdit--loading`}>{content}</div>
  }
}

export default WordsEditStateLoading
