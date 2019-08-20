import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./SpinnerBallFall.css'
const { string, number } = PropTypes
export class SpinnerBallFall extends React.Component {
  static propTypes = {
    className: string,
    variation: number,
  }
  static defaultProps = {
    className: '',
    variation: 1,
  }
  render() {
    let classNameModifier = ''
    switch (this.props.variation) {
      case 1:
        classNameModifier = 'la-sm'
        break
      case 2:
        classNameModifier = 'la-dark'
        break
      case 3:
        classNameModifier = 'la-2x'
        break
      case 4:
        classNameModifier = 'la-3x'
        break
      default: // Note: do nothing
    }
    return (
      <div className={`la-ball-fall la-dark ${classNameModifier} ${this.props.className}`}>
        <div />
        <div />
        <div />
      </div>
    )
  }
}

export default SpinnerBallFall
