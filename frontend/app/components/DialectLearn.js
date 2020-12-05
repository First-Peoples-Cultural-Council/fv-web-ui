/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2, updateDialect2, fetchDialectStats, republishDialect } from 'reducers/fvDialect'
import { queryModifiedWords, queryCreatedWords, queryUserCreatedWords, queryUserModifiedWords } from 'reducers/fvWord'
import {
  queryCreatedSongs,
  queryCreatedStories,
  queryModifiedStories,
  queryModifiedSongs,
  queryUserCreatedSongs,
  queryUserCreatedStories,
  queryUserModifiedSongs,
  queryUserModifiedStories,
} from 'reducers/fvBook'
import {
  queryCreatedPhrases,
  queryModifiedPhrases,
  queryUserModifiedPhrases,
  queryUserCreatedPhrases,
} from 'reducers/fvPhrase'
import { fetchPortal, updatePortal } from 'reducers/fvPortal'

import selectn from 'selectn'
import { routeHasChanged } from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import PromiseWrapper from 'components/PromiseWrapper'
import Header from 'components/Header'
import PageToolbar from 'components/PageToolbar'
import EditableComponentHelper from 'components/EditableComponentHelper'

import RecentActivityList from 'components/Dashboard/RecentActivityList'
import TextHeader from 'components/Typography/text-header'

import AuthorizationFilter from 'components/AuthorizationFilter'
import AuthenticationFilter from 'components/AuthenticationFilter'
import FVLabel from 'components/FVLabel'

import ToolbarNavigation from 'components/LearnBase/toolbar-navigation'
import LearningSidebar from 'components/LearnBase/learning-sidebar'

import { withTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Typography from '@material-ui/core/Typography'

import { getDialectClassname } from 'common/Helpers'
import { WORKSPACES, SECTIONS } from 'common/Constants'
/**
 * Learn portion of the dialect portal
 * TODO: Reduce the amount of queries this page runs.
 */

const { func, object, string } = PropTypes
export class DialectLearn extends Component {
  static propTypes = {
    intl: object,
    theme: object,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeCreatedPhrases: object.isRequired,
    computeCreatedSongs: object.isRequired,
    computeCreatedStories: object.isRequired,
    computeCreatedWords: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeModifiedPhrases: object.isRequired,
    computeModifiedSongs: object.isRequired,
    computeModifiedStories: object.isRequired,
    computeModifiedWords: object.isRequired,
    computePortal: object.isRequired,
    computeUserCreatedPhrases: object.isRequired,
    computeUserCreatedSongs: object.isRequired,
    computeUserCreatedStories: object.isRequired,
    computeUserCreatedWords: object.isRequired,
    computeUserModifiedSongs: object.isRequired,
    computeUserModifiedStories: object.isRequired,
    computeUserModifiedPhrases: object.isRequired,
    computeUserModifiedWords: object.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    updateDialect2: func.isRequired,
    fetchDialectStats: func.isRequired,
    republishDialect: func.isRequired,
    queryModifiedWords: func.isRequired,
    queryCreatedWords: func.isRequired,
    queryCreatedPhrases: func.isRequired,
    queryCreatedSongs: func.isRequired,
    queryCreatedStories: func.isRequired,
    queryModifiedPhrases: func.isRequired,
    queryModifiedStories: func.isRequired,
    queryModifiedSongs: func.isRequired,
    queryUserCreatedPhrases: func.isRequired,
    queryUserCreatedSongs: func.isRequired,
    queryUserCreatedStories: func.isRequired,
    queryUserCreatedWords: func.isRequired,
    queryUserModifiedPhrases: func.isRequired,
    queryUserModifiedSongs: func.isRequired,
    queryUserModifiedStories: func.isRequired,
    queryUserModifiedWords: func.isRequired,
    updatePortal: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showStats: false,
      fetchedStats: false,
      fetchedRecentActivityLists: new Set(),
      expandedCards: {
        words: false,
        phrases: false,
        songs: false,
        stories: false,
      },
    }
    ;['_showStats', '_publishChangesAction', '_loadRecentActivity'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  fetchData(newProps) {
    ProviderHelpers.fetchIfMissing({
      key: newProps.routeParams.dialect_path,
      action: this.props.fetchDialect2,
      reducer: this.props.computeDialect2,
    })
    ProviderHelpers.fetchIfMissing({
      key: newProps.routeParams.dialect_path + '/Portal',
      action: this.props.fetchPortal,
      reducer: this.props.computePortal,
    })
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.fetchData(this.props)
    }

    // if (selectn("response.properties.username", this.props.computeLogin) != selectn("response.properties.username", nextProps.computeLogin)) {
    //     nextProps.queryUserModifiedWords(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserCreatedWords(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserModifiedPhrases(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserCreatedPhrases(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserModifiedStories(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserCreatedStories(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserModifiedSongs(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    //     nextProps.queryUserCreatedSongs(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    // }
  }

  /**
   * Toggle published dialect
   */
  _publishChangesAction() {
    this.props.republishDialect(
      this.props.routeParams.dialect_path,
      { value: 'Republish' },
      null,
      this.props.intl.trans(
        'views.pages.explore.dialect.portal_published_successfully',
        'Portal published successfully!',
        'first',
        [],
        null,
        '!'
      )
    )
  }

  _showStats() {
    if (!this.state.fetchedStats) {
      this.props.fetchDialectStats(this.props.routeParams.dialect_path, {
        dialectPath: this.props.routeParams.dialect_path,
        docTypes: ['words', 'phrases', 'songs', 'stories'],
      })
    }

    this.setState({
      fetchedStats: true,
      showStats: !this.state.showStats,
    })
  }

  _loadRecentActivity(key) {
    if (!this.state.fetchedRecentActivityLists.has(key)) {
      const dialectPath = this.props.routeParams.dialect_path
      const userName = selectn('response.properties.username', this.props.computeLogin)

      switch (key) {
        case 'words':
          this.props.queryModifiedWords(dialectPath)
          this.props.queryCreatedWords(dialectPath)

          if (userName && userName !== 'Guest') {
            this.props.queryUserCreatedWords(dialectPath, userName)
            this.props.queryUserModifiedWords(dialectPath, userName)
          }
          break

        case 'phrases':
          this.props.queryModifiedPhrases(dialectPath)
          this.props.queryCreatedPhrases(dialectPath)

          if (userName && userName !== 'Guest') {
            this.props.queryUserCreatedPhrases(dialectPath, userName)
            this.props.queryUserModifiedPhrases(dialectPath, userName)
          }
          break

        case 'stories':
          this.props.queryModifiedStories(dialectPath)
          this.props.queryCreatedStories(dialectPath)

          if (userName && userName !== 'Guest') {
            this.props.queryUserCreatedStories(dialectPath, userName)
            this.props.queryUserModifiedStories(dialectPath, userName)
          }
          break

        case 'songs':
          this.props.queryModifiedSongs(dialectPath)
          this.props.queryCreatedSongs(dialectPath)

          if (userName && userName !== 'Guest') {
            this.props.queryUserCreatedSongs(dialectPath, userName)
            this.props.queryUserModifiedSongs(dialectPath, userName)
          }
          break
        default: // NOTE: do nothing
      }

      this.setState({
        fetchedRecentActivityLists: this.state.fetchedRecentActivityLists.add(key),
      })
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this.props.routeParams.dialect_path + '/Portal',
        entity: this.props.computePortal,
      },
    ])

    let computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

    const computeModifiedWords = ProviderHelpers.getEntry(
      this.props.computeModifiedWords,
      this.props.routeParams.dialect_path
    )
    const computeCreatedWords = ProviderHelpers.getEntry(
      this.props.computeCreatedWords,
      this.props.routeParams.dialect_path
    )
    const computeModifiedPhrases = ProviderHelpers.getEntry(
      this.props.computeModifiedPhrases,
      this.props.routeParams.dialect_path
    )
    const computeCreatedPhrases = ProviderHelpers.getEntry(
      this.props.computeCreatedPhrases,
      this.props.routeParams.dialect_path
    )
    const computeModifiedStories = ProviderHelpers.getEntry(
      this.props.computeModifiedStories,
      this.props.routeParams.dialect_path
    )
    const computeCreatedStories = ProviderHelpers.getEntry(
      this.props.computeCreatedStories,
      this.props.routeParams.dialect_path
    )
    const computeModifiedSongs = ProviderHelpers.getEntry(
      this.props.computeModifiedSongs,
      this.props.routeParams.dialect_path
    )
    const computeCreatedSongs = ProviderHelpers.getEntry(
      this.props.computeCreatedSongs,
      this.props.routeParams.dialect_path
    )
    //const computeUserModifiedWords = ProviderHelpers.getEntry(this.props.computeUserModifiedWords, this.props.routeParams.dialect_path);

    const isSection = this.props.routeParams.area === SECTIONS

    const {
      computeUserModifiedWords,
      computeUserCreatedWords,
      computeUserModifiedPhrases,
      computeUserCreatedPhrases,
      computeUserModifiedStories,
      computeUserCreatedStories,
      computeUserModifiedSongs,
      computeUserCreatedSongs,
    } = this.props
    //let dialect = computeDialect2.response;

    /**
     * Suppress Editing for Language Recorders with Approvers
     */
    const roles = selectn('response.contextParameters.dialect.roles', computeDialect2)

    if (roles && roles.indexOf('Manage') === -1) {
      computeDialect2 = Object.assign(computeDialect2, {
        response: Object.assign(computeDialect2.response, {
          contextParameters: Object.assign(computeDialect2.response.contextParameters, { permissions: ['Read'] }),
        }),
      })
    }

    const themePalette = this.props.theme.palette
    const dialectClassName = getDialectClassname(computeDialect2)

    return (
      <PromiseWrapper computeEntities={computeEntities}>
        {(() => {
          if (this.props.routeParams.area === WORKSPACES) {
            if (selectn('response', computeDialect2))
              return (
                <div className="row">
                  <PageToolbar
                    label={this.props.intl.trans(
                      'views.pages.explore.dialect.learn.language_portal',
                      'Language Portal',
                      'words'
                    )}
                    computeEntity={computeDialect2}
                    computeLogin={this.props.computeLogin}
                    actions={['dialect', 'publish']}
                    publishChangesAction={this._publishChangesAction}
                    {...this.props}
                  />
                </div>
              )
          }
        })()}

        <Header
          dialect={{ compute: computeDialect2, update: this.props.updateDialect2 }}
          handleShowStats={this._showStats}
          isStatisticsVisible={this.state.showStats}
          portal={{ compute: computePortal, update: this.props.updatePortal }}
          routeParams={this.props.routeParams}
        >
          <ToolbarNavigation handleShowStats={this._showStats} isStatisticsVisible={this.state.showStats} />
        </Header>

        <div className={classNames('row', 'dialect-body-container')} style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-7')}>
            <div className={dialectClassName}>
              <TextHeader
                title={this.props.intl.trans(
                  'views.pages.explore.dialect.learn.about_our_language',
                  'About Our Language',
                  'upper'
                )}
                tag="h2"
                properties={this.props.properties}
              />
              <AuthorizationFilter
                filter={{ permission: 'Write', entity: selectn('response', computeDialect2) }}
                renderPartial
              >
                {(() => {
                  // FW-786/FW-1312: We want to start migrating away from dc:description due to character limit
                  // and for better semantic placement of the about_our_language data
                  const description = selectn('response.properties.dc:description', computeDialect2)

                  const about_our_language = selectn(
                    'response.properties.fvdialect:about_our_language',
                    computeDialect2
                  )

                  if (description && !about_our_language) {
                    // If description is available, and about our language is empty or null
                    // assign it to about_our_language field
                    computeDialect2.response.properties['fvdialect:about_our_language'] = description
                  }

                  return (
                    <EditableComponentHelper
                      dataTestid="EditableComponent__dc-description"
                      isSection={isSection}
                      computeEntity={computeDialect2}
                      updateEntity={this.props.updateDialect2}
                      property={about_our_language ? 'fvdialect:about_our_language' : 'dc:description'}
                      entity={selectn('response', computeDialect2)}
                    />
                  )
                })()}
              </AuthorizationFilter>
            </div>

            <div className="row PrintHide" style={{ marginTop: '15px' }}>
              <div className={classNames('col-xs-12')}>
                <TextHeader
                  title={this.props.intl.trans(
                    'views.pages.explore.dialect.learn.recent_activity',
                    'Recent Activity',
                    'upper'
                  )}
                  tag="h2"
                  properties={this.props.properties}
                />
              </div>

              <div className={classNames('col-xs-12', 'col-md-6')}>
                <Card style={{ marginBottom: '15px' }}>
                  <CardHeader
                    className="card-header-custom"
                    onClick={() => this.setState({ expandedCards: { words: !this.state.expandedCards.words } })}
                    title={
                      <Typography
                        variant="subtitle1"
                        style={{
                          color: themePalette.secondary.contrastText,
                        }}
                      >
                        <FVLabel transKey="words" defaultStr="WORDS" transform="upper" />
                      </Typography>
                    }
                    style={{ backgroundColor: themePalette.primary2Color, height: 'initial' }}
                    action={
                      <IconButton
                        onClick={() => this.setState({ expandedCards: { words: !this.state.expandedCards.words } })}
                      >
                        {this.state.expandedCards.words ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse
                    in={this.state.expandedCards.words}
                    timeout="auto"
                    unmountOnExit
                    onEnter={this._loadRecentActivity.bind(this, 'words')}
                  >
                    <CardContent>
                      <div className="row" style={{ paddingTop: '20px' }}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeModifiedWords)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_modified',
                              'Recently Modified',
                              'words'
                            )}
                            docType="word"
                          />
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeCreatedWords)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_created',
                              'Recently Created',
                              'words'
                            )}
                            docType="word"
                          />
                        </div>

                        <AuthenticationFilter.Container>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserModifiedWords)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_modified',
                                'My Recently Modified',
                                'words'
                              )}
                              docType="word"
                            />
                          </div>

                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserCreatedWords)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_created',
                                'My Recently Created',
                                'words'
                              )}
                              docType="word"
                            />
                          </div>
                        </AuthenticationFilter.Container>
                      </div>
                    </CardContent>
                  </Collapse>
                </Card>
              </div>

              <div className={classNames('col-xs-12', 'col-md-6')}>
                <Card style={{ marginBottom: '15px' }}>
                  <CardHeader
                    onClick={() => this.setState({ expandedCards: { phrases: !this.state.expandedCards.phrases } })}
                    className="card-header-custom"
                    title={
                      <Typography
                        variant="subtitle1"
                        style={{
                          color: themePalette.secondary.contrastText,
                        }}
                      >
                        <FVLabel transKey="phrases" defaultStr="PHRASES" transform="upper" />
                      </Typography>
                    }
                    style={{ backgroundColor: themePalette.primary2Color, height: 'initial' }}
                    action={
                      <IconButton
                        onClick={() => this.setState({ expandedCards: { phrases: !this.state.expandedCards.phrases } })}
                      >
                        {this.state.expandedCards.phrases ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse
                    in={this.state.expandedCards.phrases}
                    timeout="auto"
                    unmountOnExit
                    onEnter={this._loadRecentActivity.bind(this, 'phrases')}
                  >
                    <CardContent>
                      <div className="row" style={{ paddingTop: '20px' }}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeModifiedPhrases)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_modified',
                              'Recently Modified',
                              'words'
                            )}
                            docType="phrase"
                          />
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeCreatedPhrases)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_created',
                              'Recently Created',
                              'words'
                            )}
                            docType="phrase"
                          />
                        </div>
                        <AuthenticationFilter.Container>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserModifiedPhrases)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_modified',
                                'My Recently Modified',
                                'words'
                              )}
                              docType="phrase"
                            />
                          </div>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserCreatedPhrases)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_created',
                                'My Recently Created',
                                'words'
                              )}
                              docType="phrase"
                            />
                          </div>
                        </AuthenticationFilter.Container>
                      </div>
                    </CardContent>
                  </Collapse>
                </Card>
              </div>

              <div className={classNames('col-xs-12', 'col-md-6')}>
                <Card style={{ marginBottom: '15px' }}>
                  <CardHeader
                    className="card-header-custom"
                    onClick={() => this.setState({ expandedCards: { songs: !this.state.expandedCards.songs } })}
                    title={
                      <Typography
                        variant="subtitle1"
                        style={{
                          color: themePalette.secondary.contrastText,
                        }}
                      >
                        <FVLabel transKey="songs" defaultStr="SONGS" transform="upper" />
                      </Typography>
                    }
                    style={{ backgroundColor: themePalette.primary2Color, height: 'initial' }}
                    action={
                      <IconButton
                        onClick={() => this.setState({ expandedCards: { songs: !this.state.expandedCards.songs } })}
                      >
                        {this.state.expandedCards.songs ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse
                    in={this.state.expandedCards.songs}
                    timeout="auto"
                    unmountOnExit
                    onEnter={this._loadRecentActivity.bind(this, 'songs')}
                  >
                    <CardContent>
                      <div className="row" style={{ paddingTop: '20px' }}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeModifiedSongs)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_modified',
                              'Recently Modified',
                              'words'
                            )}
                            docType="song"
                          />
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeCreatedSongs)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_created',
                              'Recently Created',
                              'words'
                            )}
                            docType="song"
                          />
                        </div>
                        <AuthenticationFilter.Container>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserModifiedSongs)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_modified',
                                'My Recently Modified',
                                'words'
                              )}
                              docType="song"
                            />
                          </div>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserCreatedSongs)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_created',
                                'My Recently Created',
                                'words'
                              )}
                              docType="song"
                            />
                          </div>
                        </AuthenticationFilter.Container>
                      </div>
                    </CardContent>
                  </Collapse>
                </Card>
              </div>

              <div className={classNames('col-xs-12', 'col-md-6')}>
                <Card style={{ marginBottom: '15px' }}>
                  <CardHeader
                    className="card-header-custom"
                    onClick={() => this.setState({ expandedCards: { stories: !this.state.expandedCards.stories } })}
                    title={
                      <Typography
                        variant="subtitle1"
                        style={{
                          color: themePalette.secondary.contrastText,
                        }}
                      >
                        <FVLabel transKey="stories" defaultStr="STORIES" transform="upper" />
                      </Typography>
                    }
                    style={{ backgroundColor: themePalette.primary2Color, height: 'initial' }}
                    action={
                      <IconButton
                        onClick={() => this.setState({ expandedCards: { stories: !this.state.expandedCards.stories } })}
                      >
                        {this.state.expandedCards.stories ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse
                    in={this.state.expandedCards.stories}
                    timeout="auto"
                    unmountOnExit
                    onEnter={this._loadRecentActivity.bind(this, 'stories')}
                  >
                    <CardContent>
                      <div className="row" style={{ paddingTop: '20px' }}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeModifiedStories)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_modified',
                              'Recently Modified',
                              'words'
                            )}
                            docType="stories"
                          />
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList
                            siteTheme={this.props.routeParams.siteTheme}
                            data={selectn('response', computeCreatedStories)}
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.recently_created',
                              'Recently Created',
                              'words'
                            )}
                            docType="stories"
                          />
                        </div>
                        <AuthenticationFilter.Container>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserModifiedStories)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_modified',
                                'My Recently Modified',
                                'words'
                              )}
                              docType="stories"
                            />
                          </div>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList
                              siteTheme={this.props.routeParams.siteTheme}
                              data={selectn('response', computeUserCreatedStories)}
                              title={this.props.intl.trans(
                                'views.pages.explore.dialect.learn.my_recently_created',
                                'My Recently Created',
                                'words'
                              )}
                              docType="stories"
                            />
                          </div>
                        </AuthenticationFilter.Container>
                      </div>
                    </CardContent>
                  </Collapse>
                </Card>
              </div>
            </div>
          </div>

          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>
            <LearningSidebar
              isSection={isSection}
              properties={this.props.properties}
              dialect={{ compute: computeDialect2, update: this.props.updateDialect2 }}
            />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, fvPhrase, fvPortal, fvWord, nuxeo, navigation, windowPath, locale } = state

  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { _windowPath } = windowPath
  const {
    computeCreatedPhrases,
    computeModifiedPhrases,
    computeUserCreatedPhrases,
    computeUserModifiedPhrases,
  } = fvPhrase
  const {
    computeCreatedSongs,
    computeModifiedSongs,
    computeUserCreatedSongs,
    computeUserModifiedSongs,
    computeCreatedStories,
    computeModifiedStories,
    computeUserCreatedStories,
    computeUserModifiedStories,
  } = fvBook

  const { computeCreatedWords, computeModifiedWords, computeUserCreatedWords, computeUserModifiedWords } = fvWord
  const { intlService } = locale

  const { computePortal } = fvPortal
  const { properties } = navigation
  return {
    computeCreatedPhrases,
    computeCreatedSongs,
    computeCreatedStories,
    computeCreatedWords,
    computeDialect2,
    computeLogin,
    computeModifiedPhrases,
    computeModifiedSongs,
    computeModifiedStories,
    computeModifiedWords,
    computePortal,
    computeUserCreatedPhrases,
    computeUserCreatedSongs,
    computeUserCreatedStories,
    computeUserCreatedWords,
    computeUserModifiedSongs,
    computeUserModifiedStories,
    computeUserModifiedPhrases,
    computeUserModifiedWords,
    properties,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPortal,
  updateDialect2,
  fetchDialectStats,
  republishDialect,
  queryModifiedWords,
  queryCreatedWords,
  queryCreatedPhrases,
  queryCreatedSongs,
  queryCreatedStories,
  queryModifiedPhrases,
  queryModifiedStories,
  queryModifiedSongs,
  queryUserCreatedPhrases,
  queryUserCreatedSongs,
  queryUserCreatedStories,
  queryUserCreatedWords,
  queryUserModifiedPhrases,
  queryUserModifiedSongs,
  queryUserModifiedStories,
  queryUserModifiedWords,
  updatePortal,
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(DialectLearn))
