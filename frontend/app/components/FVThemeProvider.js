import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import FirstVoices from 'common/themes/FirstVoices.js'
import FirstVoicesKids from 'common/themes/FirstVoicesKids.js' /// Fix this
import FirstVoicesWorkspace from 'common/themes/FirstVoicesWorkspace.js' /// Fix this
import { useSelector } from 'react-redux'
/**
 * @summary FVThemeProvider
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function FVThemeProvider({ children }) {
  const siteTheme = useSelector((state) => state.navigation.properties.siteTheme)
  const [muiTheme, setMuiTheme] = useState(createTheme(FirstVoices))
  useEffect(() => {
    switch (siteTheme) {
      case 'kids': {
        setMuiTheme(createTheme(FirstVoicesKids))
        break
      }
      case 'workspace': {
        setMuiTheme(createTheme(FirstVoicesWorkspace))
        break
      }
      default: {
        setMuiTheme(createTheme(FirstVoices))
        break
      }
    }
  }, [siteTheme])

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
}
// PROPTYPES
const { node } = PropTypes
FVThemeProvider.propTypes = {
  children: node,
}

export default FVThemeProvider
