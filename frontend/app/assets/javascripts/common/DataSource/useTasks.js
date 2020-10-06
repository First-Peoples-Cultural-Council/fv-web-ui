import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProviderHelpers from 'common/ProviderHelpers'

import {
  approveRegistration as _approveRegistration,
  approveTask as _approveTask,
  fetchTasks as _fetchTasks,
  fetchUserTasks as _fetchUserTasks,
  getSimpleTasks as _getSimpleTasks,
  getSimpleTask as _getSimpleTask,
  postRequestReview as _postRequestReview,
  rejectRegistration as _rejectRegistration,
  rejectTask as _rejectTask,
  setProcessedTask as _setProcessedTask,
  simpleTaskApprove as _simpleTaskApprove,
  simpleTaskRequestChanges as _simpleTaskRequestChanges,
  simpleTaskIgnore as _simpleTaskIgnore,
} from 'providers/redux/reducers/tasks'

function useTasks() {
  const dispatch = useDispatch()
  const [lastRejectTaskId, setLastRejectTaskId] = useState()

  return {
    computeTasks: useSelector((state) => state.tasks.computeTasks),
    computeSimpleTask: useSelector((state) => state.tasks.computeSimpleTask),
    computeSimpleTasks: useSelector((state) => state.tasks.computeSimpleTasks),
    computeUserRegistrationApprove: useSelector((state) => state.tasks.computeUserRegistrationApprove),
    computeUserRegistrationReject: useSelector((state) => state.tasks.computeUserRegistrationReject),
    computeUserTasks: useSelector((state) => state.tasks.computeUserTasks),
    computeUserTasksApprove: useSelector((state) => state.tasks.computeUserTasksApprove),
    computeUserTasksReject: useSelector((state) => state.tasks.computeUserTasksReject),
    extractComputeUserTasksReject: useSelector((state) =>
      ProviderHelpers.getEntry(state.tasks.computeUserTasksReject, lastRejectTaskId)
    ),
    approveRegistration: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _approveRegistration(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    approveTask: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _approveTask(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    fetchTasks: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchTasks(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    fetchUserTasks: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchUserTasks(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    getSimpleTask: (uid) => {
      const dispatchObj = _getSimpleTask(uid)
      return dispatch(dispatchObj)
    },
    getSimpleTasks: (queryParams) => {
      const dispatchObj = _getSimpleTasks(queryParams)
      return dispatch(dispatchObj)
    },
    postRequestReview: (docId, requestedVisibility, comment) => {
      const dispatchObj = _postRequestReview(docId, requestedVisibility, comment)
      return dispatch(dispatchObj)
    },
    rejectRegistration: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _rejectRegistration(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    rejectTask: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _rejectTask(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      setLastRejectTaskId(pathOrId)
      return dispatch(dispatchObj)
    },
    processedTasks: useSelector((state) => state.tasks.processedTasks),
    setProcessedTask: ({ idTask, idItem, message, isSuccess }) => {
      dispatch(
        _setProcessedTask({
          idTask,
          idItem,
          message,
          isSuccess,
        })
      )
    },
    simpleTaskApprove: ({ idTask, idItem, visibility } = {}) => {
      dispatch(_simpleTaskApprove({ idTask, idItem, visibility }))
    },
    computeSimpleTaskApprove: useSelector((state) => state.tasks.computeSimpleTaskApprove),
    simpleTaskRequestChanges: ({ idTask, idItem, visibility, comment } = {}) => {
      dispatch(_simpleTaskRequestChanges({ idTask, idItem, visibility, comment }))
    },
    computeSimpleTaskRequestChanges: useSelector((state) => state.tasks.computeSimpleTaskRequestChanges),
    simpleTaskIgnore: ({ idTask, idItem } = {}) => {
      dispatch(_simpleTaskIgnore({ idTask, idItem }))
    },
    computeSimpleTaskIgnore: useSelector((state) => state.tasks.computeSimpleTaskIgnore),
  }
}
export default useTasks
