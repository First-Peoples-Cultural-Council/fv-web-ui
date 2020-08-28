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
  images,
  videos,
}) {
  //   const classes = StoryStyles()

  return (
    <div className="row" style={{ marginBottom: '20px' }}>
      <div className="col-xs-12">
        {!bookOpen ? (
          <StoryCover.Presentation
            book={book}
            defaultLanguage={defaultLanguage}
            intl={intl}
            openBookAction={openBookAction}
            pageCount={pageCount}
            //Media
            audio={audio}
            images={images}
            videos={videos}
          />
        ) : (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            {bookEntries && bookEntries.length !== 0 ? (
              <StoryPages.Container
                bookEntries={bookEntries}
                closeBookAction={closeBookAction}
                defaultLanguage={defaultLanguage}
              />
            ) : (
              <div>No results</div>
            )}
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
  images: array,
  videos: array,
}

export default StoryPresentation
