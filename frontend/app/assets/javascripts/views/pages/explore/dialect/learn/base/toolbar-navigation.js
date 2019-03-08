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
import React, { Component, PropTypes } from "react"

import classNames from "classnames"
import provide from "react-redux-provide"
import selectn from "selectn"

import ProviderHelpers from "common/ProviderHelpers"
import NavigationHelpers from "common/NavigationHelpers"

import EditorInsertChart from "material-ui/lib/svg-icons/editor/insert-chart"
import Toolbar from "material-ui/lib/toolbar/toolbar"
import ToolbarGroup from "material-ui/lib/toolbar/toolbar-group"
import ToolbarSeparator from "material-ui/lib/toolbar/toolbar-separator"
import FlatButton from "material-ui/lib/flat-button"

import AuthenticationFilter from "views/components/Document/AuthenticationFilter"
import IntlService from "views/services/intl"

const intl = IntlService.instance
/**
 * Navigation for learning page
 */
@provide
export default class ToolbarNavigation extends Component {
  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchResultSet: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    computeResultSet: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    showStats: PropTypes.func,
    routeParams: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    ;["_onNavigateRequest", "_getNavigationURL"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentDidMount() {
    // Get count for language assets
    // this.props.fetchResultSet('count_stories', {
    //     'query': 'SELECT COUNT(ecm:uuid) FROM FVBook WHERE fvbook:type="story" AND ecm:path STARTSWITH "' + this.props.routeParams.dialect_path + '/Stories & Songs" AND ecm:currentLifeCycleState <> "deleted"',
    //     'language': 'nxql',
    //     'sortOrder': 'ASC'
    // });
    // this.props.fetchResultSet('count_songs', {
    //     'query': 'SELECT COUNT(ecm:uuid) FROM FVBook WHERE fvbook:type="song" AND ecm:path STARTSWITH "' + this.props.routeParams.dialect_path + '/Stories & Songs" AND ecm:currentLifeCycleState <> "deleted"',
    //     'language': 'nxql',
    //     'sortOrder': 'ASC'
    // });
    // this.props.fetchResultSet('count_words', {
    //     'query': 'SELECT COUNT(ecm:uuid) FROM FVWord WHERE ecm:path STARTSWITH "' + this.props.routeParams.dialect_path + '/Dictionary" AND ecm:currentLifeCycleState <> "deleted"',
    //     'language': 'nxql',
    //     'sortOrder': 'ASC'
    // });
    // this.props.fetchResultSet('count_phrases', {'query': 'SELECT COUNT(ecm:uuid) FROM FVPhrase WHERE ecm:path STARTSWITH "' + this.props.routeParams.dialect_path + '/Dictionary" AND ecm:currentLifeCycleState <> "deleted"'});
  }

  _onNavigateRequest(pathArray) {
    if (this.props.splitWindowPath[this.props.splitWindowPath.length - 1] == "learn") {
      NavigationHelpers.navigateForward(this.props.splitWindowPath, pathArray, this.props.pushWindowPath)
    } else {
      NavigationHelpers.navigateForwardReplace(this.props.splitWindowPath, pathArray, this.props.pushWindowPath)
    }
  }

  _getNavigationURL(path) {
    if (this.props.splitWindowPath[this.props.splitWindowPath.length - 1] == "learn") {
      return this.props.windowPath + "/" + path
    } else {
      return this.props.windowPath + "/learn/" + path
    }
  }

  render() {
    // TODO: Find out why the results sometimes in field1 and sometimes in field2?
    const COUNT_FIELD1 = "response.entries[0].COUNT(ecm:uuid)"
    const COUNT_FIELD2 = "response.entries[1].COUNT(ecm:uuid)"

    //const { label, items, type } = this.props;

    const computeSongsCount = ProviderHelpers.getEntry(this.props.computeResultSet, "count_songs")
    const computeStoriesCount = ProviderHelpers.getEntry(this.props.computeResultSet, "count_stories")
    const computeWordsCount = ProviderHelpers.getEntry(this.props.computeResultSet, "count_words")
    const computePhrasesCount = ProviderHelpers.getEntry(this.props.computeResultSet, "count_phrases")

    let wordCount =
      selectn(COUNT_FIELD1, computeWordsCount) == undefined
        ? "..."
        : selectn(COUNT_FIELD1, computeWordsCount) + selectn(COUNT_FIELD2, computeWordsCount)
    let phraseCount =
      selectn(COUNT_FIELD1, computePhrasesCount) == undefined
        ? "..."
        : selectn(COUNT_FIELD1, computePhrasesCount) + selectn(COUNT_FIELD2, computePhrasesCount)
    let songCount =
      selectn(COUNT_FIELD1, computeSongsCount) == undefined
        ? "..."
        : selectn(COUNT_FIELD1, computeSongsCount) + selectn(COUNT_FIELD2, computeSongsCount)
    let storyCount =
      selectn(COUNT_FIELD1, computeStoriesCount) == undefined
        ? "..."
        : selectn(COUNT_FIELD1, computeStoriesCount) + selectn(COUNT_FIELD2, computeStoriesCount)

    return (
      <div className="dialect-navigation">
        <div className="row">
          <div className="col-xs-12 col-md-10">
            <div firstChild={true} float="left">
              <a href={this._getNavigationURL("words")} onTouchTap={this._onNavigateRequest.bind(this, "words")}>
                {intl.trans("words", "Words", "first") + ""}
              </a>
              <a href={this._getNavigationURL("phrases")} onTouchTap={this._onNavigateRequest.bind(this, "phrases")}>
                {intl.trans("phrases", "Phrases", "first") + ""}
              </a>
              <a href={this._getNavigationURL("songs")} onTouchTap={this._onNavigateRequest.bind(this, "songs")}>
                {intl.trans("songs", "Songs", "first") + ""}
              </a>
              <a href={this._getNavigationURL("stories")} onTouchTap={this._onNavigateRequest.bind(this, "stories")}>
                {intl.trans("stories", "Stories", "first") + ""}
              </a>
              <a href={this._getNavigationURL("alphabet")} onTouchTap={this._onNavigateRequest.bind(this, "alphabet")}>
                {intl.trans("alphabet", "Alphabet", "first")}
              </a>
            </div>
          </div>
          <div className="col-xs-12 col-md-2">
            <AuthenticationFilter
              login={this.props.computeLogin}
              hideFromSections={true}
              routeParams={this.props.routeParams}
            >
              <div
                className={classNames("hidden-xs", { hidden: !this.props.showStats })}
                firstChild={false}
                float="right"
              >
                <FlatButton
                  icon={<EditorInsertChart />}
                  style={{ color: "#fff" }}
                  onTouchTap={this.props.showStats}
                  label={intl.trans("language_statistics", "Language Statistics")}
                />
              </div>
            </AuthenticationFilter>
          </div>
        </div>
      </div>
    )
  }
}
