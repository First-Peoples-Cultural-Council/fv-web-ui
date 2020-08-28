import React from 'react'

// FPCC
import StoryPresentation from 'components/Story/StoryPresentation'
import StoryData from 'components/Story/StoryData'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import withActions from 'views/hoc/view/with-actions'
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * @summary StoryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryContainer() {
  return (
    <StoryData>
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
          <StoryPresentation
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
            <StoryPresentation
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
    </StoryData>
  )
}

export default StoryContainer
