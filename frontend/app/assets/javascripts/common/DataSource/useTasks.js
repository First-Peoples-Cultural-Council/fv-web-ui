import { useDispatch, useSelector } from 'react-redux'

import {
  approveRegistration as _approveRegistration,
  approveTask as _approveTask,
  createTask as _createTask,
  fetchTasks as _fetchTasks,
  fetchUserTasks as _fetchUserTasks,
  fetchUserGroupTasks as _fetchUserGroupTasks,
  rejectRegistration as _rejectRegistration,
  rejectTask as _rejectTask,
} from 'providers/redux/reducers/tasks'

function useTasks() {
  const dispatch = useDispatch()
  return {
    computeTasks: useSelector((state) => state.tasks.computeTasks),
    computeUserRegistrationApprove: useSelector((state) => state.tasks.computeUserRegistrationApprove),
    computeUserRegistrationReject: useSelector((state) => state.tasks.computeUserRegistrationReject),
    computeUserTasks: useSelector((state) => state.tasks.computeUserTasks),
    computeUserGroupTasks: useSelector((state) => state.tasks.computeUserGroupTasks),
    computeUserTasksApprove: useSelector((state) => state.tasks.computeUserTasksApprove),
    computeUserTasksReject: useSelector((state) => state.tasks.computeUserTasksReject),
    approveRegistration: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _approveRegistration(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    approveTask: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _approveTask(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    createTask: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _createTask(pathOrId, operationParams, messageStart, messageSuccess, messageError)
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
    fetchUserGroupTasks: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchUserGroupTasks(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      // NOTE: Returning a promise for use with Material-Table
      return dispatch(dispatchObj)
    },
    rejectRegistration: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _rejectRegistration(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    rejectTask: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _rejectTask(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
  }
}
export default useTasks
