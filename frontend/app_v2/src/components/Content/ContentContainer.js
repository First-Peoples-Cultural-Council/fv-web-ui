import React from 'react'
// import PropTypes from 'prop-types'
import ContentPresentation from 'components/Content/ContentPresentation'
import ContentData from 'components/Content/ContentData'

/**
 * @summary ContentContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContentContainer() {
  return (
    <ContentData>
      {
        (/*ContentDataOutput*/) => {
          return <ContentPresentation />
        }
      }
    </ContentData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ContentContainer.propTypes = {
  //   something: string,
}

export default ContentContainer
