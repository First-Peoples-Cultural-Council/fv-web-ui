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
// LIBRARIES
// ----------------------------------------
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { deleteCategory, fetchCategories } from 'providers/redux/reducers/fvCategory'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

// CUSTOM
// ----------------------------------------
import { useGetCopy } from 'common'
import {
  batchTitle,
  batchFooter,
  batchRender,
  deleteSelected,
  getIcon,
  sortCol,
  useDeleteItem,
  useGetData,
  usePaginationRequest,
} from 'common/ListView'
import ConfirmationDelete from 'views/components/Confirmation'
import DictionaryList from 'views/components/Browsing/dictionary-list'
import FVButton from 'views/components/FVButton'
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import withPagination from 'views/hoc/grid-list/with-pagination'

import '!style-loader!css-loader!./styles.css'

// Phrasebooks
// ----------------------------------------
export const Phrasebooks = (props) => {
  const { computeCategories, routeParams, search } = props
  const { dialect_path, pageSize, page, siteTheme } = routeParams
  const { sortOrder, sortBy } = search

  const deleteApi = props.deleteCategory
  const dataPath = `${routeParams.dialect_path}/Phrase Books/`

  // HOOKS
  const [deletedUids, setDeletedUids] = useState([])
  const [deleteItemUid, setDeleteItemUid] = useState()
  const [paginationRequest, setPaginationRequest] = useState()
  const [selected, setSelected] = useState([])
  usePaginationRequest({ pushWindowPath: props.pushWindowPath, paginationRequest })
  useDeleteItem({
    deleteApi,
    deletedUids,
    deleteItemUid,
    selected,
    setDeletedUids,
    setSelected,
  })
  const copy = useGetCopy(async () => {
    const success = await import(/* webpackChunkName: "PhrasebooksInternationalization" */ './internationalization')
    return success.default
  })
  const computedData = useGetData({
    computeData: computeCategories,
    dataPath,
    deletedUids,
    getData: async () => {
      let currentAppliedFilter = '' // eslint-disable-line
      // TODO: ASK DANIEL ABOUT `filter` & `filter.currentAppliedFilter`
      // if (filter.has('currentAppliedFilter')) {
      //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
      // }

      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

      await props.fetchCategories(
        // `${routeParams.dialect_path}/Phrase Books/`,
        dataPath,
        `${currentAppliedFilter}&currentPageIndex=${page -
          1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}${startsWithQuery}`
      )
    },
    routeParams,
    search,
  })

  const _getColumns = () => {
    return [
      {
        name: 'batch',
        title: () => {
          return batchTitle({
            computedData,
            deletedUids,
            selected,
            setSelected,
            copyDeselect: copy.batch.deselect,
            copySelect: copy.batch.select,
          })
        },
        footer: () => {
          return batchFooter({
            colSpan: 4,
            confirmationAction: () => {
              deleteSelected({ deleteApi, deletedUids, selected, setDeletedUids, setSelected })
            },
            selected,
            copyItemsSelected: copy.itemsSelected,
          })
        },
        render: (value, data) => {
          return batchRender({
            dataUid: data.uid,
            selected,
            setSelected,
          })
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
                sortCol({
                  dialect_path,
                  newSortBy: 'dc:title',
                  urlItemType: 'phrasebooks',
                  pageSize,
                  pushWindowPath: props.pushWindowPath,
                  siteTheme,
                  sortOrder,
                })
              }}
            >
              {getIcon({ field: 'dc:title', sortOrder, sortBy })}
              <span>{copy.title.th}</span>
            </button>
          )
        },
        render: (v, data) => {
          const phrasebookDetailUrl = `/${siteTheme}${dialect_path}/phrasebook/${data.uid || ''}`
          return (
            <a
              className="DictionaryList__link"
              href={phrasebookDetailUrl}
              onClick={(e) => {
                e.preventDefault()
                NavigationHelpers.navigate(phrasebookDetailUrl, props.pushWindowPath, false)
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
                sortCol({
                  dialect_path,
                  newSortBy: 'dc:description',
                  urlItemType: 'phrasebooks',
                  pageSize,
                  pushWindowPath: props.pushWindowPath,
                  siteTheme,
                  sortOrder,
                })
              }}
            >
              {getIcon({ field: 'dc:description', sortOrder, sortBy })}
              <span>{copy.description.th}</span>
            </button>
          )
        },
        render: (v, data) => {
          const bio = selectn('properties.dc:description', data) || '-'
          return <div dangerouslySetInnerHTML={{ __html: bio }} />
        },
      },
      {
        name: 'actions',
        title: copy.actions.th,
        render: (v, data) => {
          const uid = data.uid
          const url = `/${siteTheme}${dialect_path}/edit/phrasebook/${uid}`

          return (
            <ul className="Phrasebooks__actions">
              <li className="Phrasebooks__actionContainer Phrasebooks__actionDelete">
                <ConfirmationDelete
                  reverse
                  compact
                  copy={{
                    isConfirmOrDenyTitle: copy.isConfirmOrDenyTitle,
                    btnInitiate: copy.btnInitiate,
                    btnDeny: copy.btnDeny,
                    btnConfirm: copy.btnConfirm,
                  }}
                  confirmationAction={() => {
                    setDeleteItemUid(uid)
                  }}
                />
              </li>
              <li className="Phrasebooks__actionContainer">
                <a
                  href={url}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(url, props.pushWindowPath, false)
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

  const DictionaryListWithPagination = withPagination(
    DictionaryList,
    10 // DefaultFetcherParams.pageSize
  )
  return copy ? (
    <>
      <FVButton
        className="Contributors__btnCreate"
        color="primary"
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate(`/${siteTheme}${dialect_path}/create/phrasebook`, props.pushWindowPath, false)
        }}
        variant="contained"
      >
        Create a new phrase book
      </FVButton>
      <DictionaryListWithPagination
        columns={_getColumns()}
        cssModifier="DictionaryList--contributors"
        items={selectn('response.entries', computedData)}
        // Pagination
        fetcher={(fetcherParams) => {
          setPaginationRequest(
            `/${siteTheme}${dialect_path}/phrasebooks/${fetcherParams.pageSize}/${fetcherParams.currentPageIndex}${
              window.location.search
            }`
          )
        }}
        fetcherParams={{ currentPageIndex: page, pageSize: pageSize }}
        metadata={selectn('response', computedData)}
      />
    </>
  ) : null
}

const { array, func, object, string } = PropTypes
Phrasebooks.propTypes = {
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  routeParams: object.isRequired,
  search: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
  pushWindowPath: func.isRequired,
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, navigation, windowPath } = state

  const { computeCategories } = fvCategory
  const { splitWindowPath, _windowPath } = windowPath

  const { route } = navigation

  return {
    computeCategories,
    routeParams: route.routeParams,
    search: route.search,
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
