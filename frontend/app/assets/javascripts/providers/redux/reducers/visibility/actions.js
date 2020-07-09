import { execute } from 'providers/redux/reducers/rest'
// A document ID is expected as an arg for these actions

export const updateVisibilityToTeam = execute('FV_UPDATE_VISIBILITY', 'UpdateVisibilityOperation', {
  visibility: 'team',
})

export const updateVisibilityToMembers = execute('FV_UPDATE_VISIBILITY', 'UpdateVisibilityOperation', {
  visibility: 'members',
})

export const updateVisibilityToPublic = execute('FV_UPDATE_VISIBILITY', 'UpdateVisibilityOperation', {
  visibility: 'public',
})
