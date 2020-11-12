import React from 'react'
import PropTypes from 'prop-types'

//FPCC
import SongStoryCover from 'components/SongStoryCover'
import SongStoryPages from 'components/SongStoryPages'
import PromiseWrapper from 'components/PromiseWrapper'

/**
 * @summary SongStoryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongStoryPresentation({
  book,
  bookEntries,
  bookOpen,
  closeBookAction,
  computeEntities,
  defaultLanguage,
  intl,
  openBookAction,
  pageCount,
  // Media
  audio,
  pictures,
  videos,
}) {
  //   const classes = SongStoryStyles()

  return (
    <div className="row" style={{ marginBottom: '20px' }}>
      <div className="col-xs-12">
        {!bookOpen && book.uid ? (
          <PromiseWrapper computeEntities={computeEntities}>
            <SongStoryCover.Presentation
              book={book}
              defaultLanguage={defaultLanguage}
              intl={intl}
              openBookAction={openBookAction}
              pageCount={pageCount}
              //Media
              audio={audio}
              pictures={pictures}
              videos={videos}
            />
          </PromiseWrapper>
        ) : (
          <PromiseWrapper computeEntities={computeEntities}>
            {bookEntries && bookEntries.length !== 0 ? (
              <SongStoryPages.Container
                bookEntries={bookEntries}
                closeBookAction={closeBookAction}
                defaultLanguage={defaultLanguage}
              />
            ) : null}
          </PromiseWrapper>
        )}
      </div>
    </div>
  )
}
// PROPTYPES
const { array, bool, func, number, object, string } = PropTypes
SongStoryPresentation.propTypes = {
  book: object,
  bookEntries: array,
  bookOpen: bool,
  closeBookAction: func,
  computeEntities: object.isRequired,
  defaultLanguage: string,
  fetchListViewData: func,
  intl: object,
  metadata: object,
  openBookAction: func,
  pageCount: number,
  // Media
  audio: array,
  pictures: array.isRequired,
  videos: array,
}

export default SongStoryPresentation
