import { useLocation } from 'react-router-dom'
/* Example
useSearchParams({
    defaultValues: {
        pageSize: 1
    },
    decode: [{
        name: 'dialectName',
        type: 'uri'
    },{
        name: 'shouldSearch',
        type: 'bool'
    },{
        name: 'page',
        type: 'numb'
    },]
})
*/
function useSearchParams({ defaultValues = {}, decode = [] } = {}) {
  const { search } = useLocation()
  const searchObj = {}
  const toDecode = [
    {
      name: 'letter',
      type: 'uri',
    },
    {
      name: 'searchTerm',
      type: 'uri',
    },
    ...decode,
  ]
  if (search !== '') {
    const searchParams = search.replace(/^\?/, '')
    searchParams.split('&').forEach((item) => {
      if (item !== '' && /=/.test(item)) {
        const [propName, propValue] = item.split('=')
        let searchValue = propValue
        const decodeRule = toDecode.find(({ name }) => name === propName)
        if (decodeRule) {
          const { type } = decodeRule
          if (type === 'uri') {
            searchValue = decodeURI(propValue)
          }
          if (type === 'bool') {
            searchValue = propValue === 'true' ? true : false
          }
          if (type === 'numb') {
            searchValue = Number(propValue)
          }
        }
        searchObj[propName] = searchValue
      }
    })
  }

  return Object.assign({}, defaultValues, searchObj)

  // return new URLSearchParams(useLocation().search)
}
export default useSearchParams
