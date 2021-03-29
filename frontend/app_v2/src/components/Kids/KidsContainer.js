import React from 'react'
// import PropTypes from 'prop-types'
import KidsPresentation from 'components/Kids/KidsPresentation'
import KidsData from 'components/Kids/KidsData'

/**
 * @summary KidsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function KidsContainer() {
  return (
    <KidsData>
      {
        (/*KidsDataOutput*/) => {
          return (
            <KidsPresentation
              heading={<a href="#">Kids Test</a>}
              body={
                <>
                  <h2>This is a heading in the body</h2>
                  <p>Paragraph content here</p>
                </>
              }
            />
          )
        }
      }
    </KidsData>
  )
}
// PROPTYPES
// const { string } = PropTypes
KidsContainer.propTypes = {
  //   something: string,
}

export default KidsContainer
