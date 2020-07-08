// import { useState } from 'react'
import PropTypes from 'prop-types'
// import Immutable from 'immutable'
// import selectn from 'selectn'

// import useLogin from 'DataSource/useLogin'
// import useIntl from 'DataSource/useIntl'
// import useUser from 'DataSource/useUser'

/**
 * @summary DashboardDetailData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
const DashboardDetailData = ({ children }) => {
  /*
  // State Hooks
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  // Data/Custom hooks
  const { computeLogin } = useLogin()
  const { computeUserDialects } = useUser()
  const { intl } = useIntl()

  const onCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedTaskId(null)
  }

  const onOpenDialog = (id) => {
    setIsDialogOpen(true)
    setSelectedTaskId(id)
  }

  const userID = selectn('response.id', computeLogin)
  const computeEntities = Immutable.fromJS([
    {
      id: userID,
      entity: computeUserDialects,
    },
  ])
  */
  return children({
    log: 'hello from DashboardDetailData',
    // computeEntities,
    // intl,
    // isDialogOpen,
    // onCloseDialog,
    // onOpenDialog,
    // selectedTaskId,
  })
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailData.propTypes = {
  children: func,
}

export default DashboardDetailData
