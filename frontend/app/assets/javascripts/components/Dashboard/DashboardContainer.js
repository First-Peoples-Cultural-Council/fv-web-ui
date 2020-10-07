import React from 'react'
import DashboardData from './DashboardData'
import DashboardPresentation from './DashboardPresentation'
import WidgetTasks from 'components/WidgetTasks'
import WidgetLinks from 'components/WidgetLinks'

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
            widgets={[<WidgetTasks.Container key="widget1" />, <WidgetLinks.Container key="widget2" />]}
          />
        )
      }}
    </DashboardData>
  )
}

export default DashboardContainer
