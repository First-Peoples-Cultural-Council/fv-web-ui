import { execute } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'
import IntlService from 'common/services/IntlService'
import URLHelpers from 'common/URLHelpers'
import { getSearchObjectAsUrlQuery } from 'common/NavigationHelpers'
import {
  FV_SIMPLE_TASKS_GET_START,
  FV_SIMPLE_TASKS_GET_SUCCESS,
  FV_SIMPLE_TASKS_GET_ERROR,
  FV_SIMPLE_TASK_GET_START,
  FV_SIMPLE_TASK_GET_SUCCESS,
  FV_SIMPLE_TASK_GET_ERROR,
  FV_REQUEST_REVIEW_POST_START,
  FV_REQUEST_REVIEW_POST_SUCCESS,
  FV_REQUEST_REVIEW_POST_ERROR,
  FV_PROCESSED_TASK,
  FV_SIMPLE_TASKS_APPROVE_PUT_START,
  FV_SIMPLE_TASKS_APPROVE_PUT_SUCCESS,
  FV_SIMPLE_TASKS_APPROVE_PUT_ERROR,
  FV_SIMPLE_TASKS_REQUEST_CHANGES_START,
  FV_SIMPLE_TASKS_REQUEST_CHANGES_SUCCESS,
  FV_SIMPLE_TASKS_REQUEST_CHANGES_ERROR,
  FV_SIMPLE_TASKS_IGNORE_START,
  FV_SIMPLE_TASKS_IGNORE_SUCCESS,
  FV_SIMPLE_TASKS_IGNORE_ERROR,
} from './actionTypes'

export const approveTask = execute('FV_USER_TASKS_APPROVE', 'WorkflowTask.Complete', {
  headers: { 'enrichers.document': 'ancestry' },
})

export const rejectTask = execute('FV_USER_TASKS_REJECT', 'WorkflowTask.Complete', {
  headers: { 'enrichers.document': 'ancestry' },
})

export const approveRegistration = execute('FV_USER_REGISTRATION_APPROVE', 'User.ApproveInvite', {})

export const rejectRegistration = execute('FV_USER_REGISTRATION_REJECT', 'User.RejectInvite', {})

export const fetchTasks = execute('FV_TASKS', 'Workflow.GetOpenTasks')

export const fetchUserTasks = execute('FV_USER_TASKS', 'Task.GetAssigned')

export const fetchUserRegistrationTasks = execute('FV_USER_REGISTRATION', 'FVGetPendingUserRegistrations')

export const countTotalTasks = execute('FV_COUNT_TOTAL_TASKS', 'Repository.ResultSetQuery')

export const getSimpleTasks = (queryParams) => {
  return (dispatch) => {
    dispatch({
      type: FV_SIMPLE_TASKS_GET_START,
      pathOrId: 'api/v1/simpleTask/',
      message:
        IntlService.instance.translate({
          key: 'providers.fetch_started',
          default: 'Fetch Started',
          case: 'tasks',
        }) + '...',
    })

    return DirectoryOperations.getFromAPI(
      `${URLHelpers.getBaseURL()}api/v1/simpleTask${queryParams ? `?${getSearchObjectAsUrlQuery(queryParams)}` : ''}`
    )
      .then((response) => {
        dispatch({ type: FV_SIMPLE_TASKS_GET_SUCCESS, document: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_SIMPLE_TASKS_GET_ERROR, error: error })
        return error
      })
  }
}

export const getSimpleTask = (uid) => {
  return (dispatch) => {
    dispatch({
      type: FV_SIMPLE_TASK_GET_START,
      pathOrId: 'api/v1/simpleTask/',
      message:
        IntlService.instance.translate({
          key: 'providers.fetch_started',
          default: 'Fetch Started',
          case: 'task',
        }) + '...',
    })

    return DirectoryOperations.getFromAPI(`${URLHelpers.getBaseURL()}api/v1/simpleTask/${uid}`)
      .then((response) => {
        dispatch({ type: FV_SIMPLE_TASK_GET_SUCCESS, document: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_SIMPLE_TASK_GET_ERROR, error: error })
        return error
      })
  }
}

