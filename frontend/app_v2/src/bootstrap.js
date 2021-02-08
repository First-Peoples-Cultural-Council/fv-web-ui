import React from 'react'
import ReactDOM from 'react-dom'
import AppV1Provider from 'app_v1/FVProvider'
import 'tailwindcss/tailwind.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppFrameContainer from './components/AppFrame/AppFrameContainer'
import { QueryClient, QueryClientProvider } from 'react-query'
import AppStateProvider from 'common/AppStateProvider'
const queryClient = new QueryClient()

ReactDOM.render(
  <AppV1Provider>
    <Router>
      <AppStateProvider>
        <QueryClientProvider client={queryClient}>
          <AppFrameContainer />
        </QueryClientProvider>
      </AppStateProvider>
    </Router>
  </AppV1Provider>,
  document.getElementById('root')
)
