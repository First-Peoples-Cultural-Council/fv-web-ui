import { execute } from 'providers/redux/reducers/rest'

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

export const fetchUserGroupTasks = execute('FV_USER_GROUP_TASKS', 'GetTasksForUserGroupOperation')

export const fetchUserRegistrationTasks = execute('FV_USER_REGISTRATION', 'FVGetPendingUserRegistrations')

export const countTotalTasks = execute('FV_COUNT_TOTAL_TASKS', 'Repository.ResultSetQuery')
