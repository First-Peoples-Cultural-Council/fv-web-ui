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
// import { Immutable, Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchResources } from 'providers/redux/reducers/fvResources'

import { fetchSharedAudios } from 'providers/redux/reducers/fvAudio'
import { fetchSharedPictures } from 'providers/redux/reducers/fvPicture'
import { fetchSharedVideos } from 'providers/redux/reducers/fvVideo'

import selectn from 'selectn'

import { WORKSPACES } from 'common/Constants'

import FVButton from 'views/components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import CategoriesListView from 'views/pages/explore/dialect/learn/words/categories-list-view'
import ContributorsListView from 'views/pages/explore/dialect/learn/base/contributors-list-view'
import IntlService from 'views/services/intl'
import LinksListView from 'views/pages/explore/dialect/learn/base/links-list-view'
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'

const intl = IntlService.instance
const DefaultFetcherParams = {
  currentPageIndex: 1,
  pageSize: 10,
  filters: { 'properties.dc:title': { appliedFilter: '' }, dialect: { appliedFilter: '' } },
}

const { func, object, string } = PropTypes

export class BrowseComponent extends Component {
  static propTypes = {
    containerType: string,
    dialect: object.isRequired,
    label: string.isRequired,
    onComplete: func.isRequired,
    type: string.isRequired,
    // REDUX: reducers/state
    computeSharedPictures: object.isRequired,
    computeResources: object.isRequired,
    computeSharedAudios: object.isRequired,
    computeSharedVideos: object.isRequired,
    computeLogin: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchResources: func.isRequired,
    fetchSharedAudios: func.isRequired,
    fetchSharedPictures: func.isRequired,
    fetchSharedVideos: func.isRequired,
  }
  static defaultProps = {
    disabled: false,
  }

  constructor(props) {
    super(props)

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

  render() {
    const dialect = this.props.dialect
    const dialectPath = selectn('path', dialect)

    const actions = [
      <button className="FlatButton" key="action1" onClick={this._handleClose} type="button">
        {intl.trans('cancel', 'Cancel', 'first')}
      </button>,
    ]

    let title = ''
    let view = null

    switch (this.props.type) {
      case 'FVPhrase':
        title = 'Select existing phrases from ' + selectn('properties.dc:title', dialect) + ' dialect:'
        view = (
          <PhraseListView
            dialect={dialect}
            hasSorting={false}
            hasViewModeButtons={false}
            rowClickHandler={this._handleSelectElement}
            routeParams={{
              siteTheme: 'explore',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVCategory':
        title = `${intl.trans('select', 'Select', 'first')} ${
          this.props.containerType === 'FVWord'
            ? intl.trans('categories', 'Categories', 'first')
            : intl.trans('phrase_books', 'Phrase Books', 'words')
        }`
        // Note: CategoriesListView has a rowClickHandler that checks for a props.action fn()
        view = (
          <CategoriesListView
            action={this._handleSelectElement}
            categoriesPath={
              this.props.containerType === 'FVWord'
                ? '/FV/Workspaces/SharedData/Shared Categories/'
                : dialectPath + '/Phrase Books/'
            }
            dialect={dialect}
            hasSorting={false}
            hasViewModeButtons={false}
            routeParams={{
              siteTheme: 'explore',
              area: WORKSPACES,
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
        // Note: ContributorsListView has a rowClickHandler that checks for a props.action fn()
        view = (
          <ContributorsListView
            action={this._handleSelectElement}
            dialect={dialect}
            hasSorting={false}
            hasViewModeButtons={false}
            routeParams={{
              siteTheme: 'explore',
              area: WORKSPACES,
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
        // Note: LinksListView has a rowClickHandler that checks for a props.action fn()
        view = (
          <LinksListView
            action={this._handleSelectElement}
            dialect={dialect}
            hasSorting={false}
            hasViewModeButtons={false}
            routeParams={{
              siteTheme: 'explore',
              area: WORKSPACES,
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
            dialect={dialect}
            hasSorting={false}
            hasViewModeButtons={false}
            routeParams={{
              siteTheme: 'explore',
              dialect_path: dialectPath,
            }}
            rowClickHandler={this._handleSelectElement}
          />
        )
        break
      default: // Note: do nothing
    }

    return (
      <div style={{ display: 'inline' }}>
        {/* Dialog Button */}
        <FVButton variant="outlined" onClick={this._handleOpen}>
          {this.props.label}
        </FVButton>

        {/* Dialog */}
        <Dialog actions={actions} fullWidth maxWidth="md" open={this.state.open}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {(() => {
              if (dialectPath) {
                return view
              }
            })()}
          </DialogContent>
          <DialogActions>
            <FVButton variant="contained" color="secondary" onClick={this._handleClose}>
              {intl.trans('cancel', 'Cancel', 'first')}
            </FVButton>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  _handleOpen = () => {
    this.setState({ open: true })
  }

  _handleClose = () => {
    this.setState({ open: false })
  }

  _handleSelectElement = (value) => {
    this.props.onComplete(value, () => {
      this._handleClose()
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPicture, fvResources, fvAudio, fvVideo, nuxeo } = state

  const { computeSharedPictures } = fvPicture
  const { computeResources } = fvResources
  const { computeSharedAudios } = fvAudio
  const { computeSharedVideos } = fvVideo
  const { computeLogin } = nuxeo

  return {
    computeSharedPictures,
    computeResources,
    computeSharedAudios,
    computeSharedVideos,
    computeLogin,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResources,
  fetchSharedAudios,
  fetchSharedPictures,
  fetchSharedVideos,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseComponent)
