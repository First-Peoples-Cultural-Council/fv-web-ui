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
import Immutable, { List, Set, Map } from "immutable"
import classNames from "classnames"
import provide from "react-redux-provide"
import selectn from "selectn"

import ReportsJson from "./reports.json"

import PromiseWrapper from "views/components/Document/PromiseWrapper"

import ProviderHelpers from "common/ProviderHelpers"
import StringHelpers from "common/StringHelpers"
import UIHelpers from "common/UIHelpers"

import AuthorizationFilter from "views/components/Document/AuthorizationFilter"
import PageDialectLearnBase from "views/pages/explore/dialect/learn/base"

import WordListView from "views/pages/explore/dialect/learn/words/list-view"
import PhraseListView from "views/pages/explore/dialect/learn/phrases/list-view"
import SongsStoriesListViewAlt from "views/pages/explore/dialect/learn/songs-stories/list-view-alt"

import ReportBrowser from "./browse-view"

import CircularProgress from "material-ui/lib/circular-progress"
import RaisedButton from "material-ui/lib/raised-button"

import FacetFilterList from "views/components/Browsing/facet-filter-list"
import IntlService from "views/services/intl"

const intl = IntlService.instance

@provide
export default class PageDialectReportsView extends PageDialectLearnBase {
  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    computeCategories: PropTypes.object.isRequired,
    updatePageProperties: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    let reports = Immutable.fromJS(ReportsJson)

    let report = reports.find(
      function(entry) {
        return entry.get("name").toLowerCase() === decodeURI(this.props.routeParams.reportName).toLowerCase()
      }.bind(this)
    )

    if (!report.has("cols")) {
      let defaultCols = null

      switch (report.get("type")) {
        case "words":
          defaultCols = ["title", "related_pictures", "related_audio", "fv:definitions", "fv-word:part_of_speech"]
          break

        case "phrases":
          defaultCols = ["title", "fv:definitions", "related_pictures", "related_audio", "fv-phrase:phrase_books"]
          break
      }

      report = report.set("cols", defaultCols)
    } else {
      report = report.set("cols", report.get("cols").toJS())
    }

    this.state = {
      currentReport: report,
      filterInfo: new Map({
        currentAppliedFilter: new Map({
          reports: report.get("query"),
        }),
      }),
    }

    // Bind methods to 'this'
    ;[
      "_onNavigateRequest",
      "_handleFacetSelected",
      "_getURLPageProps",
      "_resetURLPagination",
      "_handlePagePropertiesChange",
      "_getPageKey",
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getPageKey() {
    return this.props.routeParams.area + "_" + this.props.routeParams.dialect_name + "_reports"
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace("sections", "Workspaces") + "/" + path)
  }
  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    newProps.fetchPortal(newProps.routeParams.dialect_path + "/Portal")
    newProps.fetchDocument(newProps.routeParams.dialect_path + "/Dictionary")
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computePortal,
      },
    ])

    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      this.props.routeParams.dialect_path + "/Dictionary"
    )
    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + "/Portal"
    )

    let listView = null

    switch (this.state.currentReport.get("type")) {
      case "words":
        listView = (
          <WordListView
            onPaginationReset={this._resetURLPagination}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            {...this._getURLPageProps()}
            controlViaURL={true}
            ENABLED_COLS={this.state.currentReport.has("cols") ? this.state.currentReport.get("cols") : []}
            filter={this.state.filterInfo}
            disableClickItem={false}
            DEFAULT_SORT_COL={this.state.currentReport.get("sortCol")}
            DEFAULT_SORT_TYPE={this.state.currentReport.get("sortOrder")}
            routeParams={this.props.routeParams}
          />
        )
        break

      case "phrases":
        listView = (
          <PhraseListView
            onPaginationReset={this._resetURLPagination}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            {...this._getURLPageProps()}
            controlViaURL={true}
            ENABLED_COLS={this.state.currentReport.has("cols") ? this.state.currentReport.get("cols") : []}
            filter={this.state.filterInfo}
            disableClickItem={false}
            DEFAULT_SORT_COL={this.state.currentReport.get("sortCol")}
            DEFAULT_SORT_TYPE={this.state.currentReport.get("sortOrder")}
            routeParams={this.props.routeParams}
          />
        )
        break

      case "songs":
        listView = (
          <SongsStoriesListViewAlt
            onPaginationReset={this._resetURLPagination}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            {...this._getURLPageProps()}
            controlViaURL={true}
            filter={this.state.filterInfo}
            disableClickItem={false}
            routeParams={this.props.routeParams}
          />
        )
        break

      case "stories":
        listView = (
          <SongsStoriesListViewAlt
            onPaginationReset={this._resetURLPagination}
            onPagePropertiesChange={this._handlePagePropertiesChange}
            {...this._getURLPageProps()}
            controlViaURL={true}
            filter={this.state.filterInfo}
            disableClickItem={false}
            routeParams={this.props.routeParams}
          />
        )
        break
    }

    return (
      <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
        <div className="row">
          <div className={classNames("col-xs-12")}>
            <h1>
              {selectn("response.contextParameters.ancestry.dialect.dc:title", computePortal)}:{" "}
              {StringHelpers.toTitleCase(intl.searchAndReplace(this.state.currentReport.get("name")))}
            </h1>

            <div className="row">
              <div className={classNames("col-xs-12", "col-md-3")}>
                <ReportBrowser
                  style={{ maxHeight: "400px", overflowY: "scroll" }}
                  routeParams={this.props.routeParams}
                  fullWidth={true}
                />
              </div>
              <div className={classNames("col-xs-12", "col-md-9")}>{listView}</div>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}
