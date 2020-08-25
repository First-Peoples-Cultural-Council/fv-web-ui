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
        {({
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
        }) => {
          return <DetailSongPresentation
              acknowledgement={acknowledgement}
              audio={audio}
              culturalNotes={culturalNotes}
              definitions={definitions}
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
// const { string } = PropTypes
DetailSongContainer.propTypes = {
  //   something: string,
}

export default DetailSongContainer
