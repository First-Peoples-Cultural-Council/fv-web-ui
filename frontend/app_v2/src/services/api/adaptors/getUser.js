const getUser = (response) => {
  const { properties } = response
  return {
    firstName: properties?.['user:firstName'],
    lastName: properties?.['user:lastName'],
    groups: properties?.['user:groups'],
    userName: properties?.['user:username'],
  }
}
export default getUser
