const rawGetById = (response) => {
  const fileContent = response?.properties?.['file:content'] || {}
  return {
    url: fileContent.data,
    mimeType: fileContent['mime-type'],
    name: fileContent.name,
  }
}
export default rawGetById
