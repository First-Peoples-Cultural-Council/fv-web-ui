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
import Immutable, { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchLabels } from 'reducers/fvLabel'
import { fetchDialect2 } from 'reducers/fvDialect'

import selectn from 'selectn'
import FVButton from 'components/FVButton'

import Edit from '@material-ui/icons/Edit'

import PromiseWrapper from 'components/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'

import ImmersionTable from './ImmersionTable'
import LabelModal from './Modal'
import SearchFields from './Search'

/**
 * List view for words in immersion
 */
const { array, func, object, string } = PropTypes

class ImmersionListView extends Component {
  static propTypes = {
    parentID: string,
    routeParams: object.isRequired,
    allLabels: array,
    allCategories: array,
    selectedCategory: string,
    selectedFilter: string,
    // // Search
    // // REDUX: reducers/state
    intl: object.isRequired,
    computeDialect2: object.isRequired,
    computeLabels: object.isRequired,
    fetchDialect2: func.isRequired,
    fetchLabels: func.isRequired,
    locale: string.isRequired,
  }
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      allTranslations: null,
      mappedTranslations: null,
      isEditingOpen: false,
      editingLabel: null,
      isNew: false,
    }
  }

  componentDidMount() {
    this.fetchData(this.props)
    this.mapTranslatedLabels()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.computeLabels !== prevProps.computeLabels ||
      this.props.allLabels.length !== prevProps.allLabels.length ||
      this.props.allCategories.length !== prevProps.allCategories.length
    ) {
      this.mapTranslatedLabels()
    }
  }

  _getPathOrParentID = (newProps) => {
    return newProps.parentID ? newProps.parentID : `${newProps.routeParams.dialect_path}/Label Dictionary`
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  fetchData(newProps) {
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }
    newProps.fetchLabels(this._getPathOrParentID(newProps), '')
  }

  openModal(label, isNew) {
    this.setState({ isEditingOpen: true, editingLabel: label, isNew })
  }

  closeModal = (save = false) => {
    this.setState({ isEditingOpen: false, editingLabel: null })
    if (save) {
      this.fetchData(this.props)
    }
  }

  renderEditButton(label, isNew) {
    const { intl } = this.props
    return (
      <FVButton
        type="button"
        variant="text"
        size="small"
        component="a"
        className="DictionaryList__linkEdit PrintHide"
        href={''}
        onClick={(e) => {
          e.preventDefault()
          this.openModal(label, isNew)
        }}
      >
        <Edit title={intl.trans('edit', 'Edit', 'first')} />
      </FVButton>
    )
  }

  mapTranslatedLabels() {
    const { allLabels, allCategories, computeLabels, intl, locale } = this.props
    const computedLabels = ProviderHelpers.getEntry(computeLabels, this._getPathOrParentID(this.props))
    const translatedLabels = selectn('response.entries', computedLabels)

    if (allLabels.length === 0 || !translatedLabels || allCategories.length === 0) {
      this.setState({ mappedTranslations: null })
      return
    }
    const mappedLabels = allLabels.map((v) => {
      // eslint-disable-next-line
      const strings = v.template_strings.split(',').map((s) => '%s')
      const templateStrings = v.template_strings.split(',')
      const label = {
        labelKey: v.id,
        type: v.type,
        templateStrings,
        categoryId: v.category,
        base: intl.trans(v.id, 'Translated Label', null, strings, null, null, locale),
        translation: undefined,
        category: undefined,
        editButton: undefined,
        editClick: () => {},
        uid: undefined,
        relatedAudio: undefined,
        state: 'N/A',
      }
      const category = allCategories.find((c) => {
        return c.id === v.category
      })
      label.category = category ? category.label : undefined
      const translatedLabel = translatedLabels.find((l) => {
        return l.properties['fvlabel:labelKey'] === v.id
      })
      if (translatedLabel) {
        label.state = translatedLabel.state
        label.translation = translatedLabel.properties['dc:title']
        label.uid = translatedLabel.uid
        label.relatedAudio = translatedLabel.properties['fv:related_audio'][0]
      }
      label.editButton = this.renderEditButton(label, !translatedLabel)
      label.editClick = () => this.openModal(label, !translatedLabel)

      return label
    })
    this.setState({ mappedTranslations: mappedLabels, allTranslations: mappedLabels })
    return
  }

  setMappedTranslations = (mappedTranslations) => {
    this.setState({ mappedTranslations })
  }

  render() {
    const { computeLabels, computeDialect2, routeParams, dialect, selectedCategory, selectedFilter } = this.props
    const { mappedTranslations, allTranslations, isEditingOpen, editingLabel, isNew } = this.state

    const computeEntities = Immutable.fromJS([
      {
        id: this._getPathOrParentID(this.props),
        entity: computeLabels,
      },
    ])
    // If dialect not supplied, promise wrapper will need to wait for compute dialect
    if (!dialect) {
      computeEntities.push(
        new Map({
          id: routeParams.dialect_path,
          entity: computeDialect2,
        })
      )
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {!allTranslations ? (
          'Loading...'
        ) : (
          <div>
            <SearchFields items={allTranslations} setResults={this.setMappedTranslations} />
            <ImmersionTable
              mappedTranslations={mappedTranslations || []}
              routeParams={routeParams}
              selectedCategory={selectedCategory}
              selectedFilter={selectedFilter}
            />
          </div>
        )}
        <LabelModal
          isNew={isNew}
          dialectPath={routeParams.dialect_path}
          open={isEditingOpen}
          handleClose={(save) => this.closeModal(save)}
          label={editingLabel}
        />
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvLabel, locale } = state

  const { computeLabels } = fvLabel
  const { computeDialect2 } = fvDialect
  const { intlService } = locale

  return {
    computeDialect2,
    computeLabels,
    intl: intlService,
    locale: locale.locale,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchLabels,
  fetchDialect2,
}

export default connect(mapStateToProps, mapDispatchToProps)(ImmersionListView)
