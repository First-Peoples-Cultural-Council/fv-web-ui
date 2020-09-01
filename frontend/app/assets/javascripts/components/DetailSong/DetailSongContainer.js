import React from 'react'
import PropTypes from 'prop-types'
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
function DetailSongContainer({
  docId,
  docState,
  computeBook,
  computeDialect2,
  fetchBook,
  fetchDialect2,
  pushWindowPath,
}) {
  return (
      <DetailSongData
          docId={docId}
          docState={docState}
          computeBook={computeBook}
          computeDialect2={computeDialect2}
          fetchBook={fetchBook}
          fetchDialect2={fetchDialect2}
          pushWindowPath={pushWindowPath}
      >
        {({
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
        }) => {
          return <DetailSongPresentation
              acknowledgement={acknowledgement}
              audio={audio}
              culturalNotes={culturalNotes}
              dialectClassName={dialectClassName}
              literalTranslations={literalTranslations}
              metadata={metadata}
              photos={photos}
              relatedAssets={relatedAssets}
              relatedToAssets={relatedToAssets}
              title={title}
              videos={videos}
          />
        }}
      </DetailSongData>
  )
}

// PROPTYPES
const {string, object, func} = PropTypes
DetailSongContainer.propTypes = {
  docId: string,
  docState: string,
  computeBook: object,
  fetchBook: func,
  fetchDialect2: func,
  pushWindowPath: func,
}

export default DetailSongContainer
