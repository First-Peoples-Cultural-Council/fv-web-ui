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
import Immutable from 'immutable'

import classNames from 'classnames'
import provide from 'react-redux-provide'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import RaisedButton from 'material-ui/lib/raised-button'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import GeneralList from 'views/components/Browsing/general-list'
import { CardView } from './list-view'
import {getDialectClassname} from 'views/pages/explore/dialect/helpers'
import withFilter from 'views/hoc/grid-list/with-filter'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const DEFAULT_LANGUAGE = 'english'

const FilteredCardList = withFilter(GeneralList)

/**
 * Learn songs
 */
@provide
export default class PageDialectLearnStoriesAndSongs extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchBooks: PropTypes.func.isRequired,
    computeBooks: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    typeFilter: PropTypes.string,
    typePlural: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      filteredList: null,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', '_onEntryNavigateRequest', 'fixedListFetcher'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')

    newProps.fetchBooks(newProps.routeParams.dialect_path, '&sortBy=dc:title' + '&sortOrder=ASC')
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }
  }

  fixedListFetcher(list) {
    this.setState({
      filteredList: list,
    })
  }

  _onEntryNavigateRequest(item) {
    // NOTE: generateUIDPath: function (theme, item, pluralPathId)
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(
        this.props.routeParams.theme || 'explore',
        item,
        selectn('properties.fvbook:type', item) == 'story' ? 'stories' : 'songs'
      )
    )
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
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

    const isKidsTheme = this.props.routeParams.theme === 'kids'

    const listProps = {
      defaultLanguage: DEFAULT_LANGUAGE,
      filterOptionsKey: 'Books',
      fixedList: true,
      fixedListFetcher: this.fixedListFetcher,
      filteredItems: this.state.filteredList,
      card: <CardView />,
      area: this.props.routeParams.area,
      applyDefaultFormValues: true,
      formValues: { 'properties.fvbook:type': this.props.typeFilter },
      metadata: selectn('response', computeBooks),
      items: selectn('response.entries', computeBooks) || [],
      theme: this.props.routeParams.theme || 'explore',
      action: this._onEntryNavigateRequest,
    }

    let listView = <FilteredCardList {...listProps} />

    if (isKidsTheme) {
      listView = <GeneralList {...listProps} cols={3} theme={this.props.routeParams.theme} />
    }
    const dialectClassName = getDialectClassname(computeDialect2)
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
            >
              <RaisedButton
                label={intl.trans(
                  'views.pages.explore.dialect.learn.songs_stories.create_x_book',
                  'Create ' + this.props.typeFilter + ' Book',
                  'words',
                  [this.props.typeFilter]
                )}
                onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')}
                primary
              />
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
}
