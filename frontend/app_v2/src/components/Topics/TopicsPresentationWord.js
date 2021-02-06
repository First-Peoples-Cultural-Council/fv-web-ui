import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
import AudioMinimal from 'components/AudioMinimal'
import { Link } from 'react-router-dom'
/**
 * @summary TopicsPresentationWord
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentationWord({ audio, heading, image, subheading, url }) {
  const styles = image
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${image})`,
      }
    : {}
  return (
    <div
      style={styles}
      className={`
        Topic
  
        bg-fv-turquoise
        bg-center
        bg-cover
        flex
        flex-col
        items-center
        justify-between
        rounded-25
        xl:rounded-50
        py-6
        text-white
      `}
    >
      {/* <img style={{position: 'absolute', top: 0, left: 0, opacity: 0.5}} src={dev} /> */}
      {useIcon(
        'ChatBubble',
        `
        ${image ? 'fill-current' : 'opacity-30'}
        w-7
        h-7
        lg:w-8
        lg:h-8
        xl:w-12
        xl:h-12
      `
      )}
      {heading && (
        <h1
          className={`
          text-xl
          lg:text-2xl
          xl:text-5xl
          font-medium
        `}
        >
          <Link to={url}>{heading}</Link>
        </h1>
      )}
      {subheading && (
        <h2
          className={`
          text-base
          lg:text-xl
          xl:text-3xl
        `}
        >
          {subheading}
        </h2>
      )}
      {audio && <AudioMinimal.Container src={audio} />}
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
TopicsPresentationWord.propTypes = {
  audio: string,
  heading: string,
  image: string,
  subheading: string,
  url: string,
}
export default TopicsPresentationWord
