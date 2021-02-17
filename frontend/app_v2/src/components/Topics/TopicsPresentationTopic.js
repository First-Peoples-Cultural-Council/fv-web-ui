import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
import AudioMinimal from 'components/AudioMinimal'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import {
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  WIDGET_LIST_SONG,
  WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  // WIDGET_LIST_GENERIC,
} from 'common/constants'
/**
 * @summary TopicsPresentationTopic
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentationTopic({ audio, heading, image, listCount, subheading, type, url: _url }) {
  const { language } = useParams()
  const url = `${language}/${_url}`
  let bgColor
  let icon
  switch (type) {
    case WIDGET_LIST_WORD:
      bgColor = 'bg-fv-turquoise'
      icon = 'ChatBubble'
      break
    case WIDGET_LIST_PHRASE:
      bgColor = 'bg-fv-orange'
      icon = 'Quote'
      break
    case WIDGET_LIST_SONG:
      bgColor = 'fv-red'
      icon = 'MusicNote'
      break
    case WIDGET_LIST_STORY:
      bgColor = 'bg-fv-purple'
      icon = 'Book'
      break

    default:
      // nothing
      break
  }
  return (
    <div
      data-testid="TopicsPresentationTopic"
      style={
        image
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${image})`,
            }
          : {}
      }
      className={`
        ${bgColor}
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
        w-full
      `}
    >
      {useIcon(
        icon,
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
          text-center
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

      {listCount > 0 && (
        <div>
          {listCount === 1 && `${listCount} phrase`}
          {listCount > 1 && `${listCount} phrases`}
        </div>
      )}
    </div>
  )
}
// PROPTYPES
const { string, number } = PropTypes
TopicsPresentationTopic.propTypes = {
  audio: string,
  heading: string,
  image: string,
  listCount: number,
  subheading: string,
  type: string,
  url: string,
}
export default TopicsPresentationTopic
