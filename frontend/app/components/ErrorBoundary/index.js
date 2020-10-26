import React from 'react'
import PropTypes from 'prop-types'

import '!style-loader!css-loader!./ErrorBoundary.css'

const { string, object } = PropTypes
export class ErrorBoundary extends React.Component {
  static propTypes = {
    className: string,
    errorMessage: string,
    copy: object,
  }

  static defaultProps = {
    className: '',
  }

  state = {
    copy: {
      errorBoundary: {},
    },
  }

  async componentDidMount() {
    const copy =
      this.props.copy ||
      (await import(/* webpackChunkName: "ErrorBoundaryCopy" */ './copy').then((_module) => {
        return _module.default
      }))
    this.setState({
      copy,
    })
  }

  render() {
    const { className, errorMessage } = this.props
    const { copy } = this.state
    const contents = errorMessage ? (
      <div>{errorMessage}</div>
    ) : (
      <div>
        <p>{copy.errorBoundary.explanation}</p>
        <p>{copy.errorBoundary.optimism}</p>
      </div>
    )

    const blockModifier = className !== '' ? `${className}--errorBoundary` : ''
    const element = className !== '' ? `${className}__heading` : ''
    return (
      <div className={`${className} ${blockModifier} ErrorBoundary`}>
        <h1 className={`${element} ErrorBoundary__heading`}>{copy.errorBoundary.title}</h1>
        {contents}
      </div>
    )
  }
}

export default ErrorBoundary
