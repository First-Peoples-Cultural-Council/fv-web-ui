import { useState } from 'react'
import Immutable from 'immutable'

// import PropTypes from 'prop-types'
import useLogin from 'DataSource/useLogin'
import useIntl from 'DataSource/useIntl'
import useUser from 'DataSource/useUser'

import selectn from 'selectn'

const TasksData = ({ children }) => {
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

  return children({
    computeEntities,
    intl,
    isDialogOpen,
    onCloseDialog,
    onOpenDialog,
    selectedTaskId,
  })
}

export default TasksData
