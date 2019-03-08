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
import React, { Component, PropTypes } from 'react'
import Immutable, { Map } from 'immutable'

import provide from 'react-redux-provide'
import selectn from 'selectn'
import t from 'tcomb-form'
import classNames from 'classnames'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import GridTile from 'material-ui/lib/grid-list/grid-tile'

import MediaList from 'views/components/Browsing/media-list'
import LinearProgress from 'material-ui/lib/linear-progress'

import IconButton from 'material-ui/lib/icon-button'
import ActionInfo from 'material-ui/lib/svg-icons/action/info'
import ActionInfoOutline from 'material-ui/lib/svg-icons/action/info-outline'

import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'
import CategoriesListView from 'views/pages/explore/dialect/learn/words/categories-list-view'
import ContributorsListView from 'views/pages/explore/dialect/learn/base/contributors-list-view'
import LinksListView from 'views/pages/explore/dialect/learn/base/links-list-view'
import IntlService from 'views/services/intl'

const gridListStyle = { width: '100%', height: '100vh', overflowY: 'auto', marginBottom: 10 }
const intl = IntlService.instance
const DefaultFetcherParams = {
  currentPageIndex: 1,
  pageSize: 10,
  filters: { 'properties.dc:title': { appliedFilter: '' }, dialect: { appliedFilter: '' } },
}

class SharedResourceGridTile extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      showInfo: false,
    }
  }

  render() {
    const tile = this.props.tile
    const resourceParentDialect = selectn('contextParameters.ancestry.dialect', tile)
    let actionIcon = null

    const isFVShared = selectn('path', tile) && selectn('path', tile).indexOf('SharedResources') != -1
    const isDialectShared = selectn('uid', resourceParentDialect) != selectn('uid', this.props.dialect)

    // If resource is from different dialect, show notification so user is aware
    if (isDialectShared || isFVShared) {
      const tooltip = isDialectShared
        ? intl.trans('shared_from_x', 'Shared from ' + selectn('dc:title', resourceParentDialect), null, [
          selectn('dc:title', resourceParentDialect),
        ])
        : intl.trans('shared_from_x_collection', 'Shared from FirstVoices Collection', null, ['FirstVoices'])
      actionIcon = (
        <IconButton tooltip={tooltip} tooltipPosition="top-left">
          {isDialectShared ? <ActionInfoOutline color="white" /> : <ActionInfo color="white" />}
        </IconButton>
      )
    }

    return (
      <GridTile
        onTouchTap={this.props.action ? this.props.action.bind(this, this.props.tile) : null}
        key={selectn('uid', tile)}
        title={selectn('properties.dc:title', tile)}
        actionPosition="right"
        titlePosition={this.props.fileTypeTilePosition}
        actionIcon={actionIcon}
        subtitle={
          <span>
            <strong>{Math.round(selectn('properties.common:size', tile) * 0.001)} KB</strong>
          </span>
        }
      >
        {this.props.preview}
      </GridTile>
    )
  }
}

