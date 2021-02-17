import React from 'react'
import AppStateContext from 'common/AppStateContext'
module.exports = {
  Provider: ({ children }) => {
    return (
      <AppStateContext.Provider
        value={{
          reducer: {
            state: undefined,
            dispatch: undefined,
          },
          audio: {
            machine: {
              value: undefined,
              context: {
                player: new Audio(),
                src: undefined,
                errored: [],
                scrubMs: 500,
              },
            },
            send: undefined,
          },
        }}
      >
        {children}
      </AppStateContext.Provider>
    )
  },
}
