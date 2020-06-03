import { useSelector } from 'react-redux'
function useIntl() {
  return {
    intl: useSelector((state) => state.locale.intlService),
  }
}
export default useIntl
