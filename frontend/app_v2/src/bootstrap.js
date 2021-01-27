import React from 'react'
import ReactDOM from 'react-dom'
import 'tailwindcss/tailwind.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppFrameContainer from './components/AppFrame/AppFrameContainer'
import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient()
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <AppFrameContainer />
    </Router>
  </QueryClientProvider>,
  document.getElementById('root')
)
