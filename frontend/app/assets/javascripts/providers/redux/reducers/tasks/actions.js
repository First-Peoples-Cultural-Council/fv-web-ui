import { execute } from 'providers/redux/reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'
import IntlService from 'views/services/intl'
import URLHelpers from 'common/URLHelpers'

import {
  FV_SIMPLE_TASKS_GET_START,
  FV_SIMPLE_TASKS_GET_SUCCESS,
  FV_SIMPLE_TASKS_GET_ERROR,
  FV_SIMPLE_TASK_GET_START,
  FV_SIMPLE_TASK_GET_SUCCESS,
  FV_SIMPLE_TASK_GET_ERROR,
} from './actionTypes'

export const approveTask = execute('FV_USER_TASKS_APPROVE', 'WorkflowTask.Complete', {
  headers: { 'enrichers.document': 'ancestry' },
})

export const rejectTask = execute('FV_USER_TASKS_REJECT', 'WorkflowTask.Complete', {
  headers: { 'enrichers.document': 'ancestry' },
})

export const createTask = execute('FV_CREATE_TASK', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const approveRegistration = execute('FV_USER_REGISTRATION_APPROVE', 'User.ApproveInvite', {})

export const rejectRegistration = execute('FV_USER_REGISTRATION_REJECT', 'User.RejectInvite', {})

export const fetchTasks = execute('FV_TASKS', 'Workflow.GetOpenTasks')

export const fetchUserTasks = execute('FV_USER_TASKS', 'Task.GetAssigned')

export const fetchUserRegistrationTasks = execute('FV_USER_REGISTRATION', 'FVGetPendingUserRegistrations')

export const countTotalTasks = execute('FV_COUNT_TOTAL_TASKS', 'Repository.ResultSetQuery')

export const getSimpleTasks = (queryParams = '') => {
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
    return DirectoryOperations.getFromAPI(`${URLHelpers.getBaseURL()}api/v1/simpleTask/${queryParams}`)
      .then((response) => {
        dispatch({ type: FV_SIMPLE_TASKS_GET_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_SIMPLE_TASKS_GET_ERROR, error: error })
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
      })
      .catch((error) => {
        dispatch({ type: FV_SIMPLE_TASK_GET_ERROR, error: error })
      })
  }
}
