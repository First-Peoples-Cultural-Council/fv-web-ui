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
// import classNames from 'classnames'
import selectn from 'selectn'

// Immutable
import Immutable, { Map } from 'immutable' // eslint-disable-line

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { deleteCategory, fetchCategories } from 'providers/redux/reducers/fvCategory'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

import ProviderHelpers from 'common/ProviderHelpers'
import DocumentListView from 'views/components/Document/DocumentListView'

import PhrasebookDelete from 'views/components/Confirmation'
import PhrasebooksSelected from 'views/pages/explore/dialect/Contributors/ContributorsSelected'
import Checkbox from 'views/components/Form/Common/Checkbox'

import { STATE_UNAVAILABLE } from 'common/Constants'

import '!style-loader!css-loader!./styles.css'

let phrasebooksPath = undefined
let _computeCategories = undefined
let _computeDialect2 = undefined
const { array, func, number, object, string } = PropTypes

const iconUnsorted = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
  </svg>
)
const iconSortAsc = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)
const iconSortDesc = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)
export class Phrasebooks extends Component {
  static propTypes = {
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    editUrl: string,
    filter: object, // NOTE: ask Daniel how to use this
    copy: object,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeCategories: object.isRequired,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    search: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategories: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    // DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    filter: new Map(),
  }
  state = {
    componentState: STATE_UNAVAILABLE,
    copy: {
      actions: {
        th: '',
        edit: '',
        delete: '',
      },
      batch: {
        select: '',
        deselect: '',
      },
      title: {
        th: '',
      },
      description: {
        th: '',
      },
    },
    deletedUids: [],
    selected: [],
  }

  async componentDidMount() {
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "PhrasebooksInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    this._getData({ copy })
  }

  async componentDidUpdate(prevProps) {
    const { computeCategories, computeDialect2, routeParams } = this.props

    if (this._paginationHasUpdated(prevProps)) {
      await this._getData()
    }
    _computeCategories = ProviderHelpers.getEntry(computeCategories, phrasebooksPath)
    _computeDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  }

  render() {
    const { routeParams } = this.props
    const { dialect_path, pageSize, page, theme } = routeParams
    return (
      <div>
        <a
          className="_btn _btn--primary Contributors__btnCreate"
          href={`/${theme}${dialect_path}/create/phrasebook`}
          onClick={(e) => {
            e.preventDefault()
            NavigationHelpers.navigate(`/${theme}${dialect_path}/create/phrasebook`, this.props.pushWindowPath, false)
          }}
        >
          Create a new phrase book
        </a>
        <DocumentListView
          cssModifier="DictionaryList--phrasebooks"
          sortInfo={this.sortInfo.uiSortOrder} // TODO: NOT USED?
          className="browseDataGrid"
          columns={this._getColumns()}
          data={this._filterDeletedData()}
          dialect={selectn('response', _computeDialect2)}
          gridCols={4}
          gridListView={false}
          page={Number(page)}
          pageSize={Number(pageSize)}
          refetcher={this.handleRefetch}
          type="FVCategory"
        />
      </div>
    )
  }

  handleRefetch = (componentProps, page, pageSize) => {
    const { routeParams } = this.props
    const { theme, dialect_path } = routeParams
    const url = `/${theme}${dialect_path}/phrasebooks/${pageSize}/${page}${window.location.search}`
    NavigationHelpers.navigate(url, this.props.pushWindowPath, false)
  }

  sortInfo = {
    uiSortOrder: [],
    currentSortCols: this.props.DEFAULT_SORT_COL,
    currentSortType: this.props.DEFAULT_SORT_TYPE,
  }

  _deleteItem = async (uid) => {
    /* NOTE: save uid to state */
    this.setState(
      {
        deletedUids: [...this.state.deletedUids, uid],
      },
      () => {
        this.props.deleteCategory(uid)
        this._toggleCheckbox(false, uid)
      }
    )
  }

  _deleteSelected = async () => {
    const { selected } = this.state
    this.setState(
      {
        deletedUids: [...this.state.deletedUids, ...selected],
      },
      () => {
        selected.forEach(async (uid) => {
          await this.props.deleteCategory(uid)
        })
        this.setState({
          selected: [],
        })
      }
    )
  }

