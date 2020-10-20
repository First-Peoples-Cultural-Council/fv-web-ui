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
import React from 'react'
import PropTypes from 'prop-types'
import Immutable, { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { fetchUser, userSuggestion, updateUser } from 'providers/redux/reducers/fvUser'
import { dictionaryListSmallScreenColumnDataTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
import selectn from 'selectn'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import DocumentListView from 'views/components/Document/DocumentListView'
import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import GroupAssignmentDialog from 'views/pages/users/group-assignment-dialog'
import withFilter from 'views/hoc/grid-list/with-filter'

const DefaultFetcherParams = { filters: { 'properties.dc:title': '', dialect: '' } }
const FilteredPaginatedMediaList = withFilter(DocumentListView, DefaultFetcherParams)

/**
 * List view for users
 */

const { array, bool, func, number, object, string } = PropTypes
export class UsersListView extends DataListView {
  static propTypes = {
    dialect: object,
    routeParams: object.isRequired,
    filter: object,
    data: string,
    gridListView: bool,
    DISABLED_SORT_COLS: array,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeUser: object.isRequired,
    computeUserSuggestion: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchUser: func.isRequired,
    pushWindowPath: func.isRequired,
    userSuggestion: func.isRequired,
    updateUser: func.isRequired,
  }
  static defaultProps = {
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100000,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_TYPE: 'asc',
    filter: new Map(),
    dialect: null,
    gridListView: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      columns: [
        {
          name: 'username',
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
          title: props.intl.trans('views.pages.explore.dialect.users.username', 'Username', 'first'),
        },
        {
          name: 'firstName',
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
          title: props.intl.trans('first_name', 'First Name', 'words'),
        },
        {
          name: 'lastName',
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
          title: props.intl.trans('last_name', 'Last Name', 'words'),
        },
        {
          name: 'email',
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.columnTitleCellRender,
          title: props.intl.trans('email', 'Email', 'first'),
        },
      ],
      sortInfo: {
        uiSortOrder: [],
        currentSortCols: this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.DEFAULT_SORT_TYPE,
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE,
      },
      fixedCols: true,
      userDialogOpen: false,
      selectedUserName: null,
    }

    // Reduce the number of columns displayed for mobile
    if (UIHelpers.isViewSize('xs')) {
      this.state.columns = this.state.columns.filter((v) => ['username', 'email'].indexOf(v.name) !== -1)
    }

    // Bind methods to 'this'
    ;[
      '_onNavigateRequest',
      '_onUserSelected',
      '_handleRefetch',
      '_handleSortChange',
      '_handleColumnOrderChange',
      '_resetColumns',
      '_handleClose',
      '_saveMethod',
      '_fetcher',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }
  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }

    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  _onUserSelected(user) {
    this.props.fetchUser(user.username)
    this.setState({ userDialogOpen: true, selectedUserName: user.username })
  }

  _handleClose() {
    this.setState({ open: false, userDialogOpen: false, selectedUserName: null })
  }

  _saveMethod(properties, userObj) {
    const whoWhen = `[${new Date().toLocaleString()}] ${selectn(
      'response.properties.username',
      this.props.computeLogin
    )}`

    this.props.updateUser(
      {
        'entity-type': 'user',
        id: properties.id,
        properties: {
          groups: properties.group || [],
          contributors: (selectn('properties.contributors', userObj) || '') + '\n' + whoWhen,
        },
      },
      null,
      this.props.intl.trans(
        'views.pages.explore.dialect.users.user_updated_successfully',
        'User updated successfully.',
        'first'
      )
    )

    this.setState({
      selectedUserName: null,
      userDialogOpen: false,
    })
  }

  _fetchListViewData(/*props, pageIndex, pageSize, sortOrder, sortBy*/) {
    this._fetcher()
  }

  _fetcher(filters = {}) {
    this.props.userSuggestion(this.props.routeParams.dialect_path, {
      displayEmailInSuggestion: true,
      searchType: 'USER_TYPE',
      groupRestriction: selectn('filters.group.appliedFilter', filters) || '',
      hideAdminGroups: true,
      searchTerm: selectn('filters.searchTerm.appliedFilter', filters) || '',
    })
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeUserSuggestion,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeUserSuggestion = ProviderHelpers.getEntry(
      this.props.computeUserSuggestion,
      this.props.routeParams.dialect_path
    )
    const computeDialect2 = this.props.dialect || this.getDialect()
    const computeUser = ProviderHelpers.getEntry(this.props.computeUser, this.state.selectedUserName)

    const normalizedComputeUserSuggestion = {
      response: {
        entries: (selectn('response', computeUserSuggestion) || []).filter((user) =>
          ['Administrator', 'Guest'].indexOf(user.username)
        ),
        totalSize: selectn('response.length', computeUserSuggestion),
      },
    }

    return (
      <PromiseWrapper hideFetch renderOnError computeEntities={computeEntities}>
        <FilteredPaginatedMediaList
          // objectDescriptions="users"
          // onSelectionChange={this._onUserSelected}
          // onSortChange={this._handleSortChange}
          // sortInfo={this.state.sortInfo.uiSortOrder}
          className="browseDataGrid"
          columns={this.state.columns}
          data={normalizedComputeUserSuggestion}
          dialect={selectn('response', computeDialect2)}
          fetcher={this._fetcher}
          filterOptionsKey="User"
          fixedCols={this.state.fixedCols}
          gridListView={this.props.gridListView}
          hasViewModeButtons={false}
          page={this.state.pageInfo.page}
          pageSize={this.state.pageInfo.pageSize}
          pagination={false}
          refetcher={this._handleRefetch}
          type="FVUser"
        />

        <GroupAssignmentDialog
          title={this.props.intl.trans('assign', 'Assign', 'first')}
          open={this.state.userDialogOpen}
          saveMethod={this._saveMethod}
          closeMethod={this._handleClose}
          fieldMapping={{
            id: 'id',
            title: 'properties.username',
            groups: 'properties.groups',
          }}
          selectedItem={selectn('response', computeUser)}
          dialect={computeDialect2}
        />
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvUser, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeUser, computeUserSuggestion } = fvUser
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computeUser,
    computeUserSuggestion,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchUser,
  pushWindowPath,
  userSuggestion,
  updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersListView)
