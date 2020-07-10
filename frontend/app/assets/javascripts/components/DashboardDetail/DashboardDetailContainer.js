import React from 'react'
import DashboardDetailData from 'components/DashboardDetail/DashboardDetailData'
import DashboardDetailPresentation from 'components/DashboardDetail/DashboardDetailPresentation'

import DashboardDetailList from 'components/DashboardDetail/DashboardDetailList'

import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'

/**
 * @summary DashboardDetailContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardDetailContainer() {
  return (
    <DashboardDetailData>
      {() => {
        // TODO: DashboardDetailContainer gets the childrenSelectedItem ready based on DashboardDetailData's output?
        return (
          <DashboardDetailPresentation childrenSelectedItem={<DashboardDetailSelectedItem.Container />}>
            <DashboardDetailList.Container />
          </DashboardDetailPresentation>
        )
      }}
    </DashboardDetailData>
  )
}

export default DashboardDetailContainer
