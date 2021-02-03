import React from 'react'
// import PropTypes from 'prop-types'
import TopicsPresentation from 'components/Topics/TopicsPresentation'
import TopicsData from 'components/Topics/TopicsData'

/**
 * @summary TopicsContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsContainer() {
  return (
    <TopicsData>
      {({ topics }) => {
        return <TopicsPresentation topics={topics} />
      }}
    </TopicsData>
  )
}
// PROPTYPES
// const { string } = PropTypes
TopicsContainer.propTypes = {
  //   something: string,
}

export default TopicsContainer
