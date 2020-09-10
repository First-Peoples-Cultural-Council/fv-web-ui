import PropTypes from 'prop-types'
import React from 'react'

/**
 * @summary DetailSongStoryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DetailSongStoryData({children, docId, docState}) {
  const title = 'Song Title'
  const acknowledgement = 'We acknowledge the creator of this song'
  const audio = [{uid: '30444f23-3783-4f36-98b8-d86aea105553'}]
  const culturalNotes = ['A cultural note', 'Another cultural note']
  const dialectClassName = 'ElysseTestDialect'
  const literalTranslations = ['literal translations']
  const metadata = ''
  const photos = ['']
  const relatedAssets = ['']
  const relatedToAssets = ['']
  const videos = ['']

  return children({
    acknowledgement,
    audio,
    culturalNotes,
    dialectClassName,
    literalTranslations,
    metadata,
    photos,
    relatedAssets,
    relatedToAssets,
    title,
    videos,
  })
}

// PROPTYPES
const {array, func, string, object} = PropTypes
DetailSongStoryData.propTypes = {
  docId: string,
  docState: string,
  computeBook: object,
  fetchBook: func,
  fetchDialect2: func,
  pushWindowPath: func,
}

export default DetailSongStoryData
