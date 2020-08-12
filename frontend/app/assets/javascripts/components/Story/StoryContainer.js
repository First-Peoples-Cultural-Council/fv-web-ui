import React from 'react'
// import PropTypes from 'prop-types'

// FPCC
import StoryPresentation from 'components/Story/StoryPresentation'
import StoryData from 'components/Story/StoryData'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import withActions from 'views/hoc/view/with-actions'

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
  const DetailsViewWithActions = withActions(PromiseWrapper, true)
  return (
    <StoryData>
      {({
        bookPath,
        book,
        bookEntries,
        computeEntities,
        dialect,
        deleteBook,
        isKidsTheme,
        publishBook,
        pushWindowPath,
      }) => {
        return isKidsTheme ? (
          <StoryPresentation bookEntries={bookEntries} />
        ) : (
          <DetailsViewWithActions
            labels={{ single: 'Book' }}
            itemPath={bookPath}
            actions={['workflow', 'edit', 'visibility', 'publish', 'add-child']}
            publishAction={publishBook}
            deleteAction={deleteBook}
            onNavigateRequest={pushWindowPath}
            computeItem={book}
            permissionEntry={dialect}
            computeEntities={computeEntities}
          >
            <StoryPresentation bookEntries={bookEntries} />
          </DetailsViewWithActions>
        )
      }}
    </StoryData>
  )
}
// PROPTYPES
// const { object } = PropTypes
StoryContainer.propTypes = {
  //   something: object,
}

export default StoryContainer
