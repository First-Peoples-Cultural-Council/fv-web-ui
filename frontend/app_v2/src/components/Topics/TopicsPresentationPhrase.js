import React from 'react'
import PropTypes from 'prop-types'
// import useIcon from 'common/useIcon'
// import AudioMinimal from 'components/AudioMinimal'
// import { Link } from 'react-router-dom'
/**
 * @summary TopicsPresentationPhrase
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentationPhrase({ heading, image, listCount, url }) {
  // eslint-disable-next-line
  console.log('TopicsPresentationPhrase', { heading, image, listCount, url })
  return <div className="Topic">TopicsPresentationPhrase</div>
}
// PROPTYPES
const { string } = PropTypes
TopicsPresentationPhrase.propTypes = {
  heading: string,
  image: string,
  listCount: string,
  url: string,
}
export default TopicsPresentationPhrase
