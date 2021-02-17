import PropTypes from 'prop-types'
import React, { useReducer } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppStateContext from 'common/AppStateContext'
import { reducerInitialState, reducer } from 'common/reducer'
function StyleguideWrapper({ children }) {
  const [state, dispatch] = useReducer(reducer, reducerInitialState)
  return (
    <Router>
      <AppStateContext.Provider
        value={{
          reducer: {
            state,
            dispatch,
          },
          audio: {
            machine: {},
            send: () => {},
          },
        }}
      >
        {children}
      </AppStateContext.Provider>
    </Router>
  )
}
// PROPTYPES
const { node } = PropTypes
StyleguideWrapper.propTypes = {
  children: node,
}
export default StyleguideWrapper
