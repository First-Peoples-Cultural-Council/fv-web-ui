const getUser = (response) => {
  const { properties } = response
  const user = {
    firstName: properties?.firstName,
    lastName: properties?.lastName,
    groups: properties?.groups,
    userName: properties?.username,
  }
  return user
}
export default getUser
