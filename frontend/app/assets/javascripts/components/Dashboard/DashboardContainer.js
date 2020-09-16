import React from 'react'
import DashboardData from './DashboardData'
import DashboardPresentation from './DashboardPresentation'
import WidgetTasks from 'components/WidgetTasks'
import WidgetRegistrations from 'components/WidgetRegistrations'

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
          <DashboardPresentation
            widgets={[<WidgetTasks.Container key="widget1" />, <WidgetRegistrations.Container key="widget2" />]}
          />
        )
      }}
    </DashboardData>
  )
}

export default DashboardContainer
