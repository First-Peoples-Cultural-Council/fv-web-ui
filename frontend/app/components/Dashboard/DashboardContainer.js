import React from 'react'
import selectn from 'selectn'

import classNames from 'classnames'

import DashboardData from './DashboardData'
import DashboardPresentation from './DashboardPresentation'
import WidgetTasks from 'components/WidgetTasks'
import WidgetLinks from 'components/WidgetLinks'

import useLogin from 'dataSources/useLogin'
import ProviderHelpers from '../../common/ProviderHelpers'

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
  const { computeLogin } = useLogin()

  const userGroups = selectn('response.properties.groups', computeLogin)
  const isDashboardAvailable =
    userGroups !== null && (userGroups.indexOf('language_admin') != -1 || ProviderHelpers.isAdmin(computeLogin))

  return (
    <DashboardData>
      {() => {
        return isDashboardAvailable ? (
          <DashboardPresentation
            widgets={[<WidgetTasks.Container key="widget1" />, <WidgetLinks.Container key="widget2" />]}
          />
        ) : (
          <div className={classNames('alert', 'alert-warning')} role="alert">
            Dashboards are currently only available for language administrators.
          </div>
        )
      }}
    </DashboardData>
  )
}

export default DashboardContainer
