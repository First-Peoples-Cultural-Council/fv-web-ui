import React from 'react'
import PropTypes from 'prop-types'
import DetailSongStoryPresentation
  from 'components/DetailSongStory/DetailSongStoryPresentation'
import DetailSongStoryData from 'components/DetailSongStory/DetailSongStoryData'

/**
 * @summary DetailSongStoryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailSongStoryContainer({
  docId,
  docState,
  computeBook,
  computeDialect2,
  fetchBook,
  fetchDialect2,
  pushWindowPath,
}) {
  return (
      <DetailSongStoryData
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
          return <DetailSongStoryPresentation
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
      </DetailSongStoryData>
  )
}

// PROPTYPES
const {string, object, func} = PropTypes
DetailSongStoryContainer.propTypes = {
  docId: string,
  docState: string,
  computeBook: object,
  fetchBook: func,
  fetchDialect2: func,
  pushWindowPath: func,
}

export default DetailSongStoryContainer
