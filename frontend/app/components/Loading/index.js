import React from 'react'
import PropTypes from 'prop-types'

// TODO: See about using something similar to:
// TODO: import CircularProgress from '@material-ui/core/lib/circular-progress'
// TODO: that works on IE and is small kb
import SpinnerBallFall from 'components/SpinnerBallFall'

import '!style-loader!css-loader!./Loading.css'

const { string } = PropTypes
export class Loading extends React.Component {
  static propTypes = {
    className: string,
  }
  static defaultProps = {
    className: '',
  }

  render() {
    const { className } = this.props
    const blockModifier = className !== '' ? `${className}--loading` : ''
    return (
      <div className={`${className} ${blockModifier} Loading`}>
        <SpinnerBallFall />
      </div>
    )
  }
}

export default Loading
