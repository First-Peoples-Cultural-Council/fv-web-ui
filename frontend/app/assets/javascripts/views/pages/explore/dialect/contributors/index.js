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
import { deleteContributor, fetchContributors } from 'providers/redux/reducers/fvContributor'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import NavigationClose from '@material-ui/icons/Close'
import NavigationCheck from '@material-ui/icons/Check'

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
import withPagination from 'views/hoc/grid-list/with-pagination'

import '!style-loader!css-loader!./Contributors.css'

// Contributors
// ----------------------------------------
function Contributors(props) {
  const { computeContributors, routeParams, search } = props
  const { dialect_path, pageSize, page, siteTheme } = routeParams
  const { sortOrder, sortBy } = search
  const deleteApi = props.deleteContributor

  // HOOKS
  const [deletedUids, setDeletedUids] = useState([])
  const [deleteItemUid, setDeleteItemUid] = useState()
  const [paginationRequest, setPaginationRequest] = useState()
  const [selected, setSelected] = useState([])

  usePaginationRequest({ pushWindowPath: props.pushWindowPath, paginationRequest })
  // NOTE: when deleteItemUid is updated, this will run:
  useDeleteItem({
    deleteApi,
    deletedUids,
    deleteItemUid,
    selected,
    setDeletedUids,
    setSelected,
  })

  const copy = useGetCopy(async () => {
    const success = await import(/* webpackChunkName: "ContributorsInternationalization" */ './internationalization')
    return success.default
  })

  const computedData = useGetData({
    computeData: computeContributors,
    dataPath: `${routeParams.dialect_path}/Contributors`,
    deletedUids,
    getData: async () => {
      // const { pageSize, page } = routeParams
      // const { sortBy, sortOrder } = search

      let currentAppliedFilter = '' // eslint-disable-line
      // if (filter.has('currentAppliedFilter')) {
      //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
      // }

      // Get contrinbutors
      await props.fetchContributors(
        `${routeParams.dialect_path}/Contributors`,
        `${currentAppliedFilter}&currentPageIndex=${page -
          1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
      )
    },
    routeParams,
    search,
  })

  const getColumns = () => {
    const urlItemType = 'contributors'

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
              className="Contributors__colSort"
              onClick={() => {
                sortCol({
                  dialect_path,
                  newSortBy: 'dc:title',
                  urlItemType,
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
        render: (value, data) => {
          const uid = data.uid
          const url = `/${siteTheme}${dialect_path}/contributor/${uid}`

          return (
            <a
              className="DictionaryList__link"
              href={url}
              onClick={(e) => {
                e.preventDefault()
                NavigationHelpers.navigate(url, props.pushWindowPath, false)
              }}
            >
              {value}
            </a>
          )
        },
      },
      {
        name: 'dc:description',
        title: () => {
          return (
            <button
              className="Contributors__colSort"
              onClick={() => {
                sortCol({
                  dialect_path,
                  newSortBy: 'dc:description',
                  urlItemType,
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
          const bio = selectn('properties.dc:description', data) ? (
            <div className="Contributors__biographyStatus">
              <NavigationCheck />
              <span className="Contributors__biographyText">Yes</span>
            </div>
          ) : (
            <div className="Contributors__biographyStatus">
              <NavigationClose />
              <span className="Contributors__biographyText">No</span>
            </div>
          )
          return bio
        },
      },
      {
        name: 'actions',
        title: copy.actions.th,
        render: (v, data) => {
          const uid = data.uid
          const url = `/${siteTheme}${dialect_path}/edit/contributor/${uid}`

          return (
            <ul className="Contributors__actions">
              <li className="Contributors__actionContainer Contributors__actionDelete">
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
              <li className="Contributors__actionContainer">
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
          NavigationHelpers.navigate(`/${siteTheme}${dialect_path}/create/contributor`, props.pushWindowPath, false)
        }}
        variant="contained"
      >
        Create a new contributor
      </FVButton>

      <DictionaryListWithPagination
        columns={getColumns(copy)}
        cssModifier="DictionaryList--contributors"
        items={selectn('response.entries', computedData)}
        // Pagination
        fetcher={(fetcherParams) => {
          setPaginationRequest(
            `/${siteTheme}${dialect_path}/contributors/${fetcherParams.pageSize}/${fetcherParams.currentPageIndex}${
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

const { func, object } = PropTypes
Contributors.propTypes = {
  // REDUX: reducers/state
  routeParams: object.isRequired,
  computeContributors: object.isRequired,
  search: object.isRequired,
  // REDUX: actions/dispatch/func
  deleteContributor: func.isRequired,
  fetchContributors: func.isRequired,
  pushWindowPath: func.isRequired,
}
Contributors.defaultProps = {
  fetchContributors: () => {},
  pushWindowPath: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, navigation } = state

  const { computeContributors } = fvContributor
  const { route } = navigation

  return {
    computeContributors,
    routeParams: route.routeParams,
    search: route.search,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  deleteContributor,
  fetchContributors,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contributors)
