import React, { useEffect } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import './AppFrame.css'
import About from 'components/About'
import Suspender from 'components/Suspender'
import Header from 'components/Header'
import useRoute from 'app_v1/useRoute'
import WordsListContainer from 'app_v1/WordsListContainer'
import useSearchParams from 'common/useSearchParams'
import DialectHeader from 'components/DialectHeader'
import WidgetWotd from 'components/WidgetWotd'

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
  /*
  Note: the following values should match what's in your Nuxeo backend

  You can hardcode changes below or override them using url query params, eg:
  http://0.0.0.0:3002/?language=somethingElse&dialect_path=/garden/the/down
  */
  const { dialect_path, language } = useSearchParams({
    defaultValues: {
      language: "k'w",
      // uid: '7ef2204c-f2d9-4904-b9bd-745e5ad01706',
      dialect_path: "/FV/Workspaces/Data/Test/Test/k'w",
    },
    decode: [
      // { name: 'uid', type: 'uri' },
      { name: 'language', type: 'uri' },
      { name: 'dialect_path', type: 'uri' },
    ],
  })
  const { setRouteParams } = useRoute()
  useEffect(() => {
    setRouteParams({
      matchedRouteParams: {
        dialect_path,
      },
    })
  }, [])
  return (
    <div className="AppFrame">
      <Header.Container className="AppV2__header" />
      {/* Sample nav for header */}
      <nav>
        <DialectHeader.Container />
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/words">Words</Link>
          </li>
        </ul>
      </nav>
      <main role="main">
        <Suspender>
          <Switch>
            <Route path="/about">
              <About.Container language={language} />
            </Route>
            <Route path="/words">
              <WordsListContainer />
            </Route>
            <Route path="/">
              <Home />
              <WidgetWotd.Container />
            </Route>
          </Switch>
        </Suspender>
      </main>
    </div>
  )
}

// Example sub-pages that would be imported/lazy loaded
// ============================================================
function Home() {
  return <h2>[Showing Home page]</h2>
}

export default AppFrameContainer
