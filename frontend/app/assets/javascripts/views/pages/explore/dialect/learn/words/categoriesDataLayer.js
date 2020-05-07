/* Copyright 2016 First People's Cultural Council

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
import { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategories, fetchSharedCategories } from 'providers/redux/reducers/fvCategory'
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'
import { setListViewMode } from 'providers/redux/reducers/listView'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

class CategoriesDataLayer extends Component {
  _isMounted = false
  constructor(props) {
    super(props)

    this.state = {
      categoriesData: [],
    }
  }
  async componentDidMount() {
    this._isMounted = true
    const { routeParams } = this.props
    let categoryType = 'Categories'
    // Change category type to Phrasebooks if 'fetchPhraseBooks' is passed in as a prop
    if (this.props.fetchPhraseBooks) {
      categoryType = 'Phrase Books'
    }
    // Fetch dialect specific categories
    if (this.props.fetchLatest) {
      await this.props.fetchCategories(`/api/v1/path/${this.props.routeParams.dialect_path}/${categoryType}/@children`)
    } else {
      await ProviderHelpers.fetchIfMissing(
        `/api/v1/path/${routeParams.dialect_path}/${categoryType}/@children`,
        this.props.fetchCategories,
        this.props.computeCategories
      )
    }
    // Fetch Shared Categories
    await ProviderHelpers.fetchIfMissing(
      `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`,
      this.props.fetchSharedCategories,
      this.props.computeSharedCategories
    )
    const categories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      `/api/v1/path/${routeParams.dialect_path}/${categoryType}/@children`
    )
    const sharedCategories = ProviderHelpers.getEntry(
      this.props.computeSharedCategories,
      `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`
    )
    const categoriesEntries = selectn('response.entries', categories)

    if (this._isMounted) {
      this.setCategories(categoryType, categories, categoriesEntries, sharedCategories)
    }
  }

  render() {
    return this.props.children({
      categoriesData: this.state.categoriesData,
      categoriesRawData: this.state.categoriesRawData,
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setCategories = (categoryType, categories, categoriesEntries, sharedCategories) => {
    switch (categoryType) {
      case 'Categories':
        // Update state
        // Fallback to shared categories if no local categories
        this.setState({
          categoriesData:
            categoriesEntries && categoriesEntries.length > 0
              ? categoriesEntries
              : selectn('response.entries', sharedCategories),
          categoriesRawData: categoriesEntries && categoriesEntries.length > 0 ? categories : sharedCategories,
        })
        break

      default:
        // Update state with no fallback (for Phrase Books)
        this.setState({
          categoriesData: categoriesEntries && categoriesEntries.length > 0 ? categoriesEntries : [],
          categoriesRawData: categoriesEntries && categoriesEntries.length > 0 ? categories : [],
        })
        break
    }
  }
}

// PROPTYPES
const { array, func, object, string, bool } = PropTypes
CategoriesDataLayer.propTypes = {
  routeParams: object.isRequired,
  fetchLatest: bool,
  fetchPhraseBooks: bool,
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  computeSharedCategories: object.isRequired,
  computeCharacters: object.isRequired,
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  properties: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
  fetchSharedCategories: func.isRequired,
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  overrideBreadcrumbs: func.isRequired,
  pushWindowPath: func.isRequired,
  replaceWindowPath: func.isRequired,
  searchDialectUpdate: func,
}
// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const {
    document,
    fvCharacter,
    fvCategory,
    fvPortal,
    listView,
    navigation,
    nuxeo,
    searchDialect,
    windowPath,
    locale,
  } = state

  const { computeCategories, computeSharedCategories } = fvCategory
  const { computeCharacters } = fvCharacter
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { properties, route } = navigation
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeCategories,
    computeSharedCategories,
    computeCharacters,
    computeDocument,
    computeLogin,
    computePortal,
    computeSearchDialect,
    listView,
    properties,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchSharedCategories,
  fetchCharacters,
  fetchDocument,
  fetchPortal,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  searchDialectUpdate,
  setListViewMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesDataLayer)
