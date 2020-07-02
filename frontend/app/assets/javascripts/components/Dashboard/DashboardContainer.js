import React from 'react'
import DashboardData from './DashboardData'
import DashboardPresentation from './DashboardPresentation'
import WidgetTasks from 'components/WidgetTasks'

/**
 * @summary DashboardContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardContainer() {
  return (
    <DashboardData>
      {(DashboardDataOutput) => {
        // TODO DashboardData somehow outputs widgets to display
        // eslint-disable-next-line
        console.log('DashboardDataOutput', DashboardDataOutput)
        return (
          <DashboardPresentation>
            <WidgetTasks.Container />
          </DashboardPresentation>
        )
      }}
    </DashboardData>
  )
}
// PROPTYPES
// const { string } = PropTypes
DashboardContainer.propTypes = {
  //   something: string,
}

export default DashboardContainer
