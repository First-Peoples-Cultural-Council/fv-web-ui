import React, { useState } from 'react'
import PropTypes from 'prop-types'

//FPCC
import FVTab from 'views/components/FVTab'
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel'

/**
 * @summary MediaPanelsPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function MediaPanelsPresentation({ images, videos }) {
  //   const classes = MediaPanelsStyles()
  function _getMediaPanels() {
    const [tabValue, setTabValue] = useState(0)
    const imageMediaPanel = <MediaPanel minimal label="" type="FVPicture" items={images} />
    const videoMediaPanel = <MediaPanel minimal label="" type="FVVideo" items={videos} />

    if (images.length > 0 && videos.length > 0) {
      return (
        <div>
          <FVTab
            tabItems={[{ label: 'Photo(s)' }, { label: 'Video(s)' }]}
            tabsValue={tabValue}
            tabsOnChange={(e, value) => setTabValue(value)}
          />
          {tabValue === 0 && imageMediaPanel}
          {tabValue === 1 && videoMediaPanel}
        </div>
      )
    } else if (images.length > 0) {
      return <div>{imageMediaPanel}</div>
    } else if (videos.length > 0) {
      return <div>{videoMediaPanel}</div>
    }
    return null
  }

  return _getMediaPanels()
}
// PROPTYPES
const { array } = PropTypes
MediaPanelsPresentation.propTypes = {
  images: array,
  videos: array,
}

export default MediaPanelsPresentation