export const postRequestReview = ({ docId, requestedVisibility, comment }) => {
  return (dispatch) => {
    dispatch({
      type: FV_REQUEST_REVIEW_POST_START,
      pathOrId: 'api/v1/simpleTask/requestReview',
      message:
        IntlService.instance.translate({
          key: 'providers.fetch_started',
          default: 'Fetch Started',
          case: 'task',
        }) + '...',
    })

    const params = { docId, comment }
    if (requestedVisibility) {
      params.requestedVisibility = requestedVisibility
    }

    return DirectoryOperations.postToAPI(`${URLHelpers.getBaseURL()}api/v1/simpleTask/requestReview`, params)
      .then((response) => {
        dispatch({ type: FV_REQUEST_REVIEW_POST_SUCCESS, document: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_REQUEST_REVIEW_POST_ERROR, error: error })
        return error
      })
  }
}

export const simpleTaskApprove = ({ idTask, idItem, visibility }) => {
  return (dispatch) => {
    if (!idTask || !visibility) {
      dispatch({
        type: FV_SIMPLE_TASKS_APPROVE_PUT_ERROR,
        message: `Missing request parameters: idTask=${idTask}, visibility=${visibility}`,
        idTask: undefined,
        idItem: undefined,
      })
      return
    }

    dispatch({
      type: FV_SIMPLE_TASKS_APPROVE_PUT_START,
      idTask,
      idItem,
    })

    return DirectoryOperations.putToAPI(
      `${URLHelpers.getBaseURL()}api/v1/simpleTask/${idTask}/approve?requestedVisibility=${visibility}`
    )
      .then((response) => {
        dispatch({
          type: FV_SIMPLE_TASKS_APPROVE_PUT_SUCCESS,
          idTask,
          idItem,
          message: response,
        })
        return response
      })
      .catch((error) => {
        dispatch({
          type: FV_SIMPLE_TASKS_APPROVE_PUT_ERROR,
          message: error,
          idTask,
          idItem,
        })
        return error
      })
  }
}

export const simpleTaskIgnore = ({ idTask, idItem }) => {
  return (dispatch) => {
    if (!idTask) {
      dispatch({
        type: FV_SIMPLE_TASKS_IGNORE_ERROR,
        message: `Missing request parameters: idTask=${idTask}`,
        idTask: undefined,
        idItem: undefined,
      })
      return
    }

    dispatch({
      type: FV_SIMPLE_TASKS_IGNORE_START,
      idTask,
      idItem,
    })

    return DirectoryOperations.putToAPI(`${URLHelpers.getBaseURL()}api/v1/simpleTask/${idTask}/ignore`)
      .then((response) => {
        dispatch({
          type: FV_SIMPLE_TASKS_IGNORE_SUCCESS,
          idTask,
          idItem,
          message: response,
        })
        return response
      })
      .catch((error) => {
        dispatch({
          type: FV_SIMPLE_TASKS_IGNORE_ERROR,
          message: error,
          idTask,
          idItem,
        })
        return error
      })
  }
}

export const simpleTaskRequestChanges = ({ idTask, idItem, visibility, comment }) => {
  return (dispatch) => {
    if (!idTask) {
      dispatch({
        type: FV_SIMPLE_TASKS_REQUEST_CHANGES_ERROR,
        message: `Missing request parameter: idTask=${idTask}`,
        idTask: undefined,
        idItem: undefined,
      })
      return
    }

    dispatch({
      type: FV_SIMPLE_TASKS_REQUEST_CHANGES_START,
      idTask,
      idItem,
    })
    return DirectoryOperations.postToAPI(`${URLHelpers.getBaseURL()}api/v1/simpleTask/${idTask}/requestChanges`, {
      approvedVisibility: visibility,
      comment,
    })
      .then((response) => {
        dispatch({
          type: FV_SIMPLE_TASKS_REQUEST_CHANGES_SUCCESS,
          idTask,
          idItem,
          message: response,
        })
        return response
      })
      .catch((error) => {
        dispatch({
          type: FV_SIMPLE_TASKS_REQUEST_CHANGES_ERROR,
          message: error,
          idTask,
          idItem,
        })
        return error
      })
  }
}

export const setProcessedTask = ({ idTask, idItem, message, isSuccess }) => {
  return (dispatch) => {
    dispatch({
      type: FV_PROCESSED_TASK,
      idTask,
      idItem,
      message,
      isSuccess,
    })
  }
}
