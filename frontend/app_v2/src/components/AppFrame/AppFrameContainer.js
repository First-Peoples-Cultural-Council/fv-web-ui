import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom'

import './AppFrame.css'
import Header from 'components/Header'

/**
 * @summary AppFrameContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AppFrameContainer() {
  return (
    <Router>
      <div className="AppFrame">
        <Header.Container className="AppV2__header" />
        {/* Sample nav for header */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

// Example sub-pages that would be imported/lazy loaded
// ============================================================
function Home() {
  return <h2>Home</h2>
}

function About() {
  const match = useRouteMatch()

  return (
    <>
      <h2>About</h2>

      <Link to="/about/subpage">Go to About subpage</Link>
      <Route path={`${match.url}/subpage`}>
        <div>This is a subpage for About</div>
      </Route>
    </>
  )
}

export default AppFrameContainer
