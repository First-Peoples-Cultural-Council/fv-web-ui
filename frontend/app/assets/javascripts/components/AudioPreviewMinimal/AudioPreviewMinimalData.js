import {useState} from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./AudioPreviewMinimal.css'

/**
 * @summary AudioPreviewMinimalData
 * @version 1.0.1
 *
 * @component
 *
 * @prop {object} props
 * @prop {string} props.src URL for audio file
 *
 * @returns {callback} props.children({src,isPlaying})
 */
function AudioPreviewMinimalData(props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const src = 'HELLO'
  const clickHandler = () => {
    console.log(`Hi, ${src}`)
    setIsPlaying(isPlaying ? false : true)
  }
  return props.children({
    src,
    isPlaying,
    clickHandler,
  })
}
// PROPTYPES
const { array } = PropTypes
AudioPreviewMinimalData.propTypes = {
  items: array,
}
AudioPreviewMinimalData.defaultProps = {
}

export default AudioPreviewMinimalData
