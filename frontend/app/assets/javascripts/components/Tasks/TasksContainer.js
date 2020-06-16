import React from 'react'
// import PropTypes from 'prop-types'
import TasksPresentation from './TasksPresentation'
import TasksData from './TasksData'

/**
 * @summary TasksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TasksContainer() {
  return (
    <TasksData>
      {(TasksDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('TasksDataOutput', TasksDataOutput)
        return <TasksPresentation />
      }}
    </TasksData>
  )
}
// PROPTYPES
// const { string } = PropTypes
TasksContainer.propTypes = {
  //   something: string,
}

export default TasksContainer
