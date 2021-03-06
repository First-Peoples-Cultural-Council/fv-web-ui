import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import About from 'components/About'
import Alphabet from 'components/Alphabet'
import Home from 'components/Home'
import Suspender from 'components/Suspender'
import WordsListContainer from 'app_v1/WordsListContainer'
import Word from 'components/Word'
import DialectHeader from 'components/DialectHeader'

/**
 * @summary AppFrameContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AppFrameContainer() {
  return (
    <div className="AppFrame">
      <DialectHeader.Container className="relative z-10" />
      <main role="main" className="relative z-0">
        <Suspender>
          <Switch>
            <Route path="/:language/about">
              <Helmet>
                <title>About</title>
              </Helmet>
              <About.Container />
            </Route>
            <Route path="/:language/alphabet/:character">
              <Helmet>
                <title>Alphabet</title>
              </Helmet>
              <Alphabet.Container />
            </Route>
            <Route path="/:language/alphabet">
              <Helmet>
                <title>Alphabet</title>
              </Helmet>
              <Alphabet.Container />
            </Route>
            <Route path="/:language/words">
              <Helmet>
                <title>Words</title>
              </Helmet>
              <WordsListContainer />
            </Route>
            <Route path="/:language/word/:wordId">
              <Helmet>
                <title>Word</title>
              </Helmet>
              <Word.Container />
            </Route>
            <Route path="/:language/*">
              <div className="flex justify-center items-center min-h-screen">
                <img src="/assets/images/under-construction.gif" alt="This page is under construction" />
              </div>
            </Route>
            <Route path="/:language">
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
