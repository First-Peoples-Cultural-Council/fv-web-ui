import React from 'react'
import PropTypes from 'prop-types'
import Preview from 'views/components/Editor/Preview'
import { DetailSongStoryStyles } from './DetailSongStoryStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DOMPurify from 'dompurify'
import MediaPanels from 'components/MediaPanels'
import Divider from '@material-ui/core/Divider'

/**
 * @summary DetailSongStoryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailSongStoryPresentation({
  book,
  // Media
  audio,
  pictures,
  videos,
}) {
  const classes = DetailSongStoryStyles()
  // Audio
  const audioMapped = audio.map((audioDoc) => {
    return <Preview minimal key={audioDoc.uid} expandedValue={audioDoc.object} type="FVAudio" />
  })
  const audioElements = audioMapped && audioMapped.length !== 0 ? audioMapped : null

  const mediaPanels =
    videos.length > 0 || pictures.length > 0 ? (
      <Grid key={'media-' + book.uid} item xs={4}>
        <div className={classes.media}>
          <MediaPanels.Presentation pictures={pictures} videos={videos} />
        </div>
      </Grid>
    ) : null

  // Main component
  return (
    <div className={classes.base}>
      <Grid key={book.uid} container className={classes.gridRoot} spacing={2}>
        <Grid container spacing={2}>
          {mediaPanels}
          <Grid key={'text-' + book.uid} item xs={8}>
            <div className={classes.title}>
              <Typography variant="h4" component="h3">
                <div>{book.title}</div>
              </Typography>
              <Typography variant="h5" component="h4">
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
              <div className={classes.media}>{audioElements}</div>
            </div>
            {_getIntroduction(book.introduction)}
            {_getIntroductionTranslation(book.introductionTranslation)}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

function _getIntroduction(introduction) {
  const classes = DetailSongStoryStyles()
  return introduction.content ? (
    <div className={classes.introduction}>
      <Typography variant="h6">
        <div>
          <b>Introduction</b>
        </div>
      </Typography>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(introduction.content),
        }}
      />
    </div>
  ) : null
}

function _getIntroductionTranslation(introductionTranslation) {
  const classes = DetailSongStoryStyles()
  return introductionTranslation.content ? (
    <div>
      <Divider variant="middle" />
      <div className={classes.introduction}>
        <Typography variant="h6">
          <div>
            <b>Introduction Translation</b>
          </div>
        </Typography>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(introductionTranslation.content),
          }}
        />
      </div>
    </div>
  ) : null
}

// PROPTYPES
const { array, string, object, number } = PropTypes
DetailSongStoryPresentation.propTypes = {
  book: object.isRequired,
  defaultLanguage: string,
  intl: object,
  pageCount: number,
  // Media
  audio: array.isRequired,
  pictures: array.isRequired,
  videos: array.isRequired,
}

export default DetailSongStoryPresentation
