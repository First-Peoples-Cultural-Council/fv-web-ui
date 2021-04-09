import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Page from 'components/Page'
import Resource from 'components/Resource'
import Alphabet from 'components/Alphabet'
import Home from 'components/Home'
import Search from 'components/Search'
import Words from 'components/Words'
import Word from 'components/Word'
import Phrases from 'components/Phrases'
import Phrase from 'components/Phrase'
import Categories from 'components/Categories'
import Songs from 'components/Songs'
import Song from 'components/Song'
import Lists from 'components/Lists'
import List from 'components/List'
import Stories from 'components/Stories'
import Story from 'components/Story'
import Games from 'components/Games'
import Game from 'components/Game'
import Kids from 'components/Kids'
import ErrorHandler from 'components/ErrorHandler'

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
    <div className="AppFrame overflow-hidden">
      <NavBar.Container className="relative z-10" />
      <main role="main" className="relative z-0 min-h-screen">
        <ErrorHandler.Container>
          <Switch>
            <Route path="/:sitename/search">
              <Helmet>
                <title>Search</title>
              </Helmet>
              <Search.Container />
            </Route>
            <Route path="/:sitename/words/:wordId">
              <Helmet>
                <title>Words Details View</title>
              </Helmet>
              <Word.Container />
            </Route>
            <Route path="/:sitename/words">
              <Helmet>
                <title>Words</title>
              </Helmet>
              <Words.Container />
            </Route>
            <Route path="/:sitename/phrases/:phraseId">
              <Helmet>
                <title>Phrases Details View</title>
              </Helmet>
              <Phrase.Container />
            </Route>
            <Route path="/:sitename/phrases">
              <Helmet>
                <title>Phrases</title>
              </Helmet>
              <Phrases.Container />
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
            <Route path="/:sitename/categories">
              <Helmet>
                <title>Categories</title>
              </Helmet>
              <Categories.Container />
            </Route>
            <Route path="/:sitename/lists/:listId">
              <Helmet>
                <title>Lists Details View</title>
              </Helmet>
              <List.Container />
            </Route>
            <Route path="/:sitename/lists">
              <Helmet>
                <title>Lists</title>
              </Helmet>
              <Lists.Container />
            </Route>
            <Route path="/:sitename/songs/:songId">
              <Helmet>
                <title>Songs Details View</title>
              </Helmet>
              <Song.Container />
            </Route>
            <Route path="/:sitename/songs">
              <Helmet>
                <title>Songs</title>
              </Helmet>
              <Songs.Container />
            </Route>
            <Route path="/:sitename/stories/:storyId">
              <Helmet>
                <title>Stories Details View</title>
              </Helmet>
              <Story.Container />
            </Route>
            <Route path="/:sitename/stories">
              <Helmet>
                <title>Stories</title>
              </Helmet>
              <Stories.Container />
            </Route>
            <Route path="/:sitename/games/:gameId">
              <Helmet>
                <title>Games Details View</title>
              </Helmet>
              <Game.Container />
            </Route>
            <Route path="/:sitename/games">
              <Helmet>
                <title>Games</title>
              </Helmet>
              <Games.Container />
            </Route>
            <Route path="/:sitename/apps">
              <Helmet>
                <title>Our Apps</title>
              </Helmet>
              <Resource.Container resourceId="apps" />
            </Route>
            <Route path="/:sitename/keyboards">
              <Helmet>
                <title>Our Keyboards</title>
              </Helmet>
              <Resource.Container resourceId="keyboards" />
            </Route>
            <Route path="/:sitename/our-people">
              <Helmet>
                <title>Our People</title>
              </Helmet>
              <Page.Container />
            </Route>
            <Route path="/:sitename/our-language">
              <Helmet>
                <title>Our Language</title>
              </Helmet>
              <Page.Container />
            </Route>
            <Route path="/:sitename/kids">
              <Helmet>
                <title>Kids</title>
              </Helmet>
              <Kids.Container />
            </Route>
            <Route path="/:sitename">
              <Helmet>
                <title>Home</title>
              </Helmet>
              <Home.Container />
            </Route>

            {/* Catch all for all other pages */}
            <Route path="*">
              <div className="flex justify-center items-center min-h-screen">
                <img src="/assets/images/under-construction.gif" alt="This page is under construction" />
              </div>
            </Route>
          </Switch>
        </ErrorHandler.Container>
      </main>
    </div>
  )
}

export default AppFrameContainer
