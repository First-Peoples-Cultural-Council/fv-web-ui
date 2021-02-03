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
    <AppStateProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppFrameContainer />
        </Router>
      </QueryClientProvider>
    </AppStateProvider>
  </AppV1Provider>,
  document.getElementById('root')
)