@provide
class BrowseComponent extends React.Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    fetchSharedPictures: PropTypes.func.isRequired,
    computeSharedPictures: PropTypes.object.isRequired,
    fetchResources: PropTypes.func.isRequired,
    computeResources: PropTypes.object.isRequired,
    fetchSharedAudios: PropTypes.func.isRequired,
    computeSharedAudios: PropTypes.object.isRequired,
    fetchSharedVideos: PropTypes.func.isRequired,
    computeSharedVideos: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    containerType: PropTypes.string,
  }

  getDefaultValues() {
    intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')
  }

  _handleOpen() {
    this.setState({ open: true })
  }

  _handleClose() {
    this.setState({ open: false })
  }

  _handleSelectElement(value) {
    this.props.onComplete(value)
  }

  constructor(props) {
    super(props)

    // Bind methods to 'this'
    ;['_handleOpen', '_handleClose', '_handleSelectElement', 'fetchData'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )

    // If initial filter value provided
    const providedTitleFilter = selectn('otherContext.providedFilter', this.props.dialect)
    const appliedParams = providedTitleFilter
      ? Object.assign({}, DefaultFetcherParams, {
        filters: { 'properties.dc:title': { appliedFilter: providedTitleFilter } },
      })
      : DefaultFetcherParams

    this.state = {
      open: false,
      fetcherParams: appliedParams,
    }
  }

  fetchData(fetcherParams) {
    // If searching for shared images, need to split filter into 2 groups so NXQL is formatted correctly.
    const group1 = new Map(fetcherParams.filters).filter((v, k) => k == 'shared_fv' || k == 'shared_dialects').toJS()
    const group2 = new Map(fetcherParams.filters).filterNot((v, k) => k == 'shared_fv' || k == 'shared_dialects').toJS()

    this.props.fetchResources(
      '/FV/Workspaces/',
      " AND ecm:primaryType ILIKE '" +
        this.props.type +
        "'" +
        " AND ecm:isCheckedInVersion = 0 AND ecm:currentLifeCycleState != 'deleted' AND ecm:currentLifeCycleState != 'Disabled'" +
        " AND (ecm:path STARTSWITH '" +
        StringHelpers.clean(selectn('path', this.props.dialect)) +
        "/Resources/'" +
        ProviderHelpers.filtersToNXQL(group1) +
        ')' +
        ProviderHelpers.filtersToNXQL(group2) +
        '&currentPageIndex=' +
        (fetcherParams.currentPageIndex - 1) +
        '&pageSize=' +
        fetcherParams.pageSize +
        '&sortBy=dc:created' +
        '&sortOrder=DESC'
    )

    this.setState({
      fetcherParams: fetcherParams,
    })
  }

  componentDidMount() {
    //this.fetchData(this.state.fetcherParams);
  }

  render() {
    const dialect = this.props.dialect
    const dialectPath = selectn('path', dialect)

    const actions = [
      <FlatButton label={intl.trans('cancel', 'Cancel', 'first')} secondary onTouchTap={this._handleClose} />,
    ]

    let title = ''
    let view = null

    switch (this.props.type) {
      case 'FVPhrase':
        title = 'Select existing phrases from ' + selectn('properties.dc:title', dialect) + ' dialect:'
        view = (
          <PhraseListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVCategory':
        title = `${intl.trans('select', 'Select', 'first')} ${
          this.props.containerType == 'FVWord'
            ? intl.trans('categories', 'Categories', 'first')
            : intl.trans('phrase_books', 'Phrase Books', 'words')
        }`
        view = (
          <CategoriesListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            categoriesPath={
              this.props.containerType == 'FVWord'
                ? '/FV/Workspaces/SharedData/Shared Categories/'
                : dialectPath + '/Phrase Books/'
            }
            routeParams={{
              theme: 'explore',
              area: 'Workspaces',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVContributor':
        title = `${intl.trans(
          'select_contributors_from_x_dialect',
          'Select contributors from ' + selectn('properties.dc:title', dialect) + ' dialect',
          'first',
          [selectn('properties.dc:title', dialect)]
        )}:`
        view = (
          <ContributorsListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              area: 'Workspaces',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVLink':
        title = `${intl.trans(
          'select_links_from_x_dialect',
          'Select links from ' + selectn('properties.dc:title', dialect) + ' dialect',
          'first',
          [selectn('properties.dc:title', dialect)]
        )}:`
        view = (
          <LinksListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              area: 'Workspaces',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVWord':
        title = `${intl.trans(
          'select_existing_words_from_x_dialect',
          'Select existing words from ' + selectn('properties.dc:title', dialect) + ' dialect',
          'first',
          [selectn('properties.dc:title', dialect)]
        )}:`
        view = (
          <WordListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              dialect_path: dialectPath,
            }}
          />
        )
        break
      default: // Note: do nothing
    }

    return (
      <div style={{ display: 'inline' }}>
        <RaisedButton label={this.props.label} onTouchTap={this._handleOpen} />
        <Dialog
          title={title}
          actions={actions}
          modal
          contentStyle={{ width: '80%', height: '80vh', maxWidth: '100%' }}
          autoScrollBodyContent
          open={this.state.open}
        >
          {(() => {
            if (dialectPath) {
              return view
            }
          })()}
        </Dialog>
      </div>
    )
  }
}
export default BrowseComponent
