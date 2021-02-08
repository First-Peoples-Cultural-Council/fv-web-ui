import React from 'react'
import PropTypes from 'prop-types'

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
function TopicsPresentation({ topics }) {
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
  return <div className="Topics flex flex-wrap">{topicComponents}</div>
}
// PROPTYPES
const { array } = PropTypes
TopicsPresentation.propTypes = {
  topics: array,
}

export default TopicsPresentation
