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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { deleteBook, deleteBookEntry, fetchBook, fetchBookEntries, publishBook } from 'reducers/fvBook'
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import PromiseWrapper from 'components/PromiseWrapper'

import FVButton from 'components/FVButton'

import BookEntry from 'components/SongsStories/entry/view'
import BookEntryList from 'components/SongsStories/entry/list-view'

import withActions from 'components/withActions'
import withPagination from 'components/withPagination'
import FVLabel from 'components/FVLabel'

const DetailsViewWithActions = withActions(PromiseWrapper, true)

const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 1 }

const PaginatedBookEntryList = withPagination(BookEntryList, DefaultFetcherParams.pageSize, 100)

const DEFAULT_LANGUAGE = 'english'

/**
 * View Book
 */

const { array, func, object, string } = PropTypes
export class SongsStoriesView extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    //typePlural: string,

    // REDUX: reducers/state
    computeBook: object.isRequired,
    computeBookEntries: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    deleteBook: func.isRequired,
    deleteBookEntry: func.isRequired,
    fetchBook: func.isRequired,
    fetchBookEntries: func.isRequired,
    fetchDialect2: func.isRequired,
    publishBook: func.isRequired,
    pushWindowPath: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      fetcherParams: DefaultFetcherParams,
      bookOpen: false,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', 'fetchData', '_fetchListViewData'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  fetchData(props = this.props) {
    props.fetchBook(this._getBookPath(props))
    this._fetchListViewData(this.state.fetcherParams, props)
    props.fetchDialect2(props.routeParams.dialect_path)
  }

  _fetchListViewData(fetcherParams, props = this.props) {
    this.setState({
      fetcherParams: fetcherParams,
    })

    props.fetchBookEntries(
      this._getBookPath(props),
      '&currentPageIndex=' +
        (fetcherParams.currentPageIndex - 1) +
        '&pageSize=' +
        fetcherParams.pageSize +
        '&sortOrder=asc,asc' +
        '&sortBy=fvbookentry:sort_map,dc:created'
    )
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps /*, prevState*/) {
    if (this.props.windowPath !== prevProps.windowPath) {
      this.fetchData(this.props)
    }
    const book = selectn('response', ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath()))
    const title = selectn('properties.dc:title', book)
    const uid = selectn('uid', book)

    if (title && selectn('pageTitleParams.bookName', this.props.properties) != title) {
      this.props.changeTitleParams({ bookName: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.bookName' })
    }
  }

  _getBookPath(props = null) {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.bookName)) {
      return _props.routeParams.bookName
    }
    return _props.routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(_props.routeParams.bookName)
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getBookPath(),
        entity: this.props.computeBook,
      },
      {
        id: this._getBookPath(),
        entity: this.props.computeBookEntries,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
    const computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this._getBookPath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    let page
    const isKidsTheme = this.props.routeParams.siteTheme === 'kids'

    if (!this.state.bookOpen) {
      page = (
        <BookEntry
          cover
          defaultLanguage={DEFAULT_LANGUAGE}
          pageCount={selectn('response.resultsCount', computeBookEntries)}
          entry={selectn('response', computeBook)}
          openBookAction={() => {
            this.setState({ bookOpen: true })
          }}
        />
      )
    } else {
      page = (
        <PaginatedBookEntryList
          style={{ overflowY: 'auto', maxHeight: '50vh' }}
          cols={5}
          cellHeight={150}
          disablePageSize
          defaultLanguage={DEFAULT_LANGUAGE}
          fetcher={this._fetchListViewData}
          fetcherParams={this.state.fetcherParams}
          metadata={selectn('response', computeBookEntries) || {}}
          items={selectn('response.entries', computeBookEntries) || []}
          appendControls={[
            this.state.bookOpen ? (
              <FVButton
                variant="contained"
                key="close"
                onClick={() => {
                  this.setState({ bookOpen: false })
                }}
              >
                <FVLabel
                  transKey="views.pages.explore.dialect.learn.songs_stories.close_book"
                  defaultStr="Close Book"
                  transform="first"
                />
              </FVButton>
            ) : (
              ''
            ),
          ]}
        />
      )
    }

    if (isKidsTheme) {
      return page
    }

    return (
      <DetailsViewWithActions
        labels={{ single: 'Book' }}
        itemPath={this._getBookPath()}
        actions={['workflow', 'edit', 'visibility', 'publish', 'add-child']}
        publishAction={this.props.publishBook}
        deleteAction={this.props.deleteBook}
        onNavigateRequest={this._onNavigateRequest}
        computeItem={computeBook}
        permissionEntry={computeDialect2}
        computeEntities={computeEntities}
        {...this.props}
      >
        {page}
      </DetailsViewWithActions>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeBook, computeBookEntries } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeBook,
    computeBookEntries,
    computeDialect2,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  deleteBook,
  deleteBookEntry,
  fetchBook,
  fetchBookEntries,
  fetchDialect2,
  publishBook,
  pushWindowPath,
  overrideBreadcrumbs,
}

export default connect(mapStateToProps, mapDispatchToProps)(SongsStoriesView)