  _filterDeletedData = () => {
    const { deletedUids } = this.state
    if (_computeCategories && _computeCategories.isFetching === false && _computeCategories.success) {
      const _entries = _computeCategories.response.entries
      const filtered = _entries.reduce((accumulator, entry) => {
        const isDeleted = deletedUids.find((uid) => {
          return uid === entry.uid
        })
        if (isDeleted === undefined) {
          return [...accumulator, entry]
        }
        return accumulator
      }, [])
      const filteredComputeCategories = Object.assign({}, _computeCategories)
      filteredComputeCategories.response.entries = filtered
      return filteredComputeCategories
    }
    return _computeCategories
  }

  _filterDeletedUids = () => {
    const { deletedUids } = this.state
    if (_computeCategories && _computeCategories.isFetching === false && _computeCategories.success) {
      const _entries = _computeCategories.response.entries
      const filtered = _entries.reduce((accumulator, entry) => {
        const isDeleted = deletedUids.find((uid) => {
          return uid === entry.uid
        })
        if (isDeleted === undefined) {
          return [...accumulator, entry]
        }
        return accumulator
      }, [])
      return filtered
    }
    return []
  }

  _getAllItems = () => {
    const filteredData = this._filterDeletedUids()

    const uids = filteredData.reduce((accumulator, item) => {
      return [...accumulator, item.uid]
    }, [])
    return uids
  }

