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
  let textSize
  switch (type) {
    case WIDGET_LIST_WORD:
      bgColor = 'bg-fv-turquoise'
      icon = 'ChatBubble'
      textSize = 'text-4xl lg:text-5xl'
      break
    case WIDGET_LIST_PHRASE:
      bgColor = 'bg-fv-orange'
      icon = 'Quote'
      textSize = 'text-3xl lg:text-4xl'
      break
    case WIDGET_LIST_SONG:
      bgColor = 'bg-fv-red'
      icon = 'MusicNote'
      textSize = 'text-3xl lg:text-4xl'
      break
    case WIDGET_LIST_STORY:
      bgColor = 'bg-fv-purple'
      icon = 'Book'
      textSize = 'text-3xl lg:text-4xl'
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
        p-8
        text-white
        w-full
      `}
    >
      {useIcon(icon, `${image ? 'fill-current' : 'opacity-30'} w-7 h-7 lg:w-10 lg:h-10 xl:w-14 xl:h-14`)}
      {heading && (
        <h1 className={`${textSize} text-center font-medium my-3`}>
          <Link to={url}>{heading}</Link>
        </h1>
      )}
      {subheading && <h2 className="text-xl lg:text-2xl text-center">{subheading}</h2>}
      {audio && <AudioMinimal.Container src={audio} iconStyling="fill-current w-7 h-7 lg:w-8 lg:h-8 mt-3" />}

      {listCount > 0 && (
        <div className="text-lg lg:text-xl text-center text-fv-yellow">
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
