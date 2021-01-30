import React from 'react'
import ReactDOM from 'react-dom'
import FVProvider from 'app_v1/FVProvider'
import 'tailwindcss/tailwind.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppFrameContainer from './components/AppFrame/AppFrameContainer'
import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient()
ReactDOM.render(
  <FVProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppFrameContainer />
      </Router>
    </QueryClientProvider>
  </FVProvider>,
  document.getElementById('root')
)
