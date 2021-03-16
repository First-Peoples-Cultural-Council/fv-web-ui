import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import About from 'components/About'
import Alphabet from 'components/Alphabet'
import Home from 'components/Home'
import Search from 'components/Search'
import Suspender from 'components/Suspender'
import WordsListContainer from 'app_v1/WordsListContainer'
import Word from 'components/Word'
import NavBar from 'components/NavBar'

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
      <NavBar.Container className="relative z-10" />
      <main role="main" className="relative z-0">
        <Suspender>
          <Switch>
            <Route path="/:sitename/about">
              <Helmet>
                <title>About</title>
              </Helmet>
              <About.Container />
            </Route>
            <Route path="/:sitename/alphabet/:character">
              <Helmet>
                <title>Alphabet</title>
              </Helmet>
              <Alphabet.Container />
            </Route>
            <Route path="/:sitename/alphabet">
              <Helmet>
                <title>Alphabet</title>
              </Helmet>
              <Alphabet.Container />
            </Route>
            <Route path="/:sitename/search/:query">
              <Helmet>
                <title>Search</title>
              </Helmet>
              <Search.Container />
            </Route>
            <Route path="/:sitename/search">
              <Helmet>
                <title>Search</title>
              </Helmet>
              <Search.Container />
            </Route>
            <Route path="/:sitename/words">
              <Helmet>
                <title>Words</title>
              </Helmet>
              <WordsListContainer />
            </Route>
            <Route path="/:sitename/word/:wordId">
              <Helmet>
                <title>Word</title>
              </Helmet>
              <Word.Container />
            </Route>
            <Route path="/:sitename/*">
              <div className="flex justify-center items-center min-h-screen">
                <img src="/assets/images/under-construction.gif" alt="This page is under construction" />
              </div>
            </Route>
            <Route path="/:sitename">
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
