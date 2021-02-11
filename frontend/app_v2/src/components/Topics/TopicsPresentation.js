import React from 'react'
import PropTypes from 'prop-types'

import {
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  WIDGET_LIST_SONG,
  WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  // WIDGET_LIST_GENERIC,
} from 'common/constants'

import TopicsPresentationWord from 'components/Topics/TopicsPresentationWord'
import TopicsPresentationPhrase from 'components/Topics/TopicsPresentationPhrase'
import TopicsPresentationSong from 'components/Topics/TopicsPresentationSong'
import TopicsPresentationStory from 'components/Topics/TopicsPresentationStory'
/**
 * @summary TopicsPresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentation({ title, topics }) {
  const topicComponents = topics.map(({ audio, heading, image, listCount, subheading, type, url }, index) => {
    const key = `topic${index}`
    switch (type) {
      case WIDGET_LIST_WORD:
        return (
          <TopicsPresentationWord
            key={key}
            audio={audio}
            heading={heading}
            image={image}
            subheading={subheading}
            url={url}
          />
        )
      case WIDGET_LIST_PHRASE:
        return <TopicsPresentationPhrase key={key} heading={heading} image={image} listCount={listCount} url={url} />
      case WIDGET_LIST_SONG:
        return (
          <TopicsPresentationSong
            key={key}
            audio={audio}
            heading={heading}
            image={image}
            subheading={subheading}
            url={url}
          />
        )
      case WIDGET_LIST_STORY:
        return <TopicsPresentationStory key={key} heading={heading} image={image} subheading={subheading} url={url} />

      default:
        return null
    }
  })
  return (
    <div className="Topics bg-white">
      <div className="relative">
        <h2 className="mb-12 relative z-10 text-center text-4xl text-fv-blue font-bold uppercase sm:text-5xl">
          <span
            className={`
            inline-block
            px-4
            sm:px-8
            XXmd:px-16
            lg:px-20

            bg-white
          `}
          >
            {title}
          </span>
        </h2>
        <hr className="absolute z-0 w-full" style={{ top: '50%' }} />
      </div>
      <div
        className={`
        grid
        gap-3
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
      `}
      >
        {topicComponents}
      </div>
    </div>
  )
}
// PROPTYPES
const { array, string } = PropTypes
TopicsPresentation.propTypes = {
  topics: array,
  title: string,
}

export default TopicsPresentation
