import React from 'react'
import PropTypes from 'prop-types'
// import useIcon from 'common/useIcon'
// import AudioMinimal from 'components/AudioMinimal'
// import { Link } from 'react-router-dom'
/**
 * @summary TopicsPresentationSong
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentationSong({ audio, heading, image, subheading, url }) {
  // eslint-disable-next-line
  console.log('TopicsPresentationSong', {
    audio,
    heading,
    image,
    subheading,
    url,
  })
  return <div className="Topic">TopicsPresentationSong</div>
}
// PROPTYPES
const { string } = PropTypes
TopicsPresentationSong.propTypes = {
  audio: string,
  heading: string,
  image: string,
  subheading: string,
  url: string,
}
export default TopicsPresentationSong
