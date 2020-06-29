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
import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { deleteContributor, fetchContributors } from 'providers/redux/reducers/fvContributor'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { setRouteParams } from 'providers/redux/reducers/navigation'

import NavigationClose from '@material-ui/icons/Close'
import NavigationCheck from '@material-ui/icons/Check'

// CUSTOM
// ----------------------------------------
import { useGetCopy } from 'common'
import { useGetData, usePaginationRequest } from 'common/ListView'
import ConfirmationDelete from 'views/components/Confirmation'
import FVButton from 'views/components/FVButton'

import NavigationHelpers from 'common/NavigationHelpers'
import withPagination from 'views/hoc/grid-list/with-pagination'
import { dictionaryListSmallScreenColumnDataTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
import '!style-loader!css-loader!./styles.css'

const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))

// Recorders
//
// Note: Contributors, Recorders and Phrasebooks are quite similar and
// Recorders is practically identical to Contributors but I didn't want
// to pass props to Contributors to make it work with Recorders.
//
// It would have been a confusing mix of 3 similar pages but 2 components
// and Contributors would need to have conditionals checking for passed
// in Recorder props.
//
// Despite some duplication between Recorders & Contributors,
// it does allow for flexibility on how we render the Recorders table.
// ----------------------------------------
function Recorders(props) {
  const { computeContributors, routeParams, search } = props
  const { dialect_path, pageSize, page, siteTheme } = routeParams
  const { sortOrder, sortBy } = search

  // HOOKS
  const [deletedUids, setDeletedUids] = useState([])
  /*
  NOTE: Pagination
    The `DictionaryListWithPagination > fetcher` prop is called with pagination events.
    `fetcher` updates `paginationRequest` via `setPaginationRequest` and the
    `usePaginationRequest` hook below calls `NavigationHelpers.navigate` whenever
    `paginationRequest` changes
  */
  const [paginationRequest, setPaginationRequest] = useState()
  usePaginationRequest({ pushWindowPath: props.pushWindowPath, paginationRequest })

  const copy = useGetCopy(async () => {
    const success = await import(/* webpackChunkName: "RecordersInternationalization" */ './internationalization')
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
    return [
      {
        name: 'title',
        title: copy.title.th,
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
        render: (value, data) => {
          const url = `/${siteTheme}${dialect_path}/recorder/${data.uid}`

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
        sortBy: 'dc:title',
      },
      {
        name: 'dc:description',
        title: copy.description.th,
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
        sortBy: 'dc:description',
      },
      {
        name: 'actions',
        title: copy.actions.th,
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const uid = data.uid
          const url = `/${siteTheme}${dialect_path}/edit/recorder/${uid}`

          return (
            <ul className="Contributors__actions">
              <li className="Contributors__actionContainer Contributors__actionDelete">
                <ConfirmationDelete
                  reverse
                  compact
                  copyIsConfirmOrDenyTitle={copy.isConfirmOrDenyTitle}
                  copyBtnInitiate={copy.btnInitiate}
                  copyBtnDeny={copy.btnDeny}
                  copyBtnConfirm={copy.btnConfirm}
                  confirmationAction={() => {
                    props.deleteContributor(uid)
                    setDeletedUids([...deletedUids, uid])
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
          NavigationHelpers.navigate(`/${siteTheme}${dialect_path}/create/recorder`, props.pushWindowPath, false)
        }}
        variant="contained"
      >
        Create a new recorder
      </FVButton>
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryListWithPagination
          // Listview: Batch
          batchTitleSelect="Deselect all"
          batchTitleDeselect="Select all"
          batchFooterIsConfirmOrDenyTitle="Delete Recorders?"
          batchFooterBtnInitiate="Delete"
          batchFooterBtnDeny="No, do not delete the selected recorders"
          batchFooterBtnConfirm="Yes, delete the selected recorders"
          batchConfirmationAction={(uids) => {
            // Delete all items in selected
            uids.forEach((uid) => {
              props.deleteContributor(uid)
            })
            setDeletedUids([...deletedUids, ...uids])
          }}
          // Listview: computed data
          computedData={computedData}
          sortHandler={async (sortData) => {
            await props.setRouteParams({
              search: {
                page: sortData.page,
                pageSize: sortData.pageSize,
                sortOrder: sortData.sortOrder,
                sortBy: sortData.sortBy,
              },
            })
            NavigationHelpers.navigate(sortData.urlWithQuery, props.pushWindowPath, false)
          }}
          // ==================================================
          columns={getColumns()}
          cssModifier="DictionaryList--contributors"
          items={selectn('response.entries', computedData)}
          // Pagination
          fetcher={(fetcherParams) => {
            setPaginationRequest(
              `/${siteTheme}${dialect_path}/recorders/${fetcherParams.pageSize}/${fetcherParams.currentPageIndex}${window.location.search}`
            )
          }}
          fetcherParams={{ currentPageIndex: page, pageSize: pageSize }}
          metadata={selectn('response', computedData)}
        />
      </Suspense>
    </>
  ) : null
}

const { func, object } = PropTypes
Recorders.propTypes = {
  // REDUX: reducers/state
  routeParams: object.isRequired,
  computeContributors: object.isRequired,
  search: object.isRequired,
  // REDUX: actions/dispatch/func
  deleteContributor: func.isRequired,
  fetchContributors: func.isRequired,
  pushWindowPath: func.isRequired,
}
Recorders.defaultProps = {
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
  setRouteParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(Recorders)
