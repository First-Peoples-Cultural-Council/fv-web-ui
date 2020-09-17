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
  processedTasks(state = [], { type, id, message, isSuccess }) {
    // Sonarcloud concession
    if (type === FV_PROCESSED_TASK) {
      return [...state, { id, message, isSuccess }]
    }
    return state
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
