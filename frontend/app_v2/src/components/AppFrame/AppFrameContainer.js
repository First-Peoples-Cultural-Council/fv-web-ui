import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'tailwindcss/tailwind.css'
import './AppFrame.css'
import About from 'components/About'
import Suspender from 'components/Suspender'
import Header from 'components/Header'
const queryClient = new QueryClient()
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
    <QueryClientProvider client={queryClient}>
      <div className="AppFrame">
        <Header.Container className="AppV2__header" />
        {/* Sample nav for header */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about?language=ÜgwÛ">About</Link>
            </li>
          </ul>
        </nav>
        <main role="main">
          <Suspender>
            <Switch>
              <Route path="/about">
                <About.Container />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Suspender>
        </main>
      </div>
    </QueryClientProvider>
  )
}

// Example sub-pages that would be imported/lazy loaded
// ============================================================
function Home() {
  return <h2>[Showing Home page]</h2>
}

// function About() {
//   const match = useRouteMatch()

//   return (
//     <>
//       <h2>About</h2>

//       <Link to="/about/subpage">Go to About subpage</Link>
//       <Route path={`${match.url}/subpage`}>
//         <div>This is a subpage for About</div>
//       </Route>
//     </>
//   )
// }

export default AppFrameContainer
