import React from 'react'
import { PropTypes } from 'react'
const { string, object } = PropTypes
export class WordsEditStateErrorBoundary extends React.Component {
  static propTypes = {
    className: string,
    errorMessage: string,
    copy: object,
  }
  static defaultProps = {
    className: '',
    copy: {
      errorBoundary: {},
    },
  }
  render() {
    const { className, copy, errorMessage } = this.props
    const contents = errorMessage ? (
      <div>{errorMessage}</div>
    ) : (
      <div>
        <p>{copy.errorBoundary.explanation}</p>
        <p>{copy.errorBoundary.optimism}</p>
      </div>
    )
    return (
      <div className={`${className} WordsEdit WordsEdit--errorBoundary`}>
        <h1 className="WordsEdit__heading">{copy.errorBoundary.title}</h1>
        {contents}
      </div>
    )
  }
}

export default WordsEditStateErrorBoundary
