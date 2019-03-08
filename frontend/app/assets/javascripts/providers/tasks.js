import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

//Middleware
import thunk from 'redux-thunk';

// Operations
import UserOperations from 'operations/UserOperations';

const approveTask = RESTActions.execute('FV_USER_TASKS_APPROVE', 'WorkflowTask.Complete', {headers: {'X-NXenrichers.document': 'ancestry'}});
const rejectTask = RESTActions.execute('FV_USER_TASKS_REJECT', 'WorkflowTask.Complete', {headers: {'X-NXenrichers.document': 'ancestry'}});

const approveRegistration = RESTActions.execute('FV_USER_REGISTRATION_APPROVE', 'User.ApproveInvite', {});
const rejectRegistration = RESTActions.execute('FV_USER_REGISTRATION_REJECT', 'User.RejectInvite', {});

const fetchTasks = RESTActions.execute('FV_TASKS', 'Workflow.GetOpenTasks');
const fetchUserTasks = RESTActions.execute('FV_USER_TASKS', 'Task.GetAssigned');
const fetchUserRegistrationTasks = RESTActions.execute('FV_USER_REGISTRATION', 'FVGetPendingUserRegistrations');

const countTotalTasks = RESTActions.execute('FV_COUNT_TOTAL_TASKS', 'Repository.ResultSetQuery');

const actions = {
    fetchTasks,
    fetchUserTasks,
    fetchUserRegistrationTasks,
    approveTask,
    rejectTask,
    approveRegistration,
    rejectRegistration,
    countTotalTasks
};

const computeUserTasksOperation = RESTReducers.computeOperation('user_tasks');
const computeTasksOperation = RESTReducers.computeOperation('tasks');
const computeUserTasksApproveOperation = RESTReducers.computeOperation('user_tasks_approve');
const computeUserTasksRejectOperation = RESTReducers.computeOperation('user_tasks_reject');
const computeCountTotalTasksFactory = RESTReducers.computeOperation('count_total_tasks');
const computeUserRegistrationTasksFactory = RESTReducers.computeOperation('user_registration');
const computeUserRegistrationApproveOperation = RESTReducers.computeOperation('user_registration_approve');
const computeUserRegistrationRejectOperation = RESTReducers.computeOperation('user_registration_reject');

const reducers = {
    computeTasks: computeTasksOperation.computeTasks,
    computeUserTasks: computeUserTasksOperation.computeUserTasks,
    computeUserTasksApprove: computeUserTasksApproveOperation.computeUserTasksApprove,
    computeUserTasksReject: computeUserTasksRejectOperation.computeUserTasksReject,
    computeCountTotalTasks: computeCountTotalTasksFactory.computeCountTotalTasks,
    computeUserRegistrationTasks: computeUserRegistrationTasksFactory.computeUserRegistration,
    computeUserRegistrationApprove: computeUserRegistrationApproveOperation.computeUserRegistrationApprove,
    computeUserRegistrationReject: computeUserRegistrationRejectOperation.computeUserRegistrationReject
};

const middleware = [thunk];

export default {actions, reducers, middleware};