import React from 'react'
import PropTypes from 'prop-types'

//FPCC
import StoryCover from 'components/StoryCover'
import StoryPages from 'components/StoryPages'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

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
  //   const classes = StoryStyles()

  return (
    <div className="row" style={{ marginBottom: '20px' }}>
      <div className="col-xs-12">
        {!bookOpen && book.uid ? (
          <PromiseWrapper computeEntities={computeEntities}>
            <StoryCover.Presentation
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
              <StoryPages.Container
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
StoryPresentation.propTypes = {
  book: object,
  bookEntries: array,
  bookOpen: bool,
  closeBookAction: func,
  computeEntities: object,
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

export default StoryPresentation
