import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Immutable from 'immutable'

// REDUX
import {connect} from 'react-redux'
// REDUX: actions/dispatch/func
import {fetchBooks} from 'providers/redux/reducers/fvBook'
import {fetchDialect2} from 'providers/redux/reducers/fvDialect'
import {fetchPortal} from 'providers/redux/reducers/fvPortal'
import {pushWindowPath} from 'providers/redux/reducers/windowPath'

/**
 * @summary DetailSongData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DetailSongData({children}) {
  const title = 'Song Title'
  const acknowledgement = 'We acknowledge the creator of this song'
  const audio = ['audio1', 'audio2']
  const culturalNotes = ['cultural notes']
  const definitions = ['defs']
  const dialectClassName = 'ElysseTestDialect'
  const literalTranslations = ['literal translations']
  const metadata = ''
  const photos = ['']
  const relatedAssets = ['']
  const relatedToAssets = ['']
  const videos = ['']

  // const computeProps= () => {
  //   const title = 'song title here'
  //   const acknowledgement = 'acknowledgement here'
  //   const audio = 'audio'
  //   const culturalNotes = 'cultural notes'
  //   const definitions = 'defs'
  //   const dialectClassName = 'ElysseDialect'
  //   const literalTranslations = 'literal translations'
  //   const metadata = ''
  //   const photos = ''
  //   const relatedAssets = ''
  //   const relatedToAssets = ''
  //   const videos = ''
  //   return true
  // }

  return children({
    acknowledgement,
    audio,
    culturalNotes,
    definitions,
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
const {array, func, string} = PropTypes
DetailSongData.propTypes = {}

export default DetailSongData
