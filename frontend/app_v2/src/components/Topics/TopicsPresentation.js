import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import dev from './dev.png'
import {
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  WIDGET_LIST_SONG,
  WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  // WIDGET_LIST_GENERIC,
} from 'common/constants'
import './Topics.css'
import useIcon from 'common/useIcon'
import AudioMinimal from 'components/AudioMinimal'
/**
 * @summary TopicsPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsWord({ audio, heading, image, subheading, url }) {
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
function TopicsPhrase(/*{
  heading,
  image,
  listCount,
  url,
}*/) {
  return <div className="Topic">TopicsPhrase</div>
}
function TopicsSong(/*{
  audio,
  heading,
  image,
  subheading,
  url,
}*/) {
  return <div className="Topic">TopicsSong</div>
}
function TopicsStory(/*{
  heading,
  image,
  subheading,
  url,
}*/) {
  return <div className="Topic">TopicsStory</div>
}
function TopicsPresentation({ topics }) {
  const topicComponents = topics.map(({ audio, heading, image, listCount, subheading, type, url }, index) => {
    const key = `topic${index}`
    switch (type) {
      case WIDGET_LIST_WORD:
        return <TopicsWord key={key} audio={audio} heading={heading} image={image} subheading={subheading} url={url} />
      case WIDGET_LIST_PHRASE:
        return <TopicsPhrase key={key} heading={heading} image={image} listCount={listCount} url={url} />
      case WIDGET_LIST_SONG:
        return <TopicsSong key={key} audio={audio} heading={heading} image={image} subheading={subheading} url={url} />
      case WIDGET_LIST_STORY:
        return <TopicsStory key={key} heading={heading} image={image} subheading={subheading} url={url} />

      default:
        return null
    }
  })
  return <div className="Topics flex flex-wrap">{topicComponents}</div>
}
// PROPTYPES
const { array } = PropTypes
TopicsPresentation.propTypes = {
  topics: array,
}

export default TopicsPresentation
