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

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchBooks } from 'providers/redux/reducers/fvBook'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import FVButton from 'views/components/FVButton'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers, { appendPathArrayAfterLandmark, routeHasChanged } from 'common/NavigationHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import FVLabel from 'views/components/FVLabel/index'

import GeneralList from 'views/components/Browsing/general-list'
import { SongsStoriesCardView } from './list-view'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import withFilter from 'views/hoc/grid-list/with-filter'

const DEFAULT_LANGUAGE = 'english'

let FilteredCardList = null
/**
 * Learn songs
 */

const { array, func, object, string } = PropTypes
export class PageDialectLearnStoriesAndSongs extends Component {
  static propTypes = {
    typeFilter: string,
    typePlural: string,
    // REDUX: reducers/state
    computeBooks: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    properties: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchBooks: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  state = {
    filteredList: null,
  }

  // Fetch data on initial render
  async componentDidMount() {
    FilteredCardList = withFilter(GeneralList, { 'properties.fvbook:type': this.props.typeFilter })
    await this.fetchData(this.props)
  }

  // Refetch data on URL change
  async componentDidUpdate(prevProps) {
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      await this.fetchData(this.props)
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeBooks,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeBooks = ProviderHelpers.getEntry(this.props.computeBooks, this.props.routeParams.dialect_path)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    const isKidsTheme = this.props.routeParams.siteTheme === 'kids'

    const listProps = {
      defaultLanguage: DEFAULT_LANGUAGE,
      filterOptionsKey: 'Books',
      fixedList: true,
      fixedListFetcher: this.fixedListFetcher,
      filteredItems: this.state.filteredList,
      card: <SongsStoriesCardView />,
      area: this.props.routeParams.area,
      applyDefaultFormValues: true,
      formValues: { 'properties.fvbook:type': this.props.typeFilter },
      metadata: selectn('response', computeBooks),
      items: selectn('response.entries', computeBooks) || [],
      siteTheme: this.props.routeParams.siteTheme || 'explore',
      action: this._onEntryNavigateRequest,
    }

    let listView = null

    if (isKidsTheme) {
      listView = <GeneralList {...listProps} cols={3} siteTheme={this.props.routeParams.siteTheme} />
    } else {
      listView = FilteredCardList ? <FilteredCardList {...listProps} /> : null
    }
    const dialectClassName = getDialectClassname(computeDialect2)

    const hrefPath = `/${appendPathArrayAfterLandmark({
      pathArray: ['create'],
      splitWindowPath: this.props.splitWindowPath,
      landmarkArray: this.props.typeFilter === 'story' ? ['stories'] : ['songs'],
    })}`

    // const themePalette = this.props.properties.theme.palette.rawTheme.palette
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper', { hidden: isKidsTheme })}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              filter={{
                role: ['Record', 'Approve', 'Everything'],
                entity: selectn('response', computeDialect2),
                login: this.props.computeLogin,
              }}
              hideFromSections
              routeParams={this.props.routeParams}
            >
              <FVButton
                color="primary"
                variant="contained"
                className="PrintHide"
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
                <FVLabel
                  transKey="views.pages.explore.dialect.learn.songs_stories.create_x_book"
                  defaultStr={'Create ' + this.props.typeFilter + ' Book'}
                  transform="words"
                  params={[this.props.typeFilter]}
                />
              </FVButton>
              {/* <a
                className="_btn _btn--primary"
                style={{
                  backgroundColor: themePalette.primary1Color,
                }}
                href={hrefPath}
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
                {intl.trans(
                  'views.pages.explore.dialect.learn.songs_stories.create_x_book',
                  'Create ' + this.props.typeFilter + ' Book',
                  'words',
                  [this.props.typeFilter]
                )}
              </a> */}
            </AuthorizationFilter>
          </div>
        </div>

        <div className="row" style={{ marginBottom: '20px' }}>
          <div className={classNames('col-xs-12', { 'col-md-8': isKidsTheme, 'col-md-offset-2': isKidsTheme })}>
            <h1 className={classNames(dialectClassName, { hidden: isKidsTheme })}>
              {selectn('response.title', computeDialect2)} {StringHelpers.toTitleCase(this.props.typePlural)}
            </h1>
            {listView}
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  fetchData = (newProps) => {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')

    newProps.fetchBooks(newProps.routeParams.dialect_path, '&sortBy=dc:title' + '&sortOrder=ASC')
  }
  fixedListFetcher = (list) => {
    this.setState({
      filteredList: list,
    })
  }

  _onEntryNavigateRequest = (item) => {
    // NOTE: generateUIDPath: function (siteTheme, item, pluralPathId)
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(
        this.props.routeParams.siteTheme || 'explore',
        item,
        selectn('properties.fvbook:type', item) === 'story' ? 'stories' : 'songs'
      )
    )
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, fvPortal, navigation, nuxeo, windowPath } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computeBooks } = fvBook
  const { computeDialect2 } = fvDialect
  const { computePortal } = fvPortal
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeBooks,
    computeDialect2,
    computeLogin,
    computePortal,
    properties,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchBooks,
  fetchDialect2,
  fetchPortal,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLearnStoriesAndSongs)
