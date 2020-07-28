import React from 'react'
// import PropTypes from 'prop-types'
import ActivityStreamPresentation from 'components/ActivityStream/ActivityStreamPresentation'
import ActivityStreamData from 'components/ActivityStream/ActivityStreamData'

/**
 * @summary ActivityStreamContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ActivityStreamContainer() {
  return (
    <ActivityStreamData>
      {(ActivityStreamDataOutput) => {
        // TODO FW-ActivityStream
        // eslint-disable-next-line
        console.log('ActivityStreamDataOutput', ActivityStreamDataOutput)
        return <ActivityStreamPresentation />
      }}
    </ActivityStreamData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ActivityStreamContainer.propTypes = {
  //   something: string,
}

export default ActivityStreamContainer
