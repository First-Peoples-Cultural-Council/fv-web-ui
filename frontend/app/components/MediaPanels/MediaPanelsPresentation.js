import React, { useState } from 'react'
import PropTypes from 'prop-types'

// Material-UI
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

//FPCC
import MediaPanel from 'views/pages/LearnBase/media-panel'
import { MediaPanelsStyles } from './MediaPanelsStyles'

/**
 * @summary MediaPanelsPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function MediaPanelsPresentation({ pictures, videos }) {
  function _getMediaPanels() {
    const [tabValue, setTabValue] = useState(0)
    const pictureMediaPanel = <MediaPanel minimal label="" type="FVPicture" items={pictures} />
    const videoMediaPanel = <MediaPanel minimal label="" type="FVVideo" items={videos} />

    if (pictures.length > 0 && videos.length > 0) {
      return (
        <Paper>
          <MediaTab
            tabItems={[{ label: 'Picture(s)' }, { label: 'Video(s)' }]}
            tabsValue={tabValue}
            tabsOnChange={(e, value) => setTabValue(value)}
          />
          {tabValue === 0 && pictureMediaPanel}
          {tabValue === 1 && videoMediaPanel}
        </Paper>
      )
    } else if (pictures.length > 0) {
      return <div>{pictureMediaPanel}</div>
    } else if (videos.length > 0) {
      return <div>{videoMediaPanel}</div>
    }
    return null
  }

  return _getMediaPanels()
}

function MediaTab(props) {
  const { tabsValue, tabsOnChange, tabItems } = props
  const classes = MediaPanelsStyles()
  const _tabItems = tabItems.map((item, i) => {
    const { label, id, dataTestId, className } = item
    return (
      <Tab
        key={i}
        label={label}
        id={id}
        data-testid={dataTestId}
        className={className}
        classes={{ root: classes.tabRoot, selected: classes.tabSelected, labelIcon: classes.label }}
      />
    )
  })

  return (
    <Tabs
      value={tabsValue}
      onChange={tabsOnChange}
      classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
    >
      {_tabItems}
    </Tabs>
  )
}
// PROPTYPES
const { array } = PropTypes
MediaPanelsPresentation.propTypes = {
  pictures: array,
  videos: array,
}

export default MediaPanelsPresentation
