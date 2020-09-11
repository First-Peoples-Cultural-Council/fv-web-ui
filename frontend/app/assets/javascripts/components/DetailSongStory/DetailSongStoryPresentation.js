import React from 'react'
import PropTypes from 'prop-types'
import Preview from 'views/components/Editor/Preview'
import { SongStoryCoverStyles } from '../SongStoryCover/SongStoryCoverStyles'
import '!style-loader!css-loader!./DetailSongStory.css'
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
  const classes = SongStoryCoverStyles()
  // Audio
  const audioMapped = audio.map((audioDoc) => {
    return <Preview minimal key={audioDoc.uid} expandedValue={audioDoc.object} type="FVAudio" />
  })
  const audioElements = audioMapped && audioMapped.length !== 0 ? audioMapped : null

  let mediaPanels = null
  if (pictures.length > 0) {
    mediaPanels = (
      <Grid key={'media-' + book.uid} item xs={2}>
        <div className={classes.media}>
          <MediaPanels.Presentation pictures={pictures} videos={[]} />
        </div>
      </Grid>
    )
  } else if (videos.length > 0) {
    mediaPanels = (
      <Grid key={'media-' + book.uid} item xs={2}>
        <div className={classes.media}>
          <MediaPanels.Presentation pictures={[]} videos={videos} />
        </div>
      </Grid>
    )
  }

  // Main component
  return (
    <div className="DetailSongStory">
      <Grid key={book.uid} container className={classes.gridRoot} spacing={2}>
        <Grid container justify="center" spacing={2}>
          {mediaPanels}
          <Grid key={'text-' + book.uid} item xs={5}>
            <div className="DetailSongStory__header">
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
            </div>
            <div className="DetailSongStory__audioPlayer">{audioElements}</div>
            <div>{_getIntroduction(book.introduction, book.introductionTranslation)}</div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

function _getIntroduction(introduction, introductionTranslation) {
  const introductionDiv = (
    <div className="DetailSongStory__introduction">
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
  )

  const translationDiv = introductionTranslation.content ? (
    <div className="DetailSongStory__translation">
      <Typography variant="h6">
        <div>
          <b>Translation</b>
        </div>
      </Typography>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(introductionTranslation.content),
        }}
      />
    </div>
  ) : null

  const displayDivider = introductionTranslation.content ? <Divider variant="middle" /> : null

  if (!introductionTranslation.content) {
    if (!introduction.content) {
      return null
    }
  }

  return (
    <div>
      {introductionDiv}
      {displayDivider}
      {translationDiv}
    </div>
  )
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
