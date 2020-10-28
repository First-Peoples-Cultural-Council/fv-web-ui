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
import { fetchCategories } from 'reducers/fvCategory'
import { fetchCharacters } from 'reducers/fvCharacter'
import { fetchDocument } from 'reducers/document'
import { fetchPortal } from 'reducers/fvPortal'
import { overrideBreadcrumbs } from 'reducers/navigation'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'
import { setListViewMode } from 'reducers/listView'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

class CategoriesData extends Component {
  constructor(props) {
    super(props)

    this.catPath = ''
    this.categoryType = props.fetchPhraseBooks ? 'Phrase Books' : 'Categories'
    this.state = {
      categoriesData: [],
      categoriesRawData: [],
    }
  }
  componentDidMount() {
    this.catPath = `/api/v1/path/${this.props.routeParams.dialect_path}/${this.categoryType}/@children`
    const { categories } = this.getDataSet()

    // Fetch dialect specific categories
    if (selectn('action', categories) !== 'FV_CATEGORIES_QUERY_START') {
      if (this.props.fetchLatest) {
        this.props.fetchCategories(this.catPath)
      } else {
        ProviderHelpers.fetchIfMissing(this.catPath, this.props.fetchCategories, this.props.computeCategories)
      }
    }
  }

  render() {
    const { categories } = this.getDataSet()
    const { categoriesData, categoriesRawData } = this.getCategories(this.categoryType, categories)
    return this.props.children({
      categoriesData,
      categoriesRawData,
    })
  }

  /*
  Returns: {
    categories,
  }
  */
  getDataSet() {
    return {
      categories: ProviderHelpers.getEntry(this.props.computeCategories, this.catPath),
    }
  }
  /*
  Returns: {
    categoriesData: [],
    categoriesRawData: [],
  }
  */
  getCategories = (categoryType, categories) => {
    const categoriesEntries = selectn('response.entries', categories)

    if (categoryType === 'Categories') {
      // Wait for a response from categories before returning data
      if (selectn('action', categories) === 'FV_CATEGORIES_QUERY_START') {
        return {
          categoriesData: undefined,
          categoriesRawData: undefined,
        }
      }
      // Update state
      return {
        categoriesData: categoriesEntries && categoriesEntries.length > 0 ? categoriesEntries : [],
        categoriesRawData: categoriesEntries && categoriesEntries.length > 0 ? categories : [],
      }
    }

    // Update state with no fallback (for Phrase Books)
    return {
      categoriesData: categoriesEntries && categoriesEntries.length > 0 ? categoriesEntries : [],
      categoriesRawData: categoriesEntries && categoriesEntries.length > 0 ? categories : [],
    }
  }
}

// PROPTYPES
const { array, func, object, string, bool } = PropTypes
CategoriesData.propTypes = {
  routeParams: object.isRequired,
  fetchPhraseBooks: bool,
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  computeCharacters: object.isRequired,
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  properties: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
  fetchLatest: bool,
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  overrideBreadcrumbs: func.isRequired,
  pushWindowPath: func.isRequired,
  replaceWindowPath: func.isRequired,
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

  const { computeCategories } = fvCategory
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
  fetchCharacters,
  fetchDocument,
  fetchPortal,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  setListViewMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesData)
