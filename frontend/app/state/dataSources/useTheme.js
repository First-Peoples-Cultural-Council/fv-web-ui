import { useTheme as _useTheme } from '@material-ui/core/styles'
function useTheme() {
  const theme = _useTheme()
  return {
    theme,
  }
}
export default useTheme
