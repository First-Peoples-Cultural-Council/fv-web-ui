import selectn from 'selectn'
export const getDialectClassname = (computed) => {
  return (
    selectn('response.properties.fvdialect:customFont', computed) ||
    selectn('response.properties.fv-portal:customFont', computed) ||
    'fontBCSans'
  )
}
