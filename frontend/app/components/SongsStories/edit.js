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
import Immutable, { List } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchBook, fetchBookEntries, updateBookEntry, deleteBookEntry } from 'reducers/fvBook'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'
import FVLabel from 'components/FVLabel'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'

// Views
import BookEntryEdit from 'components/SongsStories/entry/edit'
import BookEntryList from 'components/SongsStories/entry/list-view'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import withForm from 'components/withForm'
import { string } from 'prop-types'

const DEFAULT_LANGUAGE = 'english'

const DEFAULT_SORT_ORDER = '&sortOrder=asc,asc&sortBy=fvbookentry:sort_map,dc:created'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class PageDialectBookEdit extends Component {
  static propTypes = {
    intl: object,
    book: object,
    typePlural: string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeBook: object.isRequired,
    computeBookEntries: object.isRequired,
    computeDialect2: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchBook: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchBookEntries: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    updateBookEntry: func.isRequired,
    deleteBookEntry: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    editPageDialogOpen: false,
    editPageItem: null,
    formValue: null,
    sortedItems: List(),
    componentState: STATE_LOADING,
    is403: false,
    tabValue: 0,
  }

  // Redirect on success
  componentDidUpdate(prevProps) {
    let currentBook
    let nextBook
    if (this._getBookPath() !== null) {
      currentBook = ProviderHelpers.getEntry(prevProps.computeBook, this._getBookPath())
      nextBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
    }

    if (
      selectn('wasUpdated', currentBook) != selectn('wasUpdated', nextBook) &&
      selectn('wasUpdated', nextBook) === true
    ) {
      // 'Redirect' on success
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(
          this.props.routeParams.siteTheme,
          selectn('response', nextBook),
          this.props.typePlural.toLowerCase()
        ),
        this.props.replaceWindowPath,
        true
      )
    } else {
      const book = selectn('response', ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath()))
      const title = selectn('properties.dc:title', book)
      const uid = selectn('uid', book)

      if (title && selectn('pageTitleParams.bookName', this.props.properties) != title) {
        this.props.changeTitleParams({ bookName: title })
        this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.bookName' })
      }
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData()
  }

  render() {
    const content = this._getContent()
    return content
  }

  _getContent = () => {
    let content = null
    switch (this.state.componentState) {
      case STATE_DEFAULT: {
        content = this._stateGetDefault()
        break
      }
      default:
        content = this._stateGetLoading()
    }
    return content
  }
  fetchData = async () => {
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)

    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    if (_computeDialect2.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: _computeDialect2.message == '403',
        errorMessage: _computeDialect2.message,
      })
      return
    }

    await this.props.fetchBook(this._getBookPath())
    await this.props.fetchBookEntries(this._getBookPath(), DEFAULT_SORT_ORDER)

    this.setState({
      componentState: STATE_DEFAULT,
      errorMessage: undefined,
    })
  }

  _handleSaveOrder = () => {
    // Save sort order if it has changed
    if (!this.state.sortedItems.isEmpty()) {
      this.state.sortedItems.forEach((page, key) => {
        const orderAsString = String(key).padStart(5, '0')
        // fvbookentry:sort_map is stored as a string - so need to pad with 0 for proper sorting
        this.props.updateBookEntry(page.set({ 'fvbookentry:sort_map': orderAsString }), null, null, null, null, null, {
          headers: { 'enrichers.document': '' },
        })
      })
    }
  }

  _handleDeleteBookEntry = (pageToDelete) => {
    this.props.deleteBookEntry(pageToDelete.uid)
  }

  _handleCancel = () => {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.pushWindowPath)
  }

  _storeSortOrder = (items) => {
    this.setState({
      sortedItems: items,
    })
  }

  _editPage = (item) => {
    this.setState({ editPageDialogOpen: true, editPageItem: item })
  }

  _getBookPath = (props = null) => {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.bookName)) {
      return _props.routeParams.bookName
    }
    return _props.routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(_props.routeParams.bookName)
  }

  _pageSaved = () => {
    // Ensure update is complete before re-fetch.
    setTimeout(
      function pageSavedSetTimeout() {
        this.props.fetchBookEntries(this._getBookPath(), DEFAULT_SORT_ORDER)
      }.bind(this),
      500
    )
    this.setState({ editPageDialogOpen: false, editPageItem: null })
  }

  _stateGetDefault = () => {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getBookPath(),
        entity: this.props.computeBook,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this._getBookPath(),
        entity: this.props.computeBookEntries,
      },
    ])

    const _computeBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
    const _computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this._getBookPath())
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', _computeDialect2) && selectn('response', _computeBook)) {
      const providedFilter =
        selectn('response.properties.fv-phrase:definitions[0].translation', _computeBook) ||
        selectn('response.properties.fv:literal_translation[0].translation', _computeBook)
      context = Object.assign(selectn('response', _computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', _computeBook),
          providedFilter: providedFilter,
        },
      })
    }

    const title = selectn('response.properties.dc:title', _computeBook)
    const queryParams = new URLSearchParams(window.location.search)
    const mode = queryParams.get('mode')

    return (
      <AuthenticationFilter.Container
        is403={this.state.is403}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <div>
          {mode === 'cover' ||
            (mode === null && (
              <div style={{ padding: 8 * 3 }}>
                {title && (
                  <Typography variant="h3">
                    <>
                      <FVLabel
                        transKey="views.pages.explore.dialect.learn.songs_stories.edit_x_book"
                        defaultStr={'Edit ' + title + ' Book Cover'}
                        transform="words"
                        params={[title]}
                      />
                    </>
                  </Typography>
                )}
                <EditViewWithForm
                  computeEntities={computeEntities}
                  computeDialect={_computeDialect2}
                  initialValues={context}
                  itemId={this._getBookPath()}
                  fields={fields}
                  options={options}
                  cancelMethod={this._handleCancel}
                  currentPath={this.props.splitWindowPath}
                  navigationMethod={this.props.pushWindowPath}
                  type="FVBook"
                  routeParams={this.props.routeParams}
                />
              </div>
            ))}
          {mode === 'pages' && (
            <div style={{ padding: 8 * 3 }}>
              {title && (
                <Typography variant="h5">
                  <FVLabel transKey="" defaultStr={'Edit ' + title + ' pages'} transform="first" params={[title]} />
                </Typography>
              )}
              <BookEntryList
                reorder
                pushWindowPath={this.props.pushWindowPath}
                splitWindowPath={this.props.splitWindowPath}
                sortOrderChanged={this._storeSortOrder}
                handleDelete={this._handleDeleteBookEntry}
                handleSaveOrder={this._handleSaveOrder}
                defaultLanguage={DEFAULT_LANGUAGE}
                editAction={this._editPage}
                innerStyle={{ minHeight: 'inherit' }}
                metadata={selectn('response', _computeBookEntries) || {}}
                items={
                  this.state.sortedItems.isEmpty
                    ? selectn('response.entries', _computeBookEntries) || []
                    : this.state.sortedItems
                }
              />
            </div>
          )}

          <Dialog
            fullWidth
            maxWidth="md"
            open={this.state.editPageDialogOpen}
            onClose={() => this.setState({ editPageDialogOpen: false })}
          >
            <DialogContent>
              <BookEntryEdit
                entry={this.state.editPageItem}
                handlePageSaved={this._pageSaved}
                dialectEntry={_computeDialect2}
                {...this.props}
              />
            </DialogContent>
          </Dialog>
        </div>
      </AuthenticationFilter.Container>
    )
  }

  _stateGetLoading = () => {
    return <StateLoading copy={this.state.copy} />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvBook, fvDialect, navigation, windowPath, locale } = state

  const { computeBook, computeBookEntries } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { properties } = navigation
  const { intlService } = locale

  return {
    computeBook,
    computeBookEntries,
    computeDialect2,
    properties,
    splitWindowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchBook,
  fetchDialect2,
  fetchBookEntries,
  overrideBreadcrumbs,
  deleteBookEntry,
  updateBookEntry,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectBookEdit)
