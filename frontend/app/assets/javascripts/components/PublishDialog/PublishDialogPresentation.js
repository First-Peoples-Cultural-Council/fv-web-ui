import React, { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// Material-UI
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

// FPCC
import { PublishDialogStyles } from './PublishDialogStyles'
import NavigationHelpers from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
/**
 * @summary PublishDialogPresentation - ScrollableTabsButtonAuto MUI component with additions/modifications
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {object} intl Service for use with locale label translation
 * @param {object} data expects an object containing data for each tab i.e. data = { phrases: [], photos: [], videos: [], audio: [] }
 * @param {string} siteTheme
 * @param {func} pushWindowPath
 *
 * @returns {node} jsx markup
 */

function PublishDialogPresentation({ intl, data, siteTheme, pushWindowPath }) {
  const classes = PublishDialogStyles()
  const [value, setValue] = useState(0)
  const relatedElements = generateElements(data)
  const tabs = generateTabs(relatedElements)
  const tabPanels = generateTabPanels(relatedElements, value)

  // React.useEffect(() => {}, [value, tabs, tabPanels]);  { phrases: phrasesData, photos: photosData, videos: videoData, audio: audioData }

  function generateElements({ phrases: phrasesData, photos: photosData, videos: videoData, audio: audioData }) {
    const elementArray = []
    // Photos
    const photosThumbnails = photosData.map((picture) => {
      return (
        <img
          key={picture.uid}
          src={selectn('views[0].url', picture) || 'assets/images/cover.png'}
          alt={selectn('title', picture)}
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })
    if (photosThumbnails.length > 0) {
      elementArray.push({
        key: 'pictures',
        label: intl.trans('pictures', 'Pictures', 'first'),
        content: photosThumbnails,
      })
    }
    // Videos
    const videoThumbnails = videoData.map((video) => {
      return (
        <video
          key={video.uid}
          src={NavigationHelpers.getBaseURL() + video.path}
          controls
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })
    if (videoThumbnails.length > 0) {
      elementArray.push({
        key: 'videos',
        label: intl.trans('videos', 'Videos', 'first'),
        content: videoThumbnails,
      })
    }
    // Audio
    const audioPreviews = audioData.map((_audio) => {
      return <Preview key={selectn('uid', _audio)} expandedValue={_audio} minimal type="FVAudio" />
    })
    if (audioPreviews.length > 0) {
      elementArray.push({ key: 'videos', label: intl.trans('audio', 'Audio', 'first'), content: audioPreviews })
    }
    // Phrases
    const _phrases = phrasesData
      ? phrasesData.map((phrase, key) => {
          const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, phrase, 'phrases')
          return (
            <p key={key}>
              <a
                key={selectn('uid', phrase)}
                href={hrefPath}
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, pushWindowPath, false)
                }}
              >
                {selectn('dc:title', phrase)}
              </a>
            </p>
          )
        })
      : []
    if (_phrases.length > 0) {
      elementArray.push({ key: 'phrases', label: intl.trans('phrases', 'Phrases', 'first'), content: _phrases })
    }

    return elementArray
  }

  function generateTabPanels(elementArray, tabPanelValue) {
    const panels = []
    function iterate(item, index) {
      panels.push(
        <TabPanel key={item.label + index} value={tabPanelValue} index={index}>
          {item.content}
        </TabPanel>
      )
    }
    elementArray.forEach(iterate)
    return panels
  }

  function generateTabs(elementArray) {
    const _tabs = []
    function iterate(item, index) {
      _tabs.push(<Tab key={item.label} label={item.label} {...a11yProps(index)} />)
    }
    elementArray.forEach(iterate)
    return _tabs
  }

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabs}
        </Tabs>
      </AppBar>
      {tabPanels}
    </div>
  )
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

// PROPTYPES
const { node, any } = PropTypes
TabPanel.propTypes = {
  children: node,
  index: any.isRequired,
  value: any.isRequired,
}

// PROPTYPES
const { func, object, string } = PropTypes
PublishDialogPresentation.propTypes = {
  intl: object,
  data: object,
  siteTheme: string,
  pushWindowPath: func,
}

export default PublishDialogPresentation