  _getColumns = () => {
    const { copy } = this.state
    const { routeParams, editUrl } = this.props
    const { theme, dialect_path } = routeParams

    return [
      {
        name: 'batch',
        title: () => {
          const allItems = this._getAllItems()
          // All items selected, show deselect
          if (allItems.length === this.state.selected.length && allItems.length !== 0) {
            return (
              <button className="_btn _btn--compact" type="button" onClick={this._selectNone}>
                {copy.batch.deselect}
              </button>
            )
          }
          // show select
          return (
            <button className="_btn _btn--compact" type="button" onClick={this._selectAll}>
              {copy.batch.select}
            </button>
          )
        },
        footer: () => {
          return {
            colSpan: 4,
            element: (
              <PhrasebooksSelected
                confirmationAction={this._deleteSelected}
                selected={this.state.selected}
                copy={copy.itemsSelected}
              />
            ),
          }
        },
        render: (value, data) => {
          const uid = data.uid
          const isSelected = this._isSelected(uid)
          return (
            <Checkbox
              selected={isSelected}
              id={uid}
              value={uid}
              name="batch"
              labelText=""
              handleChange={this._toggleCheckbox}
            />
          )
        },
      },
      {
        name: 'title',
        title: () => {
          return (
            <button
              type="button"
              className="Phrasebooks__colSort"
              onClick={() => {
                this._sortCol({
                  // sortBy: 'fv:custom_order',
                  sortBy: 'dc:title',
                })
              }}
            >
              {/* {this._getIcon('fv:custom_order')} */}
              {this._getIcon('dc:title')}
              <span>{copy.title.th}</span>
            </button>
          )
        },
        render: (v, data /*, cellProps*/) => {
          const phrasebookDetailUrl = `/${theme}${dialect_path}/phrasebook/${data.uid || ''}`
          return (
            <a
              href={phrasebookDetailUrl}
              onClick={(e) => {
                e.preventDefault()
                NavigationHelpers.navigate(phrasebookDetailUrl, this.props.pushWindowPath, false)
              }}
            >
              {v}
            </a>
          )
        },
      },
      {
        name: 'dc:description',
        title: () => {
          return (
            <button
              className="Phrasebooks__colSort"
              onClick={() => {
                this._sortCol({
                  sortBy: 'dc:description',
                })
              }}
            >
              {this._getIcon('dc:description')}
              <span>{copy.description.th}</span>
            </button>
          )
        },
        render: (v, data /*, cellProps*/) => {
          const bio = selectn('properties.dc:description', data) || '-'
          return <div dangerouslySetInnerHTML={{ __html: bio }} />
        },
      },
      {
        name: 'actions',
        title: copy.actions.th,
        render: (v, data /*, cellProps*/) => {
          const uid = data.uid
          const url = editUrl ? `${editUrl}/${uid}` : `/${theme}${dialect_path}/edit/phrasebook/${uid}`

          return (
            <ul className="Phrasebooks__actions">
              <li className="Phrasebooks__actionContainer Phrasebooks__actionDelete">
                <PhrasebookDelete
                  reverse
                  compact
                  copy={{
                    isConfirmOrDenyTitle: copy.isConfirmOrDenyTitle,
                    btnInitiate: copy.btnInitiate,
                    btnDeny: copy.btnDeny,
                    btnConfirm: copy.btnConfirm,
                  }}
                  confirmationAction={() => {
                    this._deleteItem(uid)
                  }}
                />
              </li>
              <li className="Phrasebooks__actionContainer">
                <a
                  href={url}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(url, this.props.pushWindowPath, false)
                  }}
                >
                  {copy.actions.edit}
                </a>
              </li>
            </ul>
          )
        },
      },
    ]
  }

  _getData = async (addToState) => {
    const { routeParams, search /*, filter*/ } = this.props
    const { pageSize, page } = routeParams
    const { sortBy, sortOrder } = search

    let currentAppliedFilter = '' // eslint-disable-line
    // TODO: ASK DANIEL ABOUT `filter` & `filter.currentAppliedFilter`
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }

    phrasebooksPath = `${routeParams.dialect_path}/Phrase Books/`
    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

    await this.props.fetchCategories(
      phrasebooksPath,
      `${currentAppliedFilter}&currentPageIndex=${page -
        1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}${startsWithQuery}`
    )
    // NOTE: redux doesn't update on changes to deeply nested data, hence the manual re-render
    this.setState({
      rerender: Date.now(),
      ...addToState,
    })
  }

  _getIcon = (field) => {
    const { search } = this.props
    const { sortOrder, sortBy } = search

    if (sortBy === field) {
      return sortOrder === 'asc' ? iconSortAsc : iconSortDesc
    }
    return iconUnsorted
  }

  _isSelected = (uid) => {
    const exists = this.state.selected.find((selectedUid) => {
      return selectedUid === uid
    })
    return exists ? true : false
  }

  _paginationHasUpdated = (prevProps) => {
    const { routeParams, search } = this.props
    const { pageSize, page } = routeParams
    const { sortBy, sortOrder } = search

    const { routeParams: prevRouteParams, search: prevSearch } = prevProps
    const { pageSize: prevPageSize, page: prevPage } = prevRouteParams
    const { sortBy: prevSortBy, sortOrder: prevSortOrder } = prevSearch

    if (pageSize !== prevPageSize || page !== prevPage || sortBy !== prevSortBy || sortOrder !== prevSortOrder) {
      return true
    }
    return false
  }

  _selectAll = () => {
    const uids = this._getAllItems()

    this.setState({
      selected: uids,
    })
  }

  _selectNone = () => {
    this.setState({
      selected: [],
    })
  }

  _sortCol = (arg) => {
    const { routeParams, search } = this.props
    const { theme, dialect_path, pageSize } = routeParams
    const { sortOrder } = search

    const url = `/${theme}${dialect_path}/phrasebooks/${pageSize}/1?sortBy=${arg.sortBy}&sortOrder=${
      sortOrder === 'asc' ? 'desc' : 'asc'
    }`
    NavigationHelpers.navigate(url, this.props.pushWindowPath, false)
  }

  _toggleCheckbox = (checked, uid) => {
    let selected = [...this.state.selected]

    const exists = this._isSelected(uid)
    if (checked && !exists) {
      selected.push(uid)
    }
    // remove if exists
    if (!checked && exists) {
      selected = selected.filter((selectedUid) => {
        return selectedUid !== uid
      })
    }

    this.setState({
      selected,
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, navigation, windowPath } = state

  const { computeCategories } = fvCategory
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  const { route } = navigation

  return {
    computeCategories,
    routeParams: route.routeParams,
    search: route.search,
    computeDialect,
    computeDialect2,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  deleteCategory,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Phrasebooks)
