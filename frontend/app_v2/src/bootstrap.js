import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch } from 'react-router-dom'
import AppV1Provider from 'app_v1/FVProvider'
import 'tailwindcss/tailwind.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppFrameContainer from './components/AppFrame/AppFrameContainer'
import { QueryClient, QueryClientProvider } from 'react-query'
import AppStateProvider from 'common/AppStateProvider'
const queryClient = new QueryClient()

/*
The `ReactDOM.render` call "bootstraps" the app into place
Also using this file for any app providers
*/
ReactDOM.render(
  <AppV1Provider>
    {/* <- Federated from V1. Contains Redux & Mat-UI providers  */}
    <QueryClientProvider client={queryClient}>
      {/* <- React-Query  */}
      <Router>
        {/* <- React Router  */}
        <Switch>
          <Route path="/:language">
            <AppStateProvider>
              <AppFrameContainer />
            </AppStateProvider>
          </Route>

          <div className="grid h-screen">
            <h1 className="place-self-center font-bold text-3xl">Missing language in url</h1>
          </div>
        </Switch>
      </Router>
    </QueryClientProvider>
  </AppV1Provider>,
  document.getElementById('root')
)
