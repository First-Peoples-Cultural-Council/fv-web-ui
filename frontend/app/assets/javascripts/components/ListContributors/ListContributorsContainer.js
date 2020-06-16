import React from 'react'
// import PropTypes from 'prop-types'
import ListContributorsPresentation from './ListContributorsPresentation'
import ListContributorsData from './ListContributorsData'

/**
 * @summary ListContributorsContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListContributorsContainer() {
  return (
    <ListContributorsData>
      {(ListContributorsDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListContributorsDataOutput', ListContributorsDataOutput)
        return <ListContributorsPresentation />
      }}
    </ListContributorsData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListContributorsContainer.propTypes = {
  //   something: string,
}

export default ListContributorsContainer
