import React from 'react'
import PropTypes from 'prop-types'
// import useIcon from 'common/useIcon'
// import AudioMinimal from 'components/AudioMinimal'
// import { Link } from 'react-router-dom'
/**
 * @summary TopicsPresentationPhrase
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentationPhrase(/*{ heading, image, listCount, url }*/) {
  // eslint-disable-next-line
  // console.log('TopicsPresentationPhrase', { heading, image, listCount, url })
  return <div className="Topic">TopicsPresentationPhrase</div>
}
// PROPTYPES
const { string, number } = PropTypes
TopicsPresentationPhrase.propTypes = {
  heading: string,
  image: string,
  listCount: number,
  url: string,
}
export default TopicsPresentationPhrase
