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
import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'

import classNames from 'classnames'
import provide from 'react-redux-provide'
// import ConfGlobal from 'conf/local.json'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import Header from 'views/pages/explore/dialect/header'
// import PageHeader from 'views/pages/explore/dialect/page-header'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
// import SearchBar from 'views/pages/explore/dialect/search-bar'

// import RaisedButton from 'material-ui/lib/raised-button'
// import FlatButton from 'material-ui/lib/flat-button'

// import IconMenu from 'material-ui/lib/menus/icon-menu'
// import IconButton from 'material-ui/lib/icon-button'
// import MenuItem from 'material-ui/lib/menus/menu-item'
// import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more'

// import Tabs from 'material-ui/lib/tabs/tabs'
// import Tab from 'material-ui/lib/tabs/tab'

// import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent'
import {EditableComponentHelper} from 'views/components/Editor/EditableComponent'

import RecentActivityList from 'views/components/Dashboard/RecentActivityList'
// import Link from 'views/components/Document/Link'
import TextHeader from 'views/components/Document/Typography/text-header'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'

import ToolbarNavigation from 'views/pages/explore/dialect/learn/base/toolbar-navigation'
import LearningSidebar from 'views/pages/explore/dialect/learn/base/learning-sidebar'

import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import IntlService from 'views/services/intl'
import {getDialectClassname} from 'views/pages/explore/dialect/helpers'

const intl = IntlService.instance
/**
 * Learn portion of the dialect portal
 * TODO: Reduce the amount of queries this page runs.
 */
@provide
export default class DialectLearn extends Component {
    static propTypes = {
      properties: PropTypes.object.isRequired,
      windowPath: PropTypes.string.isRequired,
      fetchDialect2: PropTypes.func.isRequired,
      updateDialect2: PropTypes.func.isRequired,
      computeDialect2: PropTypes.object.isRequired,
      computePortal: PropTypes.object.isRequired,
      updatePortal: PropTypes.func.isRequired,
      fetchPortal: PropTypes.func.isRequired,
      publishDialectOnly: PropTypes.func.isRequired,
      fetchDialectStats: PropTypes.func.isRequired,
      queryModifiedWords: PropTypes.func.isRequired,
      computeModifiedWords: PropTypes.object.isRequired,
      queryCreatedWords: PropTypes.func.isRequired,
      computeCreatedWords: PropTypes.object.isRequired,
      queryUserModifiedWords: PropTypes.func.isRequired,
      computeUserModifiedWords: PropTypes.object.isRequired,
      queryUserCreatedWords: PropTypes.func.isRequired,
      computeUserCreatedWords: PropTypes.object.isRequired,
      queryModifiedPhrases: PropTypes.func.isRequired,
      computeModifiedPhrases: PropTypes.object.isRequired,
      queryCreatedPhrases: PropTypes.func.isRequired,
      computeCreatedPhrases: PropTypes.object.isRequired,
      queryUserModifiedPhrases: PropTypes.func.isRequired,
      computeUserModifiedPhrases: PropTypes.object.isRequired,
      queryUserCreatedPhrases: PropTypes.func.isRequired,
      computeUserCreatedPhrases: PropTypes.object.isRequired,
      queryModifiedStories: PropTypes.func.isRequired,
      computeModifiedStories: PropTypes.object.isRequired,
      queryCreatedStories: PropTypes.func.isRequired,
      computeCreatedStories: PropTypes.object.isRequired,
      queryModifiedSongs: PropTypes.func.isRequired,
      computeModifiedSongs: PropTypes.object.isRequired,
      queryCreatedSongs: PropTypes.func.isRequired,
      computeCreatedSongs: PropTypes.object.isRequired,
      queryUserModifiedStories: PropTypes.func.isRequired,
      computeUserModifiedStories: PropTypes.object.isRequired,
      queryUserCreatedStories: PropTypes.func.isRequired,
      computeUserCreatedStories: PropTypes.object.isRequired,
      queryUserModifiedSongs: PropTypes.func.isRequired,
      computeUserModifiedSongs: PropTypes.object.isRequired,
      queryUserCreatedSongs: PropTypes.func.isRequired,
      computeUserCreatedSongs: PropTypes.object.isRequired,
      computeLogin: PropTypes.object.isRequired,
      routeParams: PropTypes.object.isRequired,
    };

