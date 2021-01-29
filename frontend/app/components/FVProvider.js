import PropTypes from 'prop-types'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import store from 'state/store'
import FVThemeProvider from 'components/FVThemeProvider'
/**
 * @summary FVProvider
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function FVProvider({ children }) {
  return (
    <ReduxProvider store={store}>
      <FVThemeProvider>{children}</FVThemeProvider>
    </ReduxProvider>
  )
}
// PROPTYPES
const { node } = PropTypes
FVProvider.propTypes = {
  children: node,
}

export default FVProvider
