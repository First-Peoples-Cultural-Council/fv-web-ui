import React from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'

import Grid from '@material-ui/core/Grid'

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

    return (
      <Grid key={page.uid} container className={classes.root} spacing={2}>
        <Grid container justify="center" spacing={2}>
          <Grid key={page.uid + 0} item xs={3}>
            <div className={classes.media}>
              <MediaPanels.Presentation videos={page.videos} images={page.images} />
            </div>
          </Grid>
          <Grid key={page.uid + 2} item xs={3}>
            <div className={classes.textLanguage}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.title) }} />
              {audio}
            </div>
          </Grid>
          <Grid key={page.uid + 3} item xs={3}>
            <div className={classes.textTranslation}>
              {' '}
              <strong>
                <FVLabel transKey="literal_translation" defaultStr="Literal Translation" transform="first" />
              </strong>{' '}
              : <span>{page.literalTranslation}</span>
            </div>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <div>
      {bookPages.map(function createPageElements(page, index) {
        return <StoryPage key={index} page={page} />
      })}
      <FVButton variant="contained" key="close" onClick={closeBookAction}>
        <FVLabel
          transKey="views.pages.explore.dialect.learn.songs_stories.close_book"
          defaultStr="Close Book"
          transform="first"
        />
      </FVButton>
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
