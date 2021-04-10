import { useDispatch, useSelector } from 'react-redux'

import {
  fetchTasks as _fetchTasks,
  getSimpleTasks as _getSimpleTasks,
  getSimpleTask as _getSimpleTask,
  postRequestReview as _postRequestReview,
  setProcessedTask as _setProcessedTask,
  simpleTaskApprove as _simpleTaskApprove,
  simpleTaskRequestChanges as _simpleTaskRequestChanges,
  simpleTaskIgnore as _simpleTaskIgnore,
} from 'reducers/tasks'

function useTasks() {
  const dispatch = useDispatch()

  return {
    computeTasks: useSelector((state) => state.tasks.computeTasks),
    computeSimpleTask: useSelector((state) => state.tasks.computeSimpleTask),
    computeSimpleTasks: useSelector((state) => state.tasks.computeSimpleTasks),
    fetchTasks: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchTasks(pathOrId, operationParams, messageStart, messageSuccess, messageError)
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
