import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import './AppFrame.css'
import About from 'components/About'
import Home from 'components/Home'
import Suspender from 'components/Suspender'
import useRoute from 'app_v1/useRoute'
import WordsListContainer from 'app_v1/WordsListContainer'
import useSearchParams from 'common/useSearchParams'
import DialectHeader from 'components/DialectHeader'

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
      <DialectHeader.Container />
      {/* <ul className="p-0 flex flex-row w-full justify-evenly">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/words">Words</Link>
          </li>
        </ul> */}
      <main role="main">
        <Suspender>
          <Switch>
            <Route path="/about">
              <Helmet>
                <title>About</title>
              </Helmet>
              <About.Container language={language} />
            </Route>
            <Route path="/words">
              <Helmet>
                <title>Words</title>
              </Helmet>
              <WordsListContainer />
            </Route>
            <Route path="/">
              <Helmet>
                <title>Home</title>
              </Helmet>
              <Home.Container />
            </Route>
          </Switch>
        </Suspender>
      </main>
    </div>
  )
}

export default AppFrameContainer
