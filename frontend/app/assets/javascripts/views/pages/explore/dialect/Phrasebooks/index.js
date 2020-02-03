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
import { deleteCategory, fetchCategories } from 'providers/redux/reducers/fvCategory'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { setRouteParams } from 'providers/redux/reducers/navigation'

// CUSTOM
// ----------------------------------------
import { useGetCopy } from 'common'
import { useGetData, usePaginationRequest } from 'common/ListView'
import ConfirmationDelete from 'views/components/Confirmation'
import FVButton from 'views/components/FVButton'
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import withPagination from 'views/hoc/grid-list/with-pagination'
import { dictionaryListSmallScreenColumnDataTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
import '!style-loader!css-loader!./styles.css'

const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))

// Phrasebooks
// ----------------------------------------
export const Phrasebooks = (props) => {
  const { computeCategories, routeParams, search } = props
  const { dialect_path, pageSize, page, siteTheme } = routeParams
  const { sortOrder, sortBy } = search
  const dataPath = `${routeParams.dialect_path}/Phrase Books/`

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
        dataPath,
        `${currentAppliedFilter}&currentPageIndex=${page -
          1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}${startsWithQuery}`
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
        sortBy: 'dc:title',
      },
      {
        name: 'dc:description',
        title: copy.description.th,
        render: (v, data) => {
          const bio = selectn('properties.dc:description', data) || '-'
          return <div dangerouslySetInnerHTML={{ __html: bio }} />
        },
        sortBy: 'dc:description',
      },
      {
        name: 'actions',
        title: copy.actions.th,
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const uid = data.uid
          const url = `/${siteTheme}${dialect_path}/edit/phrasebook/${uid}`

          return (
            <ul className="Phrasebooks__actions">
              <li className="Phrasebooks__actionContainer Phrasebooks__actionDelete">
                <ConfirmationDelete
                  reverse
                  compact
                  copyIsConfirmOrDenyTitle={copy.isConfirmOrDenyTitle}
                  copyBtnInitiate={copy.btnInitiate}
                  copyBtnDeny={copy.btnDeny}
                  copyBtnConfirm={copy.btnConfirm}
                  confirmationAction={() => {
                    props.deleteCategory(uid)
                    setDeletedUids([...deletedUids, uid])
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
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryListWithPagination
          // Listview: Batch
          batchTitleSelect="Deselect all"
          batchTitleDeselect="Select all"
          batchFooterIsConfirmOrDenyTitle="Delete selected phrase books?"
          batchFooterBtnInitiate="Delete"
          batchFooterBtnDeny="No, do not delete the selected phrase books"
          batchFooterBtnConfirm="Yes, delete the selected phrase books"
          batchConfirmationAction={(uids) => {
            // Delete all items in selected
            uids.forEach((uid) => {
              props.deleteCategory(uid)
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
              `/${siteTheme}${dialect_path}/phrasebooks/${fetcherParams.pageSize}/${fetcherParams.currentPageIndex}${window.location.search}`
            )
          }}
          fetcherParams={{ currentPageIndex: page, pageSize: pageSize }}
          metadata={selectn('response', computedData)}
        />
      </Suspense>
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
  deleteCategory,
  fetchCategories,
  pushWindowPath,
  setRouteParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(Phrasebooks)
