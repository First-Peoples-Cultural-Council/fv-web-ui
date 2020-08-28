import React from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel'
import MediaPanels from 'components/MediaPanels'
import Preview from 'views/components/Editor/Preview'

import { StoryPagesStyles } from './StoryPagesStyles'
/**
 * @summary StoryPagesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} bookPages an array of the bookEntries reformatted by StoryPagesData for consumption by this layer
 *
 * @returns {node} jsx markup
 */
function StoryPagesPresentation({ bookPages, closeBookAction }) {
  const StoryPage = ({ page }) => {
    const classes = StoryPagesStyles()
    // Audio
    const audio = page.audio.map((audioDoc) => {
      return <Preview minimal key={audioDoc.uid} expandedValue={audioDoc} type="FVAudio" />
    })
    const literalTranslation =
      page.literalTranslation || page.dominantLanguageText ? (
        <Grid key={page.uid + 3} item xs={4} className={classes.translation}>
          <div className={classes.dominantTranslation}>
            <div>{page.dominantLanguageText}</div>
            <div className={classes.literalTranslation}>
              {page.literalTranslation !== ''}{' '}
              <strong>
                <FVLabel transKey="literal_translation" defaultStr="Literal Translation" transform="first" />
              </strong>{' '}
              : <span>{page.literalTranslation}</span>
            </div>
          </div>
        </Grid>
      ) : null

    return (
      <Paper elevation={3} style={{ padding: '30px', margin: '30px' }}>
        <Grid key={page.uid} container className={classes.root} spacing={2}>
          <Grid container justify="center" spacing={2}>
            <Grid key={page.uid + 0} item xs={4}>
              <div className={classes.media}>
                <MediaPanels.Presentation videos={page.videos} images={page.images} />
              </div>
            </Grid>
            <Grid key={page.uid + 2} item xs={4}>
              <div className={classes.textLanguage}>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.title) }} />
                {audio}
              </div>
            </Grid>
            {literalTranslation}
          </Grid>
        </Grid>
      </Paper>
    )
  }

  return (
    <div>
      {bookPages.map(function createPageElements(page, index) {
        return <StoryPage key={index} page={page} />
      })}

      <div className="col-xs-12">
        <div className="col-xs-12 text-right">
          {closeBookAction ? (
            <FVButton variant="contained" style={{ marginRight: '10px' }} key="close" onClick={closeBookAction}>
              <FVLabel
                transKey="views.pages.explore.dialect.learn.songs_stories.close_book"
                defaultStr="Close Book"
                transform="first"
              />
            </FVButton>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { array, func } = PropTypes
StoryPagesPresentation.propTypes = {
  bookPages: array,
  closeBookAction: func,
}

export default StoryPagesPresentation
