import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./AudioPreviewMinimal.css'
import AudioPreviewMinimalPresentation from './AudioPreviewMinimalPresentation'
import AudioPreviewMinimalData from './AudioPreviewMinimalData'

/**
 * @summary AudioPreviewMinimalContainer
 * @version 1.0.1
 *
 * @component
 *
 * @prop {object} props
 * @prop {string} props.src URL for audio file
 *
 * @returns {node} jsx markup
 */
function AudioPreviewMinimalContainer(props) {
  return (
    <AudioPreviewMinimalData src={props.src}>{(src, isPlaying, clickHandler)=>{
      return <AudioPreviewMinimalPresentation src={src} isPlaying={isPlaying} clickHandler={clickHandler} />
    }}</AudioPreviewMinimalData>
  )
}
// PROPTYPES
const { string } = PropTypes
AudioPreviewMinimalContainer.propTypes = {
  src: string,
}
AudioPreviewMinimalContainer.defaultProps = {
}

export default AudioPreviewMinimalContainer
