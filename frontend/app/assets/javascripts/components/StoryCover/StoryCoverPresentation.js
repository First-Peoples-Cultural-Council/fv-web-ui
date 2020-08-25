import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'

import Typography from '@material-ui/core/Typography'
import ActionLaunch from '@material-ui/icons/Launch'

import { StoryCoverStyles } from './StoryCoverStyles'
import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel/index'
import FVTab from 'views/components/FVTab'
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel'
import Preview from 'views/components/Editor/Preview'
/**
 * @summary StoryCoverPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryCoverPresentation({
  book,
  openBookAction,
  pageCount,
  // Media
  audio,
  images,
  videos,
}) {
  const classes = StoryCoverStyles()
  // Audio
  const audioElements = audio.map((audioDoc) => {
    return <Preview minimal key={audioDoc.id} expandedValue={audioDoc.object} type="FVAudio" />
  })

  // Main component
  return (
    <div className="row">
      <div className="col-xs-12">
        {_getMediaPanels(images, videos)}
        <div className="col-xs-12 col-md-9 fontBCSans">
          <header className={classes.header}>
            <Typography variant="h3" component="h2">
              <div>{book.title}</div>
            </Typography>
            <Typography variant="h4" component="h3">
              <div>{book.titleTranslation}</div>
            </Typography>
            <div className="subheader">
              {book.authors.map(function renderAuthors(author, i) {
                return (
                  <span className="label label-default" key={i}>
                    {author}
                  </span>
                )
              })}
            </div>
          </header>

          <div className={classes.introductionTranslations}>
            {_getIntroduction(book.introduction, book.introductionTranslation)}
            {audioElements}
          </div>
        </div>
      </div>

      <div className="col-xs-12">
        <div className="col-xs-12 text-right">
          {openBookAction && pageCount > 0 ? (
            <FVButton variant="contained" style={{ marginRight: '10px' }} color="primary" onClick={openBookAction}>
              <ActionLaunch />
              {'Open Book'}
            </FVButton>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

function _getMediaPanels(imageData, videoData) {
  const [tabValue, setTabValue] = useState(0)
  const imageMediaPanel = <MediaPanel minimal label="" type="FVPicture" items={imageData} />
  const videoMediaPanel = <MediaPanel minimal label="" type="FVVideo" items={videoData} />

  if (imageData.length > 0 && videoData.length > 0) {
    return (
      <div className="col-xs-12 col-md-3">
        <FVTab
          tabItems={[{ label: 'Photo(s)' }, { label: 'Video(s)' }]}
          tabsValue={tabValue}
          tabsOnChange={(e, value) => setTabValue(value)}
        />
        {tabValue === 0 && imageMediaPanel}
        {tabValue === 1 && videoMediaPanel}
      </div>
    )
  } else if (imageData.length > 0) {
    return imageMediaPanel
  } else if (videoData.length > 0) {
    return videoMediaPanel
  }
  return null
}

function _getIntroduction(introduction, introductionTranslation) {
  const [tabValue, setTabValue] = useState(0)
  const introductionDiv = (
    <div className="IntroductionContent">
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introduction.content) }} />
    </div>
  )

  if (!introductionTranslation.content) {
    if (!introduction.content) {
      return null
    }

    return (
      <div className="IntroductionTranslations">
        <div>
          <h1 className="IntroductionTitle">
            <FVLabel transKey="introduction" defaultStr="Introduction" transform="first" />
          </h1>
        </div>
        {introductionDiv}
      </div>
    )
  }

  return (
    <div>
      <FVTab
        tabItems={[{ label: introduction.label }, { label: introductionTranslation.label }]}
        tabsValue={tabValue}
        tabsOnChange={(e, value) => setTabValue(value)}
      />

      {tabValue === 0 && (
        <Typography variant="h5" component="div" style={{ padding: 8 * 3 }}>
          {introductionDiv}
        </Typography>
      )}
      {tabValue === 1 && (
        <Typography variant="h5" component="div" style={{ padding: 8 * 3 }}>
          <div className="IntroductionContent">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introductionTranslation.content) }} />
          </div>
        </Typography>
      )}
    </div>
  )
}
// PROPTYPES
const { array, func, number, object, string } = PropTypes
StoryCoverPresentation.propTypes = {
  book: object.isRequired,
  defaultLanguage: string,
  intl: object,
  openBookAction: func,
  pageCount: number,
  // Media
  audio: array.isRequired,
  images: array.isRequired,
  videos: array.isRequired,
}

export default StoryCoverPresentation
