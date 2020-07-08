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
      {() => {
        return (
          <DashboardPresentation>
            <WidgetTasks.Container />
          </DashboardPresentation>
        )
      }}
    </DashboardData>
  )
}

export default DashboardContainer
