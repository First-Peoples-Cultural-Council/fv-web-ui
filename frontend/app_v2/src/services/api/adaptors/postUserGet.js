const postUserGet = (response) => {
  const { properties } = response
  const userPreferences = [
    { type: 'display', value: 'dark' },
    { type: 'workspaceToggle', value: false },
  ]
  const workspacePreferences = userPreferences.find(({ type }) => type === 'workspaceToggle')
  const isWorkspaceOn = workspacePreferences ? workspacePreferences.value : false
  return {
    userPreferences,
    // userPreferences: properties?.['user:preferences'], // TODO: ENABLE WHEN ENDPOINT UPDATED
    firstName: properties?.['user:firstName'],
    lastName: properties?.['user:lastName'],
    groups: properties?.['user:groups'],
    userName: properties?.['user:username'],
    isWorkspaceOn,
  }
}
export default postUserGet
