import { useLocation } from 'react-router-dom'
/**
 * @summary ErrorHandlerData
 * @component
 *
 * @param {object} props
 *
 */
function ErrorHandlerData() {
  const location = useLocation()
  const errorStatusCode = location?.state?.errorStatusCode ? location?.state?.errorStatusCode : null
  return {
    errorStatusCode,
  }
}

export default ErrorHandlerData
