import PropTypes from 'prop-types'

import useRoute from 'dataSources/useRoute'
import useLogin from 'dataSources/useLogin'

/**
 * @summary AuthenticationFilterData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function AuthenticationFilterData({ children }) {
  const { routeParams } = useRoute()
  const { computeLogin } = useLogin()
  return children({
    routeParams,
    computeLogin,
  })
}
// PROPTYPES
const { func } = PropTypes
AuthenticationFilterData.propTypes = {
  children: func,
}

export default AuthenticationFilterData
