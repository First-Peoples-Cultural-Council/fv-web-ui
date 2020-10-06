import { computeOperation } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

import {
  FV_SIMPLE_TASKS_GET_START,
  FV_SIMPLE_TASKS_GET_SUCCESS,
  FV_SIMPLE_TASKS_GET_ERROR,
  FV_SIMPLE_TASK_GET_START,
  FV_SIMPLE_TASK_GET_SUCCESS,
  FV_SIMPLE_TASK_GET_ERROR,
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

const initialState = {
  isFetching: false,
  response: {
    get: () => {
      return ''
    },
  },
  success: false,
}

const computeUserTasksOperation = computeOperation('user_tasks')
const computeTasksOperation = computeOperation('tasks')
const computeUserTasksApproveOperation = computeOperation('user_tasks_approve')
const computeUserTasksRejectOperation = computeOperation('user_tasks_reject')
const computeCountTotalTasksFactory = computeOperation('count_total_tasks')
const computeUserRegistrationTasksFactory = computeOperation('user_registration')
const computeUserRegistrationApproveOperation = computeOperation('user_registration_approve')
const computeUserRegistrationRejectOperation = computeOperation('user_registration_reject')

export const tasksReducer = combineReducers({
  computeSimpleTasks(state = initialState, action) {
    switch (action.type) {
      case FV_SIMPLE_TASKS_GET_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_SIMPLE_TASKS_GET_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_SIMPLE_TASKS_GET_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.error,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeSimpleTask(state = initialState, action) {
    switch (action.type) {
      case FV_SIMPLE_TASK_GET_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_SIMPLE_TASK_GET_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_SIMPLE_TASK_GET_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.error,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeSimpleTaskApprove(state, action) {
    switch (action.type) {
      case FV_SIMPLE_TASKS_APPROVE_PUT_START:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          message: undefined,
          isFetching: true,
          isSuccess: undefined,
        }

      case FV_SIMPLE_TASKS_APPROVE_PUT_SUCCESS:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          message: action.message,
          isFetching: false,
          isSuccess: true,
        }

      case FV_SIMPLE_TASKS_APPROVE_PUT_ERROR:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          message: action.message,
          isFetching: false,
          isSuccess: false,
        }

      default:
        return state ? state : {}
    }
  },
  computeSimpleTaskRequestChanges(state, action) {
    switch (action.type) {
      case FV_SIMPLE_TASKS_REQUEST_CHANGES_START:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          message: undefined,
          isFetching: true,
          isSuccess: undefined,
        }

      case FV_SIMPLE_TASKS_REQUEST_CHANGES_SUCCESS:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          message: action.message,
          isFetching: false,
          isSuccess: true,
        }

      case FV_SIMPLE_TASKS_REQUEST_CHANGES_ERROR:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          message: action.message,
          isFetching: false,
          isSuccess: false,
        }

      default:
        return state ? state : {}
    }
  },
  computeSimpleTaskIgnore(state, action) {
    switch (action.type) {
      case FV_SIMPLE_TASKS_IGNORE_START:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          isFetching: true,
          isSuccess: undefined,
        }

      case FV_SIMPLE_TASKS_IGNORE_SUCCESS:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          isFetching: false,
          isSuccess: true,
        }

      case FV_SIMPLE_TASKS_IGNORE_ERROR:
        return {
          ...state,
          idTask: action.idTask,
          idItem: action.idItem,
          isFetching: false,
          isSuccess: false,
        }

      default:
        return state ? state : {}
    }
  },
  processedTasks(state, { type, idTask, idItem, message, isSuccess }) {
    if (type === FV_PROCESSED_TASK) {
      return [...state, { idTask, idItem, message, isSuccess }]
    }
    return state ? state : []
  },
  computeTasks: computeTasksOperation.computeTasks,
  computeUserTasks: computeUserTasksOperation.computeUserTasks,
  computeUserTasksApprove: computeUserTasksApproveOperation.computeUserTasksApprove,
  computeUserTasksReject: computeUserTasksRejectOperation.computeUserTasksReject,
  computeCountTotalTasks: computeCountTotalTasksFactory.computeCountTotalTasks,
  computeUserRegistrationTasks: computeUserRegistrationTasksFactory.computeUserRegistration,
  computeUserRegistrationApprove: computeUserRegistrationApproveOperation.computeUserRegistrationApprove,
  computeUserRegistrationReject: computeUserRegistrationRejectOperation.computeUserRegistrationReject,
})
