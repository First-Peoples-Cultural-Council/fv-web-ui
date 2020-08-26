import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'

//FPCC
import StoryCover from 'components/StoryCover'
import StoryPages from 'components/StoryPages'

import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel'
import withPagination from 'views/hoc/grid-list/with-pagination'

const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 1 }
const StoryPagesWithPagination = withPagination(StoryPages, DefaultFetcherParams.pageSize, 100)

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
  defaultLanguage,
  fetchListViewData,
  intl,
  metadata,
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
          <Paper style={{ padding: '15px', margin: '15px 0' }}>
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
          </Paper>
        ) : (
          <Paper style={{ padding: '15px', margin: '15px 0', minHeight: '420px', overflowX: 'auto' }}>
            <StoryPagesWithPagination
              style={{ overflowY: 'auto', maxHeight: '50vh' }}
              cols={5}
              cellHeight={150}
              disablePageSize
              defaultLanguage={defaultLanguage}
              fetcher={fetchListViewData}
              fetcherParams={DefaultFetcherParams}
              metadata={metadata || {}}
              items={bookEntries || []}
              appendControls={[
                bookOpen ? (
                  <FVButton variant="contained" key="close" onClick={closeBookAction}>
                    <FVLabel
                      transKey="views.pages.explore.dialect.learn.songs_stories.close_book"
                      defaultStr="Close Book"
                      transform="first"
                    />
                  </FVButton>
                ) : (
                  ''
                ),
              ]}
            />
          </Paper>
        )}
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
