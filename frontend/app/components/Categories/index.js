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
import { deleteCategory, fetchCategories } from 'reducers/fvCategory'
import { pushWindowPath } from 'reducers/windowPath'
import { setRouteParams } from 'reducers/navigation'

// CUSTOM
// ----------------------------------------
import { useGetCopy } from 'common/useGetCopy'
import { useGetData, usePaginationRequest } from 'common/ListView'
import ConfirmationDelete from 'components/Confirmation'
import FVButton from 'components/FVButton'
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import withPagination from 'components/withPagination'
import { dictionaryListSmallScreenColumnDataTemplate } from 'components/DictionaryList/DictionaryListSmallScreen'

import '!style-loader!css-loader!./styles.css'

const DictionaryList = React.lazy(() => import('components/DictionaryList/DictionaryList'))

const categoryType = {
  title: { plural: 'Categories', singular: 'Category' },
  label: { plural: 'categories', singular: 'category' },
}

// Categories
// ----------------------------------------
export const Categories = (props) => {
  const { computeCategories, routeParams, search } = props
  const { dialect_path, pageSize, page, siteTheme } = routeParams
  const { sortOrder, sortBy } = search
  const dataPath = `${routeParams.dialect_path}/${categoryType.title.plural}/`

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
    const success = await import(/* webpackChunkName: "Categorycopy" */ 'components/Category/copy.js')
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
          const categoryDetailUrl = `/${siteTheme}${dialect_path}/${categoryType.label.singular}/${data.uid || ''}`
          return (
            <a
              className="DictionaryList__link"
              href={categoryDetailUrl}
              onClick={(e) => {
                e.preventDefault()
                NavigationHelpers.navigate(categoryDetailUrl, props.pushWindowPath, false)
              }}
            >
              {v}
            </a>
          )
        },
        sortBy: 'dc:title',
      },
      {
        name: 'parentCategory',
        title: copy.parentCategory.th,
        render: (v, data) => {
          const categoryDetailUrl = `/${siteTheme}${dialect_path}/${categoryType.label.singular}/${data.parentRef ||
            ''}`
          const parentCategory =
            data.contextParameters.parentDoc.title == 'Categories' ? false : data.contextParameters.parentDoc.title
          if (parentCategory) {
            return (
              <a
                className="DictionaryList__link"
                href={categoryDetailUrl}
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(categoryDetailUrl, props.pushWindowPath, false)
                }}
              >
                {parentCategory}
              </a>
            )
          }
          return <div>-</div>
        },
        sortBy: 'ecm:parentId',
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
          const url = `/${siteTheme}${dialect_path}/edit/${categoryType.label.singular}/${uid}`

          return (
            <ul className="Categories__actions">
              <li className="Categories__actionContainer Categories__actionDelete">
                <ConfirmationDelete
                  reverse
                  compact
                  copyIsConfirmOrDenyTitle={copy.edit.isConfirmOrDenyTitle}
                  copyBtnInitiate={copy.edit.btnInitiate}
                  copyBtnDeny={copy.edit.btnDeny}
                  copyBtnConfirm={copy.edit.btnConfirm}
                  confirmationAction={() => {
                    props.deleteCategory(uid)
                    setDeletedUids([...deletedUids, uid])
                  }}
                />
              </li>
              <li className="Categories__actionContainer">
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
          NavigationHelpers.navigate(
            `/${siteTheme}${dialect_path}/create/${categoryType.label.singular}`,
            props.pushWindowPath,
            false
          )
        }}
        variant="contained"
      >
        Create a new {categoryType.title.singular}
      </FVButton>
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryListWithPagination
          hasViewModeButtons={false}
          // Listview: Batch
          batchTitleSelect={copy.batch.deselect}
          batchTitleDeselect={copy.batch.select}
          batchFooterIsConfirmOrDenyTitle={copy.batch.isConfirmOrDenyTitle}
          batchFooterBtnInitiate={copy.edit.btnInitiate}
          batchFooterBtnDeny={copy.batch.btnDeny}
          batchFooterBtnConfirm={copy.batch.btnConfirm}
          batchConfirmationAction={(uids) => {
            // Delete all items in selected
            uids.forEach((uid) => {
              props.deleteCategory(uid)
            })
            setDeletedUids([...deletedUids, ...uids])
          }}
          // Listview: computed data
          computedData={computedData}
          navigationRouteSearch={props.search}
          routeParams={props.routeParams}
          setRouteParams={setRouteParams}
          sortHandler={async (sortData) => {
            await setRouteParams({
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
              `/${siteTheme}${dialect_path}/${categoryType.label.plural}/${fetcherParams.pageSize}/${fetcherParams.currentPageIndex}${window.location.search}`
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
Categories.propTypes = {
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
  setRouteParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)
