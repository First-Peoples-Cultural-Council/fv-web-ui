import React from 'react'
// import PropTypes from 'prop-types'
import DashboardDetailListPresentation from 'components/DashboardDetail/DashboardDetailList/DashboardDetailListPresentation'
import DashboardDetailListData from 'components/DashboardDetail/DashboardDetailList/DashboardDetailListData'
import Typography from '@material-ui/core/Typography'

/**
 * @summary DashboardDetailListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardDetailListContainer() {
  return (
    <DashboardDetailListData>
      {({ listItems }) => {
        return (
          <DashboardDetailListPresentation
            listItems={listItems}
            childrenHeader={
              <Typography variant="h4" component="h1">
                Tasks
              </Typography>
            }
          />
        )
      }}
    </DashboardDetailListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
// DashboardDetailListContainer.propTypes = {
//     something: string,
// }

export default DashboardDetailListContainer
