import { computeOperation } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computeUserTasksOperation = computeOperation('user_tasks')
const computeUserGroupTasksOperation = computeOperation('user_group_tasks')
const computeTasksOperation = computeOperation('tasks')
const computeUserTasksApproveOperation = computeOperation('user_tasks_approve')
const computeUserTasksRejectOperation = computeOperation('user_tasks_reject')
const computeCountTotalTasksFactory = computeOperation('count_total_tasks')
const computeUserRegistrationTasksFactory = computeOperation('user_registration')
const computeUserRegistrationApproveOperation = computeOperation('user_registration_approve')
const computeUserRegistrationRejectOperation = computeOperation('user_registration_reject')

export const tasksReducer = combineReducers({
  computeTasks: computeTasksOperation.computeTasks,
  computeUserTasks: computeUserTasksOperation.computeUserTasks,
  computeUserGroupTasks: computeUserGroupTasksOperation.computeUserGroupTasks,
  computeUserTasksApprove: computeUserTasksApproveOperation.computeUserTasksApprove,
  computeUserTasksReject: computeUserTasksRejectOperation.computeUserTasksReject,
  computeCountTotalTasks: computeCountTotalTasksFactory.computeCountTotalTasks,
  computeUserRegistrationTasks: computeUserRegistrationTasksFactory.computeUserRegistration,
  computeUserRegistrationApprove: computeUserRegistrationApproveOperation.computeUserRegistrationApprove,
  computeUserRegistrationReject: computeUserRegistrationRejectOperation.computeUserRegistrationReject,
})
