import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'

import Typography from '@material-ui/core/Typography'
import ActionLaunch from '@material-ui/icons/Launch'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { SongStoryCoverStyles } from './SongStoryCoverStyles'
import MediaPanels from 'components/MediaPanels'
import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel/index'
import FVTab from 'views/components/FVTab'
import Preview from 'views/components/Editor/Preview'
/**
 * @summary SongStoryCoverPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongStoryCoverPresentation({
  book,
  openBookAction,
  pageCount,
  // Media
  audio,
  pictures,
  videos,
}) {
  const classes = SongStoryCoverStyles()
  // Audio
  const audioMapped = audio.map((audioDoc) => {
    return <Preview minimal key={audioDoc.uid} expandedValue={audioDoc.object} type="FVAudio" />
  })
  const audioElements = audioMapped && audioMapped.length !== 0 ? audioMapped : null

  const mediaPanels =
    videos.length > 0 || pictures.length > 0 ? (
      <Grid key={'media-' + book.uid} item xs={5}>
        <div className={classes.media}>
          <MediaPanels.Presentation pictures={pictures} videos={videos} />
        </div>
      </Grid>
    ) : null

  // Main component
  return (
    <Paper elevation={3} className={classes.cover}>
      <Grid key={book.uid} container className={classes.gridRoot} spacing={2}>
        <Grid container justify="center" spacing={2}>
          {mediaPanels}
          <Grid key={'text-' + book.uid} item xs={5}>
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
            <div className={classes.introduction}>
              {_getIntroduction(book.introduction, book.introductionTranslation)}
              <div>{audioElements}</div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <div className="text-right">
          {openBookAction && pageCount > 0 ? (
            <FVButton variant="contained" style={{ marginRight: '10px' }} color="primary" onClick={openBookAction}>
              <ActionLaunch />
              {'Open Book'}
            </FVButton>
          ) : (
            ''
          )}
        </div>
      </Grid>
    </Paper>
  )
}

function _getIntroduction(introduction, introductionTranslation) {
  const classes = SongStoryCoverStyles()
  const [tabValue, setTabValue] = useState(0)
  const introductionDiv = (
    <div className={classes.introductionContent}>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introduction.content) }} />
    </div>
  )

  if (!introductionTranslation.content) {
    if (!introduction.content) {
      return null
    }

    return (
      <div className={classes.introductionTranslation}>
        <div>
          <h1 className={classes.introductionTitle}>
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
          <div className={classes.introductionContent}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introductionTranslation.content) }} />
          </div>
        </Typography>
      )}
    </div>
  )
}
// PROPTYPES
const { array, func, number, object, string } = PropTypes
SongStoryCoverPresentation.propTypes = {
  book: object.isRequired,
  defaultLanguage: string,
  intl: object,
  openBookAction: func,
  pageCount: number,
  // Media
  audio: array.isRequired,
  pictures: array.isRequired,
  videos: array.isRequired,
}

export default SongStoryCoverPresentation
