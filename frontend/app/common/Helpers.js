import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'

export const getDialectClassname = (computed) => {
  return (
    selectn('response.properties.fvdialect:customFont', computed) ||
    selectn('response.properties.fv-portal:customFont', computed) ||
    'fontBCSans'
  )
}

export const getLatestResponse = (path, reducerArray) => {
  let mostRecent = { response: { lastModified: 0 } }
  reducerArray.forEach((reducer) => {
    const entry = ProviderHelpers.getEntry(reducer, path)
    const response = selectn('response', entry)
    if (new Date(response?.lastModified).valueOf() > new Date(mostRecent?.response?.lastModified).valueOf()) {
      mostRecent = entry
    }
  })
  return mostRecent
}
