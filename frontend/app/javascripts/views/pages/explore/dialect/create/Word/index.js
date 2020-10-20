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
// import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createWord } from 'providers/redux/reducers/fvWord'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
// import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
// import fields from 'models/schemas/fields'
// import options from 'models/schemas/options'
// import IntlService from 'views/services/intl'

import Select from 'views/components/Form/Common/Select'
import Text from 'views/components/Form/Common/Text'
import Checkbox from 'views/components/Form/Common/Checkbox'
import FormContributors from 'views/components/Form/FormContributors'
import FormCulturalNotes from 'views/components/Form/FormCulturalNotes'
import FormDefinitions from 'views/components/Form/FormDefinitions'
import FormLiteralTranslations from 'views/components/Form/FormLiteralTranslations'
import FormRelatedAudio from 'views/components/Form/FormRelatedAudio'
import FormRelatedPictures from 'views/components/Form/FormRelatedPictures'
import FormRelatedVideos from 'views/components/Form/FormRelatedVideos'
import FormCategories from 'views/components/Form/FormCategories'
import FormRelatedPhrases from 'views/components/Form/FormRelatedPhrases'
import StringHelpers from 'common/StringHelpers'

import { getError, getErrorFeedback, getFormData, handleSubmit } from 'common/FormHelpers'
import validator, { toParse } from './validation'
import copy from './internationalization'

// const intl = IntlService.instance