    constructor(props, context) {
      super(props, context)

      this.state = {
        showStats: false,
        fetchedStats: false,
        fetchedRecentActivityLists: new Set(),
      };

      ['_showStats', '_publishChangesAction', '_loadRecentActivity'].forEach((method => this[method] = this[method].bind(this)))
    }

    fetchData(newProps) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
      newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    }

    // Fetch data on initial render
    componentDidMount() {
      this.fetchData(this.props)
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
      if (nextProps.windowPath !== this.props.windowPath) {
        this.fetchData(nextProps)
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
      this.props.publishDialectOnly(this.props.routeParams.dialect_path, {target: this.props.routeParams.language_path.replace('Workspaces', 'sections')}, null, 'Portal published successfully!')
    }

    _showStats() {
      if (!this.state.fetchedStats) {
        this.props.fetchDialectStats(this.props.routeParams.dialect_path, {
          'dialectPath': this.props.routeParams.dialect_path,
          'docTypes': ['words', 'phrases', 'songs', 'stories'],
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
      const computeEntities = Immutable.fromJS([{
        'id': this.props.routeParams.dialect_path,
        'entity': this.props.computeDialect2,
      }, {
        'id': this.props.routeParams.dialect_path + '/Portal',
        'entity': this.props.computePortal,
      }])

      let computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
      const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal')

      const computeModifiedWords = ProviderHelpers.getEntry(this.props.computeModifiedWords, this.props.routeParams.dialect_path)
      const computeCreatedWords = ProviderHelpers.getEntry(this.props.computeCreatedWords, this.props.routeParams.dialect_path)
      const computeModifiedPhrases = ProviderHelpers.getEntry(this.props.computeModifiedPhrases, this.props.routeParams.dialect_path)
      const computeCreatedPhrases = ProviderHelpers.getEntry(this.props.computeCreatedPhrases, this.props.routeParams.dialect_path)
      const computeModifiedStories = ProviderHelpers.getEntry(this.props.computeModifiedStories, this.props.routeParams.dialect_path)
      const computeCreatedStories = ProviderHelpers.getEntry(this.props.computeCreatedStories, this.props.routeParams.dialect_path)
      const computeModifiedSongs = ProviderHelpers.getEntry(this.props.computeModifiedSongs, this.props.routeParams.dialect_path)
      const computeCreatedSongs = ProviderHelpers.getEntry(this.props.computeCreatedSongs, this.props.routeParams.dialect_path)
      //const computeUserModifiedWords = ProviderHelpers.getEntry(this.props.computeUserModifiedWords, this.props.routeParams.dialect_path);

      const isSection = this.props.routeParams.area === 'sections'

      const {
        updatePortal, updateDialect2, computeLogin, computeDocument, computeUserModifiedWords, computeUserCreatedWords, computeUserModifiedPhrases,
        computeUserCreatedPhrases, computeUserModifiedStories, computeUserCreatedStories, computeUserModifiedSongs, computeUserCreatedSongs,
      } = this.props
      //let dialect = computeDialect2.response;

      /**
         * Suppress Editing for Language Recorders with Approvers
         */
      const roles = selectn('response.contextParameters.dialect.roles', computeDialect2)

      if (roles && roles.indexOf('Manage') === -1) {
        computeDialect2 = Object.assign(
          computeDialect2, {
            response: Object.assign(computeDialect2.response, {
              contextParameters: Object.assign(computeDialect2.response.contextParameters, {permissions: ['Read']}),
            }),
          })
      }

      const themePalette = this.props.properties.theme.palette.rawTheme.palette
      const dialectClassName = getDialectClassname(computeDialect2)

      return (
        <PromiseWrapper computeEntities={computeEntities}>

          {(() => {
            if (this.props.routeParams.area === 'Workspaces') {
              if (selectn('response', computeDialect2))
                return <PageToolbar
                  label={intl.trans('views.pages.explore.dialect.learn.language_portal', 'Language Portal', 'words')}
                  computeEntity={computeDialect2}
                  actions={['publish']}
                  publishChangesAction={this._publishChangesAction}
                  {...this.props} />
            }
          })()}

          <Header
            portal={{compute: computePortal, update: updatePortal}}
            dialect={{compute: computeDialect2, update: updateDialect2}}
            login={computeLogin}
            showStats={this.state.showStats}
            routeParams={this.props.routeParams}>

            <ToolbarNavigation showStats={this._showStats} routeParams={this.props.routeParams}/>

          </Header>

          <div className={classNames('row', 'dialect-body-container')} style={{marginTop: '15px'}}>

            <div className={classNames('col-xs-12', 'col-md-7')}>
              <div className={dialectClassName}>
                <TextHeader
                  title={intl.trans('views.pages.explore.dialect.learn.about_our_language', 'About Our Language', 'upper')}
                  tag="h2" properties={this.props.properties}/>
                <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}}
                  renderPartial>
                  <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2}
                    updateEntity={updateDialect2} property="dc:description"
                    entity={selectn('response', computeDialect2)}/>
                </AuthorizationFilter>
              </div>

              <div className="row PrintHide" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-12')}>
                  <TextHeader
                    title={intl.trans('views.pages.explore.dialect.learn.recent_activity', 'Recent Activity', 'upper')}
                    tag="h2" properties={this.props.properties}/>
                </div>

                <div className={classNames('col-xs-12', 'col-md-6')}>
                  <Card initiallyExpanded={false} style={{marginBottom: '15px'}} onExpandChange={this._loadRecentActivity.bind(this, 'words')}>
                    <CardHeader
                      className="card-header-custom"
                      title={intl.trans('words', 'WORDS', 'upper')}
                      titleStyle={{lineHeight: 'initial'}}
                      titleColor={themePalette.alternateTextColor}
                      actAsExpander
                      style={{backgroundColor: themePalette.primary2Color, height: 'initial'}}
                      showExpandableButton
                    />
                    <CardText expandable>
                      <div className="row" style={{paddingTop: '20px'}}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeModifiedWords)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_modified', 'Recently Modified', 'words')}
                            docType="word"/>
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeCreatedWords)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_created', 'Recently Created', 'words')}
                            docType="word"/>
                        </div>

                        <AuthenticationFilter login={this.props.computeLogin} anon={false}>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserModifiedWords)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_modified', 'My Recently Modified', 'words')}
                              docType="word"/>
                          </div>

                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserCreatedWords)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_created', 'My Recently Created', 'words')}
                              docType="word"/>

                          </div>
                        </AuthenticationFilter>
                      </div>
                    </CardText>
                  </Card>
                </div>

                <div className={classNames('col-xs-12', 'col-md-6')}>
                  <Card
                    initiallyExpanded={false}
                    style={{marginBottom: '15px'}}
                    onExpandChange={this._loadRecentActivity.bind(this, 'phrases')}
                  >
                    <CardHeader
                      className="card-header-custom"
                      title={intl.trans('phrases', 'PHRASES', 'upper')}
                      titleStyle={{lineHeight: 'initial'}}
                      titleColor={themePalette.alternateTextColor}
                      actAsExpander
                      style={{backgroundColor: themePalette.primary2Color, height: 'initial'}}
                      showExpandableButton
                    />
                    <CardText expandable>
                      <div className="row" style={{paddingTop: '20px'}}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeModifiedPhrases)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_modified', 'Recently Modified', 'words')}
                            docType="phrase"/>
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeCreatedPhrases)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_created', 'Recently Created', 'words')}
                            docType="phrase"/>
                        </div>
                        <AuthenticationFilter login={this.props.computeLogin} anon={false}>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserModifiedPhrases)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_modified', 'My Recently Modified', 'words')}
                              docType="phrase"/>
                          </div>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserCreatedPhrases)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_created', 'My Recently Created', 'words')}
                              docType="phrase"/>
                          </div>
                        </AuthenticationFilter>
                      </div>
                    </CardText>
                  </Card>
                </div>

                <div className={classNames('col-xs-12', 'col-md-6')}>
                  <Card
                    initiallyExpanded={false}
                    style={{marginBottom: '15px'}}
                    onExpandChange={this._loadRecentActivity.bind(this, 'songs')}
                  >
                    <CardHeader
                      className="card-header-custom"
                      title={intl.trans('songs', 'SONGS', 'upper')}
                      titleStyle={{lineHeight: 'initial'}}
                      titleColor={themePalette.alternateTextColor}
                      actAsExpander
                      style={{backgroundColor: themePalette.primary2Color, height: 'initial'}}
                      showExpandableButton
                    />
                    <CardText expandable>
                      <div className="row" style={{paddingTop: '20px'}}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeModifiedSongs)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_modified', 'Recently Modified', 'words')}
                            docType="song"/>
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeCreatedSongs)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_created', 'Recently Created', 'words')}
                            docType="song"/>
                        </div>
                        <AuthenticationFilter login={this.props.computeLogin} anon={false}>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserModifiedSongs)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_modified', 'My Recently Modified', 'words')}
                              docType="song"/>
                          </div>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserCreatedSongs)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_created', 'My Recently Created', 'words')}
                              docType="song"/>
                          </div>
                        </AuthenticationFilter>
                      </div>
                    </CardText>
                  </Card>
                </div>

                <div className={classNames('col-xs-12', 'col-md-6')}>
                  <Card
                    initiallyExpanded={false}
                    style={{marginBottom: '15px'}}
                    onExpandChange={this._loadRecentActivity.bind(this, 'stories')}
                  >
                    <CardHeader
                      className="card-header-custom"
                      title={intl.trans('stories', 'STORIES', 'upper')}
                      titleStyle={{lineHeight: 'initial'}}
                      titleColor={themePalette.alternateTextColor}
                      actAsExpander
                      style={{backgroundColor: themePalette.primary2Color, height: 'initial'}}
                      showExpandableButton
                    />
                    <CardText expandable>
                      <div className="row" style={{paddingTop: '20px'}}>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeModifiedStories)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_modified', 'Recently Modified', 'words')}
                            docType="stories"/>
                        </div>
                        <div className={classNames('col-xs-6')}>
                          <RecentActivityList theme={this.props.routeParams.theme}
                            data={selectn('response', computeCreatedStories)}
                            title={intl.trans('views.pages.explore.dialect.learn.recently_created', 'Recently Created', 'words')}
                            docType="stories"/>
                        </div>
                        <AuthenticationFilter login={this.props.computeLogin} anon={false}>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserModifiedStories)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_modified', 'My Recently Modified', 'words')}
                              docType="stories"/>
                          </div>
                          <div className={classNames('col-xs-6')}>
                            <RecentActivityList theme={this.props.routeParams.theme}
                              data={selectn('response', computeUserCreatedStories)}
                              title={intl.trans('views.pages.explore.dialect.learn.my_recently_created', 'My Recently Created', 'words')}
                              docType="stories"/>
                          </div>
                        </AuthenticationFilter>
                      </div>
                    </CardText>
                  </Card>
                </div>

              </div>

            </div>

            <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>

              <LearningSidebar
                isSection={isSection}
                properties={this.props.properties}
                dialect={{compute: computeDialect2, update: updateDialect2}}/>

            </div>

          </div>

        </PromiseWrapper>
      )
    }
}
