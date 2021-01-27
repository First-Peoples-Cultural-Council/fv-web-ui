import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import AppFrameContainer from './components/AppFrame/AppFrameContainer'

ReactDOM.render(
  <Router>
    <AppFrameContainer />
  </Router>,
  document.getElementById('root')
)
