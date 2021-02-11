import React from 'react'
import PropTypes from 'prop-types'
// import useIcon from 'common/useIcon'
// import AudioMinimal from 'components/AudioMinimal'
// import { Link } from 'react-router-dom'
/**
 * @summary TopicsPresentationStory
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function TopicsPresentationStory(/*{ heading, image, subheading, url }*/) {
  // eslint-disable-next-line
  // console.log('TopicsPresentationStory', { heading, image, subheading, url })
  return <div className="Topic">TopicsPresentationStory</div>
}
// PROPTYPES
const { string } = PropTypes
TopicsPresentationStory.propTypes = {
  heading: string,
  image: string,
  subheading: string,
  url: string,
}
export default TopicsPresentationStory
