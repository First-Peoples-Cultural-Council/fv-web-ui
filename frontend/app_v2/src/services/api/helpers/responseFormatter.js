const responseFormatter = (response, dataAdaptor) => {
  const { isLoading, error, data } = response
  if (isLoading === false && error === null && data && dataAdaptor) {
    const transformedData = dataAdaptor(Object.assign({}, data))
    return { isLoading, error, data: transformedData, dataOriginal: data }
  }
  return { isLoading, error, data, dataOriginal: data }
}

export default responseFormatter
