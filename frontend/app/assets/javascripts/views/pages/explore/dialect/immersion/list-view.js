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
import { fetchLabels } from 'providers/redux/reducers/fvLabel'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'

import selectn from 'selectn'
import IntlService from 'views/services/intl'
import FVButton from 'views/components/FVButton'

import Edit from '@material-ui/icons/Edit'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'

import ImmersionTable from 'views/components/ImmersionTable'
import EditLabelModal from './Edit'
import CreateLabelModal from './Create'

/**
 * List view for words in immersion
 */
const { array, func, number, object, string } = PropTypes

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
  }
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      mappedTranslations: null,
      isEditingOpen: false,
      editingLabel: null,
      isCreatingOpen: false,
      creatingLabel: null,
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
    if (isNew) {
      this.setState({ isCreatingOpen: true, creatingLabel: label })
    } else {
      this.setState({ isEditingOpen: true, editingLabel: label })
    }
  }

  closeModal = (save = false) => {
    this.setState({ isEditingOpen: false, editingLabel: null, isCreatingOpen: false, creatingLabel: null })
    if (save) {
      this.fetchData(this.props)
    }
  }

  renderEditButton(label, isNew) {
    const { intl } = this.props
    return (
      <FVButton
        type="button"
        variant="flat"
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
    const { allLabels, allCategories, computeLabels, intl } = this.props
    const computedLabels = ProviderHelpers.getEntry(computeLabels, this._getPathOrParentID(this.props))
    const translatedLabels = selectn('response.entries', computedLabels)

    if (allLabels.length === 0 || !translatedLabels || allCategories.length === 0) {
      this.setState({ mappedTranslations: null })
      return
    }
    const mappedLabels = allLabels.map((v) => {
      const strings = v.template_strings.split(',').map((s) => '%s')
      const templateStrings = v.template_strings.split(',')
      const label = {
        labelKey: v.id,
        type: v.type,
        templateStrings,
        categoryId: v.category,
        base: intl.trans(v.id, 'Translated Label', null, strings),
        translation: undefined,
        category: undefined,
        editButton: undefined,
        uid: undefined,
      }
      const category = allCategories.find((c) => {
        return c.id === v.category
      })
      label.category = category ? category.label : undefined
      const translatedLabel = translatedLabels.find((l) => {
        return l.properties['fvlabel:labelKey'] === v.id
      })
      if (translatedLabel) {
        label.translation = translatedLabel.properties['dc:title']
        label.uid = translatedLabel.uid
      }
      label.editButton = this.renderEditButton(label, !translatedLabel)

      return label
    })
    this.setState({ mappedTranslations: mappedLabels })
    return
  }

  render() {
    const { computeLabels, computeDialect2, routeParams, dialect, selectedCategory, selectedFilter } = this.props
    const { mappedTranslations, isEditingOpen, editingLabel, isCreatingOpen, creatingLabel } = this.state

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
        {!mappedTranslations ? (
          'Loading...'
        ) : (
          <ImmersionTable
            mappedTranslations={mappedTranslations}
            routeParams={routeParams}
            selectedCategory={selectedCategory}
            selectedFilter={selectedFilter}
          />
        )}
        {<EditLabelModal open={isEditingOpen} handleClose={(save) => this.closeModal(save)} label={editingLabel} />}
        {
          <CreateLabelModal
            dialectPath={routeParams.dialect_path + '/Label Dictionary'}
            open={isCreatingOpen}
            handleClose={(save) => this.closeModal(save)}
            label={creatingLabel}
          />
        }
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
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchLabels,
  fetchDialect2,
}

export default connect(mapStateToProps, mapDispatchToProps)(ImmersionListView)
