import React from 'react'

// FPCC
import SongStoryPresentation from 'components/SongStory/SongStoryPresentation'
import SongStoryData from 'components/SongStory/SongStoryData'

import PromiseWrapper from 'components/PromiseWrapper'
import withActions from 'components/withActions'
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * @summary SongStoryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongStoryContainer() {
  return (
    <SongStoryData>
      {({
        bookPath,
        book,
        bookEntries,
        bookOpen,
        closeBookAction,
        computeBook,
        computeEntities,
        computeLogin,
        defaultLanguage,
        deleteBook,
        dialect,
        intl,
        isKidsTheme,
        openBookAction,
        pageCount,
        publishBook,
        pushWindowPath,
        routeParams,
        splitWindowPath,
        //Media
        audio,
        pictures,
        videos,
      }) => {
        return isKidsTheme ? (
          <SongStoryPresentation
            book={book}
            bookEntries={bookEntries}
            bookOpen={bookOpen}
            closeBookAction={closeBookAction}
            defaultLanguage={defaultLanguage}
            intl={intl}
            openBookAction={openBookAction}
            pageCount={pageCount}
            //Media
            audio={audio}
            pictures={pictures}
            videos={videos}
          />
        ) : (
          <DetailsViewWithActions
            labels={{ single: 'Book' }}
            itemPath={bookPath}
            actions={['workflow', 'edit', 'visibility', 'publish', 'add-child']}
            publishAction={publishBook}
            deleteAction={deleteBook}
            onNavigateRequest={pushWindowPath}
            computeItem={computeBook}
            permissionEntry={dialect}
            computeEntities={computeEntities}
            computeLogin={computeLogin}
            routeParams={routeParams}
            splitWindowPath={splitWindowPath}
            tabsData={{ photos: pictures, videos, audio }}
          >
            <SongStoryPresentation
              book={book}
              bookEntries={bookEntries}
              bookOpen={bookOpen}
              computeEntities={computeEntities}
              closeBookAction={closeBookAction}
              defaultLanguage={defaultLanguage}
              intl={intl}
              openBookAction={openBookAction}
              pageCount={pageCount}
              //Media
              audio={audio}
              pictures={pictures}
              videos={videos}
            />
          </DetailsViewWithActions>
        )
      }}
    </SongStoryData>
  )
}

export default SongStoryContainer
