import { execute } from 'reducers/rest'

/**
 * Single User Actions
 */
export const selfregisterUser = execute('FV_USER_SELFREGISTER', 'User.SelfRegistration', {})

export const userUpgrade = execute('FV_USER_UPGRADE', 'FVChangeUserGroupToDialectGroup', {})

export const fetchUserDialects = execute('FV_USER_DIALECTS', 'FVGetDialectsForUser')

export const fetchUserStartpage = execute('FV_USER_STARTPAGE', 'FVGetUserStartPage')
