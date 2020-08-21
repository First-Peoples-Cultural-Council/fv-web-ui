import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'

//FPCC
// import { StoryStyles } from './StoryStyles'
import StoryCover from 'components/StoryCover'
import StoryPage from 'components/StoryPage'

/**
 * @summary StoryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPresentation({
  book,
  bookEntries,
  bookOpen,
  closeBookAction,
  openBookAction,
  pageCount,
  // Media
  audio,
  images,
  videos,
}) {
  //   const classes = StoryStyles()

  return (
    <div className="row" style={{ marginBottom: '20px' }}>
      <div className="col-xs-12">
        <Paper>
          {!bookOpen ? (
            <StoryCover.Presentation
              book={book}
              openBookAction={openBookAction}
              pageCount={pageCount}
              //Media
              audio={audio}
              images={images}
              videos={videos}
            />
          ) : (
            <StoryPage.Presentation
              book={book}
              bookEntries={bookEntries}
              closeBookAction={closeBookAction}
              //Media
              audio={audio}
              images={images}
              videos={videos}
            />
          )}
        </Paper>
      </div>
    </div>
  )
}
// PROPTYPES
const { array, bool, func, object } = PropTypes
StoryPresentation.propTypes = {
  book: object,
  bookEntries: array,
  bookOpen: bool,
  openBookAction: func,
}

export default StoryPresentation
