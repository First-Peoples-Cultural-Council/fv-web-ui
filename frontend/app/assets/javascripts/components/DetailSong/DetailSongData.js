import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Immutable from 'immutable'

// REDUX
import {connect} from 'react-redux'
// REDUX: actions/dispatch/func
import {fetchBook} from 'providers/redux/reducers/fvBook'
import {fetchBooks} from 'providers/redux/reducers/fvBook'
import {fetchDialect2} from 'providers/redux/reducers/fvDialect'
import {fetchPortal} from 'providers/redux/reducers/fvPortal'
import {pushWindowPath} from 'providers/redux/reducers/windowPath'
import selectn from "selectn";
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import useRoute from 'DataSource/useRoute'

/**
 * @summary DetailSongData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DetailSongData({children, docId, docState}) {
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
DetailSongData.propTypes = {
  docId: string,
  docState: string,
  computeBook: object,
  fetchBook: func,
  fetchDialect2: func,
  pushWindowPath: func,
}

export default DetailSongData
