import React from 'react'
import PropTypes from 'prop-types'
import sanitize from 'common/Sanitize'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import MediaPanels from 'components/MediaPanels'
import Preview from 'components/Preview'

import { SongStoryPagesStyles } from './SongStoryPagesStyles'

/**
 * @summary SongStoryPagesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} bookPages an array of the bookEntries reformatted by SongStoryPagesData for consumption by this layer
 *
 * @returns {node} jsx markup
 */
function SongStoryPagesPresentation({ bookPages, closeBookAction }) {
  function getPages() {
    const classes = SongStoryPagesStyles()
    const pageLinks = []
    const pages = []
    bookPages.forEach(createPage)
    function createPage(page, index) {
      const pageLinkId = 'page_' + (index + 1)
      pageLinks.push(
        <div key={'page-link' + page.uid} className={classes.pageLink}>
          <a href={'#' + pageLinkId}>Page {index + 1}</a>
        </div>
      )
      pages.push(<SongStoryPage key={page.uid} page={page} pageLinkId={pageLinkId} pageNumber={index + 1} />)
    }
    return (
      <div>
        <div className={classes.pageLinks}>{pageLinks}</div>
        {pages}
      </div>
    )
  }

  const pagesElements = getPages()

  return (
    <div>
      {pagesElements}
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

const SongStoryPage = ({ page, pageNumber, pageLinkId }) => {
  const classes = SongStoryPagesStyles()
  // Audio
  const audio = page.audio.map((audioDoc) => {
    return <Preview minimal key={audioDoc.uid} expandedValue={audioDoc.object} type="FVAudio" />
  })
  const audioElements = audio && audio.length !== 0 ? audio : null

  const literalTranslation = page.literalTranslation ? (
    <div className={classes.literalTranslation}>
      {page.literalTranslation !== ''}{' '}
      <em>
        <FVLabel transKey="literal_translation" defaultStr="Literal Translation" transform="first" />
      </em>{' '}
      : <span dangerouslySetInnerHTML={{ __html: sanitize(page.literalTranslation) }} />
    </div>
  ) : null

  const translationPanel =
    page.literalTranslation || page.dominantLanguageText ? (
      <Grid key={page.uid + 3} item xs={4} className={classes.translation}>
        <div className={classes.dominantTranslation}>
          <div dangerouslySetInnerHTML={{ __html: sanitize(page.dominantLanguageText) }} />
          {literalTranslation}
        </div>
      </Grid>
    ) : null

  const mediaPanels =
    page.videos.length > 0 || page.pictures.length > 0 ? (
      <Grid key={page.uid + 1} item xs={4}>
        <div className={classes.media}>
          <MediaPanels.Presentation videos={page.videos} pictures={page.pictures} />
        </div>
      </Grid>
    ) : null

  return (
    <Paper elevation={3} className={classes.page}>
      <div id={pageLinkId} className={classes.pageNumber}>
        {' '}
        Page {pageNumber}
      </div>
      <Grid key={page.uid + 0} container className={classes.gridRoot} spacing={2}>
        <Grid container justify="center" spacing={2}>
          {mediaPanels}
          <Grid key={page.uid + 2} item xs={4}>
            <div className={classes.textLanguage}>
              <div dangerouslySetInnerHTML={{ __html: sanitize(page.title) }} />
              {audioElements}
            </div>
          </Grid>
          {translationPanel}
        </Grid>
      </Grid>
    </Paper>
  )
}
// PROPTYPES
const { object, number, string, array, func } = PropTypes
SongStoryPage.propTypes = {
  page: object,
  pageNumber: number,
  pageLinkId: string,
}
SongStoryPagesPresentation.propTypes = {
  bookPages: array,
  closeBookAction: func,
}
SongStoryPagesPresentation.propTypes = {
  bookPages: array,
  closeBookAction: func,
}

export default SongStoryPagesPresentation
