import React from 'react'
// import PropTypes from 'prop-types'
import DetailSongPresentation
  from 'components/DetailSong/DetailSongPresentation'
import DetailSongData from 'components/DetailSong/DetailSongData'

/**
 * @summary DetailSongContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailSongContainer() {
  return (
      <DetailSongData>
        {(DetailSongDataOutput) => {
          // TODO FW-DetailSong
          // eslint-disable-next-line
          console.log('DetailSongDataOutput', DetailSongDataOutput)
          return <DetailSongPresentation/>
        }}
      </DetailSongData>
  )
}

// PROPTYPES
// const { string } = PropTypes
DetailSongContainer.propTypes = {
  //   something: string,
}

export default DetailSongContainer
