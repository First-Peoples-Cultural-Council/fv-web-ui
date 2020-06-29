import { useDispatch, useSelector } from 'react-redux'

import {
  approveRegistration as _approveRegistration,
  approveTask as _approveTask,
  fetchUserTasks as _fetchUserTasks,
  rejectRegistration as _rejectRegistration,
  rejectTask as _rejectTask,
} from 'providers/redux/reducers/tasks'

function useTasks() {
  const dispatch = useDispatch()
  return {
    computeUserRegistrationApprove: useSelector((state) => state.tasks.computeUserRegistrationApprove),
    computeUserRegistrationReject: useSelector((state) => state.tasks.computeUserRegistrationReject),
    computeUserTasks: useSelector((state) => state.tasks.computeUserTasks),
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
    fetchUserTasks: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchUserTasks(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
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
