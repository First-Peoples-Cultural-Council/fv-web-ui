import React from 'react'
import ReactDOM from 'react-dom'
import { Switch, Route } from 'react-router-dom'
import AppV1Provider from 'app_v1/FVProvider'
import 'tailwindcss/tailwind.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppFrameContainer from './components/AppFrame/AppFrameContainer'
import { QueryClient, QueryClientProvider } from 'react-query'
import AppStateProvider from 'common/AppStateProvider'
const queryClient = new QueryClient()

ReactDOM.render(
  <AppV1Provider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/:language">
            <AppStateProvider>
              <AppFrameContainer />
            </AppStateProvider>
          </Route>
        </Switch>
      </Router>
    </QueryClientProvider>
  </AppV1Provider>,
  document.getElementById('root')
)
