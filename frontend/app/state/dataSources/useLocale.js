import { useDispatch } from 'react-redux'
import { setLocale as _setLocale } from 'reducers/locale'

function useLocale() {
  const dispatch = useDispatch()

  const setLocale = (locale) => {
    const dispatchObj = _setLocale(locale)
    dispatch(dispatchObj)
  }

  return {
    setLocale,
  }
}
export default useLocale