const { string, array, func, object } = PropTypes
export class CreateV2 extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeWord: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createWord: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
      wordPath: null,
      errors: [],
    }

    this.form = React.createRef()
  }

  // Fetch data on initial render
  componentDidMount() {
    this._fetchData(this.props)
  }

  // Refetch data on URL change
  // componentWillReceiveProps(nextProps) {
  //   let currentWord
  //   let nextWord

  //   if (this.state.wordPath != null) {
  //     currentWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
  //     nextWord = ProviderHelpers.getEntry(nextProps.computeWord, this.state.wordPath)
  //   }

  //   if (nextProps.windowPath !== this.props.windowPath) {
  //     this._fetchData(nextProps)
  //   }

  //   // 'Redirect' on success
  //   if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
  //     NavigationHelpers.navigate(
  //       NavigationHelpers.generateUIDPath(nextProps.routeParams.siteTheme, selectn('response', nextWord), 'words'),
  //       nextProps.replaceWindowPath,
  //       true
  //     )
  //   }
  // }

  // shouldComponentUpdate(newProps) {
  //   switch (true) {
  //     case newProps.windowPath != this.props.windowPath:
  //       return true

  //     case newProps.computeDialect2 != this.props.computeDialect2:
  //       return true

  //     case newProps.computeWord != this.props.computeWord:
  //       return true
  //     default: // Note: do nothing
  //   }

  //   return false
  // }

  render() {
    // const FVWordOptions = Object.assign({}, selectn('FVWord', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.wordPath,
        entity: this.props.computeWord,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    // const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    // if (
    //   selectn('fields.fv:definitions.item.fields.language.attrs', FVWordOptions) &&
    //   selectn('response.properties.fvdialect:dominant_language', computeDialect2)
    // ) {
    //   FVWordOptions.fields['fv:definitions'].item.fields.language.attrs.defaultValue = selectn(
    //     'response.properties.fvdialect:dominant_language',
    //     computeDialect2
    //   )
    // }

    const { errors } = this.state
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>
          {/* {intl.trans(
            'views.pages.explore.dialect.learn.words.add_new_word_to_x',
            'Add New Word to ' + selectn('response.title', computeDialect2),
            null,
            [selectn('response.title', computeDialect2)]
          )} */}
          {copy.title(selectn('response.title', computeDialect2))}
        </h1>

        <form
          className="CreateV2"
          ref={this.form}
          onSubmit={(e) => {
            e.preventDefault()
            this._onRequestSaveForm()
          }}
        >
          {/* WORD --------------- */}
          <Text
            className="Form__group"
            id={StringHelpers.clean('dc:title', 'CLEAN_ID')}
            labelText="Word"
            name="dc:title"
            value=""
            error={getError({ errors, fieldName: 'dc:title' })}
          />
          {/* PARTOFSPEECH --------------- */}
          <Select
            className="Form__group"
            id={StringHelpers.clean('fv-word:part_of_speech', 'CLEAN_ID')}
            labelText="Part of speech"
            name="fv-word:part_of_speech"
            value="basic"
          >
            {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
            <optgroup>
              <option value="basic">Basic</option>
              <option value="verb">Verb</option>
              <option value="noun">Noun</option>
              <option value="pronoun">Pronoun</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="interjection">Interjection</option>
              <option value="particle">Particle</option>
              <option value="command">Command</option>
              <option value="advanced">Advanced</option>
              <option value="pronoun_personal">Pronoun - Personal</option>
              <option value="pronoun_reflexive">Pronoun - Reflexive</option>
              <option value="pronoun_reciprocal">Pronoun - Reciprocal</option>
              <option value="pronoun_demonstrative">Pronoun - Demonstrative</option>
              <option value="pronoun_relative">Pronoun - Relative</option>
              <option value="particle_postposition">Particle - Postposition</option>
              <option value="particle_quantifier">Particle - Quantifier</option>
              <option value="particle_article_determiner">Particle - Article/Determiner</option>
              <option value="particle_tense_aspect">Particle - Tense/Aspect</option>
              <option value="particle_modal">Particle - Modal</option>
              <option value="particle_conjunction">Particle - Conjunction</option>
              <option value="particle_auxiliary_verb">Particle - Auxiliary Verb</option>
              <option value="particle_adjective">Particle - Adjective</option>
              <option value="particle_adverb">Particle - Adverb</option>
              <option value="entity_noun_like_word">Entity (Noun-like word)</option>
              <option value="event_activity_verb_like_word">Event/Activity (Verb-like word)</option>
              <option value="event_activity_verb_like_word_transitive">
                Event/Activity (Verb-like word) - transitive
              </option>
              <option value="event_activity_verb_like_word_intransitive">
                Event/Activity (Verb-like word) - intransitive
              </option>
              <option value="event_activity_verb_like_word_reflexive">
                Event/Activity (Verb-like word) - reflexive
              </option>
              <option value="event_activity_verb_like_word_reciprocal">
                Event/Activity (Verb-like word) - reciprocal
              </option>
              <option value="suffix_prefix">Suffix / Prefix</option>
              <option value="question_word">Question word</option>
            </optgroup>
          </Select>
          {/* PRONOUNCIATION --------------- */}
          <Text
            className="Form__group"
            id={StringHelpers.clean('fv-word:pronunciation', 'CLEAN_ID')}
            labelText="Pronounciation"
            name="fv-word:pronunciation"
            value=""
            error={getError({ errors, fieldName: 'fv-word:pronunciation' })}
          />

          {/* Definitions --------------- */}
          <FormDefinitions className="Form__group" name="fv:definitions" />

          {/* Literal Translations --------------- */}
          <FormLiteralTranslations className="Form__group" name="fv:literal_translation" />

          {/* RELATED AUDIO --------------- */}
          <FormRelatedAudio className="Form__group" name="fv:related_audio" />

          {/* RELATED PICTURES --------------- */}
          <FormRelatedPictures className="Form__group" name="fv:related_pictures" />

          {/* RELATED VIDEOS --------------- */}
          <FormRelatedVideos className="Form__group" name="fv:related_pictures" />
          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyRelatedVideoBrowse" className="visually-hidden">
            {'Select a video from previously uploaded items'}
          </span>
          <span id="describedByRelatedVideoMove" className="visually-hidden">
            {`If you are adding multiple Related Videos, you can change the position of the Related Video with
the 'Move Related Video left' and 'Move Related Video right' buttons`}
          </span>

          {/* Related Phrases --------------- */}
          <FormRelatedPhrases className="Form__group" name="fv-word:related_phrases" />
          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyRelatedPhraseBrowse" className="visually-hidden">
            {'Select a video from previously uploaded items'}
          </span>
          <span id="describedByRelatedPhraseMove" className="visually-hidden">
            {`If you are adding multiple Related Phrases, you can change the position of the Related Phrase with
the 'Move Related Phrase up' and 'Move Related Phrase down' buttons`}
          </span>

          {/* CATEGORIES --------------- */}
          <FormCategories className="Form__group" name="fv-word:categories" />

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedByCategoryMove" className="visually-hidden">
            {`If you are adding multiple Categories, you can change the position of the Category with
the 'Move Category up' and 'Move Category down' buttons`}
          </span>
          {/* Cultural Notes --------------- */}
          <FormCulturalNotes className="Form__group" name="fv:cultural_note" />
          {/* REFERENCE --------------- */}
          <div className="Form__group">
            <Text
              className=""
              id="CreateWord__Reference1"
              labelText="Reference"
              name="fv:reference"
              ariaDescribedby="describedByReference"
              value=""
            />
            <span id="describedByReference">Origin of record (person, book, etc).</span>
          </div>
          {/* ACKNOWLEDGEMENT --------------- */}
          <div className="Form__group">
            <Text
              className=""
              id="CreateWord__Acknowledgement"
              labelText="Acknowledgement"
              name="fv-word:acknowledgement"
              ariaDescribedby="describedByAcknowledgement"
              value=""
            />
            <span id="describedByAcknowledgement">Acknowledgement or Data Usage</span>
          </div>
          {/* Contributors --------------- */}
          <FormContributors
            className="Form__group"
            textInfo="Contributors who helped create this record."
            name="fv:source"
          />
          {/* IN CHILDREN'S ARCHIVE --------------- */}
          <Checkbox
            className="Form__group"
            id="CreateWord__InKidsArchive0"
            labelText="Available in children's archive"
            name="fv:available_in_childrens_archive"
          />
          {/* IN GAMES --------------- */}
          <Checkbox
            className="Form__group"
            id="CreateWord__InGames0"
            labelText="Available in games"
            name="fv-word:available_in_games"
          />

          {getErrorFeedback({ errors })}
          <button type="submit">{copy.submit}</button>
        </form>
      </PromiseWrapper>
    )
  }

  _fetchData = (newProps) => {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  _onRequestSaveForm = async () => {
    const formData = getFormData({
      formReference: this.form,
      toParse,
    })

    const valid = () => {
      const now = Date.now()
      this.props.createWord(
        this.props.routeParams.dialect_path + '/Dictionary',
        {
          type: 'FVWord',
          name: now.toString(),
          properties: formData,
        },
        null,
        now
      )
      this.setState({
        errors: [],
      })
    }

    const invalid = (response) => {
      this.setState({
        errors: response.errors,
      })
    }

    handleSubmit({
      validator,
      formData,
      valid,
      invalid,
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvWord, windowPath } = state

  const { computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeWord,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createWord,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateV2)
