import React from 'react'
// import PropTypes from 'prop-types'
import DetailStoryPresentation from 'components/DetailStory/DetailStoryPresentation'
import DetailStoryData from 'components/DetailStory/DetailStoryData'

/**
 * @summary DetailStoryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailStoryContainer() {
  return (
    <DetailStoryData>
      {({ content }) => {
        return <DetailStoryPresentation content={content} />
      }}
    </DetailStoryData>
  )
}
// PROPTYPES
// const { object } = PropTypes
DetailStoryContainer.propTypes = {
  //   something: object,
}

export default DetailStoryContainer
